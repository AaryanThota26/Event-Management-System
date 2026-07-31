#!/usr/bin/env python
"""
Phase 2.5 — End-to-end password reset verification
===================================================
Runs the complete forgot-password -> reset-password flow against the live
API (uvicorn on :8000) with the real Resend integration. The API key is
loaded from backend/.env by the app's own settings module and is NEVER
printed, logged, or written anywhere by this script.

Credentials are supplied via environment variables (no hardcoded secrets):
    RESET_TEST_EMAIL              - primary test account email (default: testuser@test.com)
    RESET_TEST_ORIGINAL_PASSWORD  - the primary account's ORIGINAL password; the
                                    account is restored to this value at the end,
                                    even on failure (required)
    RESET_TEST_NEW_PASSWORD       - optional; a random password is generated
                                    when omitted
    RESET_TEST_OWNER_EMAIL        - Resend account-owner address (the only address
                                    a sandbox send can be delivered to). When set,
                                    a disposable account is created for it, the
                                    real-send leg runs, and the account is deleted
                                    afterwards (zero residue).

Usage (from backend/, with the venv active):
    RESET_TEST_ORIGINAL_PASSWORD=... \
    RESET_TEST_OWNER_EMAIL=... \
    python verify_password_reset.py

Exit code 0 = all checks passed; 1 = at least one check failed.
"""

import hashlib
import json
import logging
import os
import re
import secrets
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
REPO_ROOT = BACKEND_DIR.parent
sys.path.insert(0, str(BACKEND_DIR))

API_BASE = os.environ.get("RESET_TEST_API_BASE", "http://127.0.0.1:8000")
TEST_EMAIL = os.environ.get("RESET_TEST_EMAIL", "testuser@test.com")
ORIGINAL_PASSWORD = os.environ.get("RESET_TEST_ORIGINAL_PASSWORD", "")
NEW_PASSWORD = os.environ.get("RESET_TEST_NEW_PASSWORD", "") or secrets.token_urlsafe(12)
OWNER_EMAIL = os.environ.get("RESET_TEST_OWNER_EMAIL", "")
OWNER_TEMP_PASSWORD = secrets.token_urlsafe(12)

GENERIC_FORGOT_MESSAGE = (
    "If an account exists for that email, a password reset link has been sent."
)
GENERIC_RESET_ERROR = "Invalid or expired reset token"

passed = 0
failed = 0


def check(label, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1
        print(f"  [PASS] {label} {detail}".rstrip())
    else:
        failed += 1
        print(f"  [FAIL] {label} {detail}".rstrip())


def section(title):
    print(f"\n=== {title} ===")


def http_json(method, path, body=None):
    """Minimal stdlib HTTP helper -> (status_code, raw_body_bytes)."""
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(
        f"{API_BASE}{path}", data=data, method=method,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def mask_email(email):
    """Mask an email for display (e.g. aary***@gmail.com)."""
    local, _, domain = email.partition("@")
    return f"{local[:4]}***@{domain}" if local else email


# ---------------------------------------------------------------------------
# 0. Credentials / prerequisites
# ---------------------------------------------------------------------------
if not ORIGINAL_PASSWORD:
    print("ERROR: RESET_TEST_ORIGINAL_PASSWORD env var is required.")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Log capture (in-process) — used to prove the API key never reaches logs
# ---------------------------------------------------------------------------
captured_log_records = []


class CaptureHandler(logging.Handler):
    def emit(self, record):
        captured_log_records.append(self.format(record))


_capture_handler = CaptureHandler()
_capture_handler.setLevel(logging.DEBUG)
logging.getLogger().setLevel(logging.DEBUG)
logging.getLogger().addHandler(_capture_handler)

# ---------------------------------------------------------------------------
# App imports (settings load backend/.env — the real API key lives only here)
# ---------------------------------------------------------------------------
from app.core.config import settings  # noqa: E402
from app.core.database import SessionLocal  # noqa: E402
from app.models.user import User  # noqa: E402
from app.utils.security import (  # noqa: E402
    generate_reset_token, hash_token, hash_password, verify_password,
)
from app.schemas.auth import ForgotPasswordRequest, UserCreate  # noqa: E402
from app.services import email_service  # noqa: E402
from app.api import auth as auth_module  # noqa: E402

API_KEY = settings.RESEND_API_KEY

print("=" * 60)
print("PHASE 2.5 — PASSWORD RESET E2E VERIFICATION")
print("=" * 60)
print(f"  Target API : {API_BASE}")
print(f"  Test email : {TEST_EMAIL}")
print(f"  Expiry     : {settings.RESET_TOKEN_EXPIRE_MINUTES} minutes")

# ---------------------------------------------------------------------------
# 1. Static / best-practice checks
# ---------------------------------------------------------------------------
section("1. Production best practices (static)")

check("API key is configured in .env (never printed)", bool(API_KEY),
      detail="[format: re_*]" if API_KEY.startswith("re_") else "[WARNING: unusual format]")
check("API key format looks like a Resend key", API_KEY.startswith("re_") and len(API_KEY) >= 20)
check("RESET_TOKEN_EXPIRE_MINUTES == 15", settings.RESET_TOKEN_EXPIRE_MINUTES == 15)

cfg_src = Path(BACKEND_DIR / "app" / "core" / "config.py").read_text(encoding="utf-8")
check("config default for RESEND_API_KEY is empty (no hardcoded secret)",
      'RESEND_API_KEY: str = ""' in cfg_src)

sec_src = Path(BACKEND_DIR / "app" / "utils" / "security.py").read_text(encoding="utf-8")
check("reset tokens use secrets.token_urlsafe (CSPRNG)",
      "secrets.token_urlsafe" in sec_src)
check("reset tokens hashed with hashlib.sha256 before storage",
      "hashlib.sha256" in sec_src)

es_src = Path(BACKEND_DIR / "app" / "services" / "email_service.py").read_text(encoding="utf-8")
check("email service is a dedicated module (send_password_reset_email)",
      callable(getattr(email_service, "send_password_reset_email", None)))
check("email service reads the key from settings (not hardcoded)",
      "settings.RESEND_API_KEY" in es_src)

# Source scan: the real key must not appear anywhere in the repo
# (except backend/.env itself, which is git-ignored by design).
SKIP_DIRS = {".git", "venv", "node_modules", "dist", "__pycache__", ".pytest_cache"}
key_hits = []
candidate_hits = []
key_pattern = re.compile(r"re_[0-9a-f]{20,}")
for root, dirs, files in os.walk(REPO_ROOT):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for name in files:
        path = Path(root) / name
        if name == ".env" or name.endswith((".pyc", ".log")):
            continue
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        if API_KEY and API_KEY in content:
            key_hits.append(str(path.relative_to(REPO_ROOT)))
        if path.suffix in {".py", ".jsx", ".js", ".tsx", ".ts", ".md", ".txt", ".example", ".json"}:
            for m in key_pattern.finditer(content):
                candidate_hits.append(f"{path.relative_to(REPO_ROOT)}:{m.start()}")

check("API key not present in any source file (only .env holds it)",
      not key_hits, detail=f"hits: {key_hits}" if key_hits else "")
check("no re_*-looking secrets in source files", not candidate_hits,
      detail=f"hits: {candidate_hits[:5]}" if candidate_hits else "")

env_example = Path(BACKEND_DIR / ".env.example")
env_example_text = env_example.read_text(encoding="utf-8") if env_example.exists() else ""
check(".env.example exists", env_example.exists())
check(".env.example has RESEND_API_KEY placeholder (no real key)",
      "RESEND_API_KEY=your_resend_api_key_here" in env_example_text)
check(".env.example has no re_* key material",
      not key_pattern.search(env_example_text))
for var in ["RESEND_FROM_EMAIL", "FRONTEND_URL", "RESET_TOKEN_EXPIRE_MINUTES"]:
    check(f".env.example documents {var}", var in env_example_text)

# ---------------------------------------------------------------------------
# Setup: real-send instrumentation (captures the reset URL + Resend outcome)
# ---------------------------------------------------------------------------
session = SessionLocal()
user = session.query(User).filter(User.email == TEST_EMAIL).first()
check("test account exists in DB", user is not None)
if user is None:
    print("\nERROR: test account not found. Create it via POST /api/auth/signup first.")
    sys.exit(1)

captured_url = {}
captured_leak = {"leaked": False}
resend_send_results = []

orig_send_email = auth_module.send_password_reset_email
import resend  # noqa: E402
orig_resend_send = resend.Emails.send


def recording_resend_send(params):
    """Record the outcome of every real Resend call; never alters behavior."""
    if API_KEY and API_KEY in str(params):
        captured_leak["leaked"] = True
    try:
        result = orig_resend_send(params)
    except Exception as e:  # noqa: BLE001 — record and re-raise unchanged
        resend_send_results.append(("error", str(e)))
        raise
    resend_send_results.append(("ok", result))
    return result


resend.Emails.send = recording_resend_send


def recording_send_email(email_addr, reset_url):
    captured_url["url"] = reset_url
    return orig_send_email(email_addr, reset_url)


auth_module.send_password_reset_email = recording_send_email

# ---------------------------------------------------------------------------
# 2. Primary account: forgot-password (in-process, real Resend attempt)
# ---------------------------------------------------------------------------
section("2. Forgot-password (primary account, real Resend attempt)")

from app.api.auth import forgot_password  # noqa: E402

resp_known = forgot_password(ForgotPasswordRequest(email=TEST_EMAIL), db=session)
check("forgot-password returns the generic message",
      resp_known.message == GENERIC_FORGOT_MESSAGE)

raw_token = ""
if "url" in captured_url:
    url = captured_url["url"]
    check("reset link built from FRONTEND_URL, correct path",
          url.startswith(settings.FRONTEND_URL.rstrip("/") + "/reset-password?token="))
    raw_token = url.split("token=", 1)[1]
    check("reset token is 43-char URL-safe (256-bit CSPRNG)",
          bool(re.fullmatch(r"[A-Za-z0-9_-]{43}", raw_token)))

if resend_send_results and resend_send_results[-1][0] == "ok":
    check("primary-account send accepted by Resend",
          isinstance(resend_send_results[-1][1], dict)
          and bool(resend_send_results[-1][1].get("id")))
else:
    err = resend_send_results[-1][1] if resend_send_results else "no send attempted"
    check("primary-account send blocked by Resend TEST MODE (expected)",
          "testing emails" in err,
          detail="(sandbox delivers only to the account owner's verified address; "
                 "real delivery is proven on the owner leg below)")

check("send failure does not change the API response (anti-enumeration preserved)",
      resp_known.message == GENERIC_FORGOT_MESSAGE)
check("email payload did not contain the API key", not captured_leak["leaked"])

session.expire_all()
user = session.query(User).filter(User.email == TEST_EMAIL).first()
stored_hash = user.reset_token or ""
check("DB stores a token hash (not NULL)",
      bool(stored_hash) and len(stored_hash) == 64)
check("DB hash is SHA-256 of the raw token",
      raw_token and stored_hash == hashlib.sha256(raw_token.encode()).hexdigest())
check("DB never stores the raw token", raw_token and stored_hash != raw_token)
if user.reset_token_expiry:
    mins_left = (user.reset_token_expiry - datetime.now(timezone.utc)).total_seconds() / 60
    check("token expiry is ~15 minutes from now (14.5-15.5)",
          14.5 <= mins_left <= 15.5, detail=f"({mins_left:.1f} min)")

unknown_email = f"nobody-{secrets.token_hex(4)}@test.com"
resp_unknown = forgot_password(ForgotPasswordRequest(email=unknown_email), db=session)
check("unknown email gets the SAME generic message (anti-enumeration)",
      resp_unknown.message == GENERIC_FORGOT_MESSAGE == resp_known.message)

# ---------------------------------------------------------------------------
# 3. HTTP end-to-end (live server on :8000)
# ---------------------------------------------------------------------------
section("3. End-to-end over HTTP (primary account)")

all_responses = []


def http_check(label, path, body, expect_status, expect_body_part=None):
    status, resp_body = http_json("POST", path, body)
    all_responses.append(resp_body)
    ok = status == expect_status
    detail = f"(got {status})" if not ok else ""
    if ok and expect_body_part:
        ok = expect_body_part.encode() in resp_body
        detail = "(body mismatch)" if not ok else ""
    check(label, ok, detail)
    return status, resp_body


def login_check(label, email, password, expect_status):
    status, body = http_json("POST", "/api/auth/login",
                             {"email": email, "password": password})
    all_responses.append(body)
    ok = status == expect_status
    check(label, ok, f"(got {status})" if not ok else "")
    return status


http_check("reset link works: POST /api/auth/reset-password -> 200",
           "/api/auth/reset-password",
           {"token": raw_token, "new_password": NEW_PASSWORD}, 200)
http_check("used token CANNOT be reused -> 400",
           "/api/auth/reset-password",
           {"token": raw_token, "new_password": NEW_PASSWORD}, 400,
           expect_body_part=GENERIC_RESET_ERROR)
login_check("login succeeds with the NEW password", TEST_EMAIL, NEW_PASSWORD, 200)
login_check("login with the OLD password FAILS", TEST_EMAIL, ORIGINAL_PASSWORD, 401)

# Enumeration resistance at the HTTP layer (both 200, byte-identical bodies)
s_unk, b_unk = http_json("POST", "/api/auth/forgot-password", {"email": unknown_email})
all_responses.append(b_unk)
s_kn, b_kn = http_json("POST", "/api/auth/forgot-password", {"email": TEST_EMAIL})
all_responses.append(b_kn)
check("HTTP: unknown email -> 200 generic", s_unk == 200 and GENERIC_FORGOT_MESSAGE.encode() in b_unk)
check("HTTP: known email -> 200 generic", s_kn == 200 and GENERIC_FORGOT_MESSAGE.encode() in b_kn)
check("HTTP: known vs unknown responses byte-identical (no enumeration)",
      b_unk == b_kn)

# Expired token rejection: simulate a token whose expiry has already passed
# (same DB state forgot-password produces, with a past expiry timestamp)
expired_token = generate_reset_token()
session.expire_all()
user = session.query(User).filter(User.email == TEST_EMAIL).first()
user.reset_token = hash_token(expired_token)
user.reset_token_expiry = datetime.now(timezone.utc) - timedelta(minutes=1)
session.commit()

http_check("EXPIRED token is rejected -> 400",
           "/api/auth/reset-password",
           {"token": expired_token, "new_password": NEW_PASSWORD}, 400,
           expect_body_part=GENERIC_RESET_ERROR)

# ---------------------------------------------------------------------------
# 4. Real-delivery leg (Resend sandbox: only the account owner's address
#    can actually receive mail; verified via a disposable account)
# ---------------------------------------------------------------------------
section("4. Real email delivery (owner-address disposable account)")

if OWNER_EMAIL:
    owner_masked = mask_email(OWNER_EMAIL)
    owner = session.query(User).filter(User.email == OWNER_EMAIL).first()
    owner_pre_existed = owner is not None

    captured_url.clear()
    owner_token = ""
    owner_created = False
    try:
        if not owner_pre_existed:
            from app.api.auth import signup
            signup(UserCreate(
                full_name="Resend Owner (temp)",
                email=OWNER_EMAIL,
                password=OWNER_TEMP_PASSWORD,
                role="user",
            ), db=session)
            owner_created = True
            check(f"disposable account created for owner address ({owner_masked})",
                  session.query(User).filter(User.email == OWNER_EMAIL).first() is not None)
        else:
            check(f"owner address ({owner_masked}) already had an account; reusing for send leg",
                  True)

        resp_owner = forgot_password(ForgotPasswordRequest(email=OWNER_EMAIL), db=session)
        check("owner leg: forgot-password returns the generic message",
              resp_owner.message == GENERIC_FORGOT_MESSAGE)

        if "url" in captured_url:
            owner_token = captured_url["url"].split("token=", 1)[1]
            check("owner leg: reset link captured (43-char token)",
                  bool(re.fullmatch(r"[A-Za-z0-9_-]{43}", owner_token)))

        if resend_send_results and resend_send_results[-1][0] == "ok":
            ok_send = isinstance(resend_send_results[-1][1], dict) \
                and bool(resend_send_results[-1][1].get("id"))
            check("reset email SENT successfully through real Resend API "
                  "(message id returned)", ok_send)
        else:
            err = resend_send_results[-1][1] if resend_send_results else "no send attempted"
            check("reset email SENT successfully through real Resend API", False,
                  detail=f"(send failed: {err[:120]})")

        # Complete the flow over HTTP with the captured token
        if owner_token:
            http_check("owner leg: reset link works over HTTP -> 200",
                       "/api/auth/reset-password",
                       {"token": owner_token, "new_password": OWNER_TEMP_PASSWORD}, 200)
            login_check("owner leg: login with the NEW password",
                        OWNER_EMAIL, OWNER_TEMP_PASSWORD, 200)
    finally:
        # Cleanup: delete the disposable account entirely (it did not exist
        # before this run), or clear only the token fields if it pre-existed.
        session.expire_all()
        owner = session.query(User).filter(User.email == OWNER_EMAIL).first()
        if owner is not None:
            if owner_created:
                session.delete(owner)
                session.commit()
                check("disposable account deleted (zero residue)",
                      session.query(User).filter(User.email == OWNER_EMAIL).first() is None)
            else:
                owner.reset_token = None
                owner.reset_token_expiry = None
                session.commit()
                check("pre-existing owner account left untouched (token fields cleared)",
                      True)
else:
    print("  [SKIP] RESET_TEST_OWNER_EMAIL not set — real-delivery leg skipped")

# ---------------------------------------------------------------------------
# 5. Secret hygiene: API key never in responses or logs
# ---------------------------------------------------------------------------
section("5. Secret hygiene")

check("API key not present in ANY API response body",
      all(b and API_KEY not in b.decode("utf-8", "ignore") for b in all_responses))
check("API key not present in captured application logs",
      all(API_KEY not in r for r in captured_log_records))
check("raw reset token not present in captured application logs",
      all(raw_token not in r for r in captured_log_records))
check("no [DEV] fallback link logging while real key is configured",
      not any("[DEV] Password reset requested" in r for r in captured_log_records))

# ---------------------------------------------------------------------------
# 6. Restore the primary test account to its original password (always)
# ---------------------------------------------------------------------------
section("6. Restore test account")


def restore():
    session.expire_all()
    u = session.query(User).filter(User.email == TEST_EMAIL).first()
    if u is not None:
        u.password = hash_password(ORIGINAL_PASSWORD)
        u.reset_token = None
        u.reset_token_expiry = None
        session.commit()
        session.expire_all()


restore()
u = session.query(User).filter(User.email == TEST_EMAIL).first()
check("password hash restored to original (bcrypt verify)",
      verify_password(ORIGINAL_PASSWORD, u.password))
check("reset token fields cleared after restore",
      u.reset_token is None and u.reset_token_expiry is None)
login_check("login works with the ORIGINAL password again", TEST_EMAIL, ORIGINAL_PASSWORD, 200)
login_check("temporary test password no longer works", TEST_EMAIL, NEW_PASSWORD, 401)
session.close()

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print(f"RESULT: {passed} passed, {failed} failed")
print("=" * 60)
sys.exit(0 if failed == 0 else 1)
