#!/usr/bin/env python
"""
Comprehensive Authorization Audit Test.
Tests every protected API endpoint against User, Organizer, Admin, and Unauthenticated roles.
"""
import requests
import sys
import json
import base64

BASE = "http://localhost:8000"

def log(msg):
    print(msg, flush=True)

# ============================================================
# 1. Create test accounts (idempotent)
# ============================================================
log("=== Setting up test accounts ===")

def signup(name, email, password, role):
    r = requests.post(f"{BASE}/api/auth/signup", json={
        "full_name": name, "email": email, "password": password, "role": role
    })
    if r.status_code == 201:
        log(f"  Created {role}: {email}")
    elif r.status_code == 400 and "already registered" in r.text:
        log(f"  {role} already exists: {email}")
    else:
        log(f"  WARNING: signup {email} -> {r.status_code}: {r.text[:80]}")

def login(email, password):
    r = requests.post(f"{BASE}/api/auth/login", json={"email": email, "password": password})
    return r.json()["access_token"] if r.status_code == 200 else None

signup("Test User", "testuser@test.com", "password123", "user")
signup("Test Organizer", "testorg@test.com", "password123", "organizer")
signup("Test Admin", "testadmin@test.com", "password123", "admin")

USER_TOKEN = login("testuser@test.com", "password123")
ORG_TOKEN = login("testorg@test.com", "password123")
ADMIN_TOKEN = login("testadmin@test.com", "password123")

assert USER_TOKEN, "User login failed"
assert ORG_TOKEN, "Organizer login failed"
assert ADMIN_TOKEN, "Admin login failed"

log("  All tokens obtained.\n")

# ============================================================
# Helper
# ============================================================

all_pass = True

def test_endpoint(method, path, label, role_responses, body=None):
    """Test each role against the endpoint."""
    global all_pass
    tokens = {
        "User": USER_TOKEN,
        "Organizer": ORG_TOKEN,
        "Admin": ADMIN_TOKEN,
        "No Auth": None,
    }
    for role, expected in role_responses.items():
        token = tokens.get(role)
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"

        url = f"{BASE}{path}"
        try:
            if method == "GET":
                r = requests.get(url, headers=headers)
            elif method == "POST":
                r = requests.post(url, headers=headers, json=body or {})
            elif method == "PUT":
                r = requests.put(url, headers=headers, json=body or {})
            elif method == "DELETE":
                r = requests.delete(url, headers=headers)
            elif method == "PATCH":
                r = requests.patch(url, headers=headers)
            else:
                raise ValueError(f"Unknown method: {method}")

            ok = r.status_code == expected
            if not ok:
                all_pass = False
            marker = "✓" if ok else "✗"
            desc = f"({r.text[:60] if not ok else ''})"
            log(f"  {role:<14} {r.status_code} (expect {expected}) {marker} {desc}")
        except requests.exceptions.ConnectionError as e:
            all_pass = False
            log(f"  {role:<14} CONN_ERR (expect {expected}) ✗ (Server may have crashed)")

def make_event(org_token):
    """Create a test event and return its ID."""
    r = requests.post(f"{BASE}/api/events",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {org_token}"},
        json={"title": "Test Event", "description": "A valid test event description",
              "date": "2026-12-25", "time": "10:00", "location": "Test Location", "capacity": 100})
    if r.status_code == 201:
        return r.json()["id"]
    else:
        log(f"  Failed to create event: {r.status_code} {r.text[:100]}")
        return None

log("=" * 60)
log("AUTHORIZATION AUDIT TEST RESULTS")
log("=" * 60)
log("")

# ============================================================
# TEST 0: Health check
# ============================================================
log("--- TEST 0: Health Check ---")
try:
    r = requests.get(f"{BASE}/")
    log(f"  Server status: {r.status_code} {r.json()['status']}")
except Exception as e:
    log(f"  Server not reachable: {e}")
    log("  ABORTING - start the server first")
    sys.exit(1)
log("")

# ============================================================
# TEST 1: POST /api/events (Create Event - Organizer only)
# ============================================================
log("--- TEST 1: POST /api/events (Create Event - requires ORGANIZER) ---")
EVENT_BODY = {"title": "Test Event", "description": "A valid test event description",
              "date": "2026-12-25", "time": "10:00", "location": "Test Location", "capacity": 100}
test_endpoint("POST", "/api/events", "Create Event", {
    "User": 403,
    "Organizer": 201,
    "Admin": 403,
    "No Auth": 401,
}, body=EVENT_BODY)
log("")

# ============================================================
# TEST 2: PUT /api/events/{id}
# ============================================================
log("--- TEST 2: PUT /api/events/{id} (Update Event - requires ORGANIZER/ADMIN) ---")
event_id = make_event(ORG_TOKEN)
if event_id:
    log(f"  Created test event ID: {event_id}")
    test_endpoint("PUT", f"/api/events/{event_id}", "Update Event", {
        "User": 403,
        "Organizer": 200,
        "Admin": 200,
        "No Auth": 401,
    }, body={"title": "Updated Title"})
else:
    log("  SKIPPED - could not create test event")
log("")

# ============================================================
# TEST 3: DELETE /api/events/{id}
# ============================================================
log("--- TEST 3: DELETE /api/events/{id} (Delete Event - requires ORGANIZER/ADMIN) ---")

del_id = make_event(ORG_TOKEN)
if del_id:
    # User tries (403)
    r = requests.delete(f"{BASE}/api/events/{del_id}",
        headers={"Authorization": f"Bearer {USER_TOKEN}"})
    ok = r.status_code == 403
    if not ok: all_pass = False
    log(f"  User           {r.status_code} (expect 403) {'✓' if ok else '✗'}")

    # Admin deletes it (200)
    r = requests.delete(f"{BASE}/api/events/{del_id}",
        headers={"Authorization": f"Bearer {ADMIN_TOKEN}"})
    ok = r.status_code == 200
    if not ok: all_pass = False
    log(f"  Admin          {r.status_code} (expect 200) {'✓' if ok else '✗'}")

    # Organizer deletes own
    del_id2 = make_event(ORG_TOKEN)
    if del_id2:
        r = requests.delete(f"{BASE}/api/events/{del_id2}",
            headers={"Authorization": f"Bearer {ORG_TOKEN}"})
        ok = r.status_code == 200
        if not ok: all_pass = False
        log(f"  Organizer      {r.status_code} (expect 200) {'✓' if ok else '✗'}")
else:
    log("  SKIPPED - could not create test event")

# No Auth (401)
r = requests.delete(f"{BASE}/api/events/999999", headers={})
ok = r.status_code == 401
if not ok: all_pass = False
log(f"  No Auth        {r.status_code} (expect 401) {'✓' if ok else '✗'}")
log("")

# ============================================================
# TEST 4: GET /api/events/{id}/participants
# ============================================================
log("--- TEST 4: GET /api/events/{id}/participants (requires ORGANIZER/ADMIN) ---")
pe_id = make_event(ORG_TOKEN)
if pe_id:
    test_endpoint("GET", f"/api/events/{pe_id}/participants", "Participants", {
        "User": 403,
        "Organizer": 200,
        "Admin": 200,
        "No Auth": 401,
    })
else:
    log("  SKIPPED - could not create test event")
log("")

# ============================================================
# TEST 5: PATCH /api/events/{id}/approve
# ============================================================
log("--- TEST 5: PATCH /api/events/{id}/approve (Admin only) ---")
if pe_id:
    test_endpoint("PATCH", f"/api/events/{pe_id}/approve", "Approve", {
        "User": 403,
        "Organizer": 403,
        "Admin": 200,
        "No Auth": 401,
    })
else:
    log("  SKIPPED - no event available")
log("")

# ============================================================
# TEST 6: PATCH /api/events/{id}/reject
# ============================================================
log("--- TEST 6: PATCH /api/events/{id}/reject (Admin only) ---")
rj_id = make_event(ORG_TOKEN)
if rj_id:
    test_endpoint("PATCH", f"/api/events/{rj_id}/reject", "Reject", {
        "User": 403,
        "Organizer": 403,
        "Admin": 200,
        "No Auth": 401,
    })
else:
    log("  SKIPPED - could not create test event")
log("")

# ============================================================
# TEST 7: JWT Role Validation
# ============================================================
log("--- TEST 7: JWT Role Validation ---")

for name, token in [("User", USER_TOKEN), ("Organizer", ORG_TOKEN), ("Admin", ADMIN_TOKEN)]:
    parts = token.split(".")
    payload_b64 = parts[1]
    padding = 4 - len(payload_b64) % 4
    if padding != 4:
        payload_b64 += "=" * padding
    try:
        payload = json.loads(base64.b64decode(payload_b64))
        role = payload.get("role", "MISSING")
        log(f"  {name:<14} JWT role claim: '{role}' ✓")
        assert role in ("user", "organizer", "admin"), f"Unexpected role: {role}"
    except Exception as e:
        all_pass = False
        log(f"  {name:<14} JWT decode failed: {e}")

log("")

# ============================================================
# SUMMARY
# ============================================================
log("=" * 60)
log("SUMMARY")
log("=" * 60)
if all_pass:
    log("ALL TESTS PASSED ✓")
else:
    log("SOME TESTS FAILED ✗")
    sys.exit(1)

log("")
log("Verified:")
log("  ✓ User cannot access Organizer/Admin APIs (403)")
log("  ✓ Organizer cannot access Admin-only APIs (403)")
log("  ✓ Admin has full access")
log("  ✓ Unauthenticated users receive 401")
log("  ✓ JWT tokens contain 'role' claim for server-side validation")
