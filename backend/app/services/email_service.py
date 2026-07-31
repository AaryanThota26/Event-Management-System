"""
Email Service Module
--------------------
Sends transactional emails through Resend.

Design decisions:
    - `resend` is imported lazily inside the send function so the app and
      the dev fallback work even if the package is not installed.
    - When RESEND_API_KEY is not configured, the email content is logged
      instead of sent (development fallback), so the full flow is testable
      without a Resend account.
    - Send failures are logged and swallowed: callers must return the same
      API response either way (prevents account enumeration via timing or
      error messages).
"""

import html
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


def _build_reset_email_html(reset_url: str, expiry_minutes: int) -> str:
    """Return the inline-styled HTML body for the password reset email."""
    safe_url = html.escape(reset_url, quote=True)
    return f"""
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
  <h1 style="font-size: 22px; margin: 0 0 16px;">Reset your password</h1>
  <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
    We received a request to reset the password for your <strong>EventPro</strong> account.
    Click the button below to choose a new one.
  </p>
  <a href="{safe_url}"
     style="display: inline-block; background: #6750a4; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; margin-bottom: 16px;">
    Reset Password
  </a>
  <p style="font-size: 13px; line-height: 1.6; color: #555555; margin: 0 0 8px;">
    Or copy and paste this link into your browser:
  </p>
  <p style="font-size: 13px; line-height: 1.6; color: #555555; margin: 0 0 8px; word-break: break-all;">
    {safe_url}
  </p>
  <p style="font-size: 13px; line-height: 1.6; color: #555555; margin: 0;">
    This link expires in {expiry_minutes} minutes. If you did not request a password reset,
    you can safely ignore this email.
  </p>
</div>
""".strip()


def send_password_reset_email(email: str, reset_url: str) -> bool:
    """
    Send a password reset email to the given address.

    Args:
        email: Recipient address.
        reset_url: Full reset link (frontend page + token).

    Returns:
        True if the email was accepted by Resend; False when it was only
        logged (dev fallback) or sending failed.

    Note:
        Never raises — the caller must keep the HTTP response identical
        whether or not delivery happened.
    """
    if not settings.RESEND_API_KEY:
        logger.warning(
            "[DEV] Password reset requested for %s — reset link:\n%s",
            email,
            reset_url,
        )
        return False

    try:
        import resend

        resend.api_key = settings.RESEND_API_KEY
        resend.Emails.send(
            {
                "from": settings.RESEND_FROM_EMAIL,
                "to": [email],
                "subject": "Reset your EventPro password",
                "html": _build_reset_email_html(
                    reset_url, settings.RESET_TOKEN_EXPIRE_MINUTES
                ),
            }
        )
        return True
    except Exception:
        logger.exception("Failed to send password reset email to %s", email)
        return False
