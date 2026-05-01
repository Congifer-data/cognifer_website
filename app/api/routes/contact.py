# -----------------------------------------------------------------
# File:    app/api/routes/contact.py
# Purpose: POST /api/contact — receives contact form submissions
#
# Flow:
#   1. Browser POSTs JSON { name, email, org, message }
#   2. Pydantic validates and sanitises all fields
#   3. (TODO) Email is forwarded via Brevo transactional API
#   4. HTTP 200 + { "status": "received" } returned to browser
#
# To add Brevo sending, fill in the send_via_brevo() function and
# set the BREVO_API_KEY environment variable on Render.
# -----------------------------------------------------------------

import os
import logging

import requests
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, field_validator

logger = logging.getLogger(__name__)

router = APIRouter()


# ── Request schema ────────────────────────────────────────────────

class ContactRequest(BaseModel):
    """
    Validated shape of the JSON body sent by Contact.jsx.
    Pydantic rejects the request automatically if any required
    field is missing or if `email` is not a valid email address.
    """
    name: str
    email: EmailStr
    org: str = ""       # optional — defaults to empty string
    message: str

    # Prevent excessively long inputs from being stored or forwarded
    @field_validator("name")
    @classmethod
    def name_max_length(cls, v: str) -> str:
        if len(v.strip()) == 0:
            raise ValueError("Name cannot be blank")
        if len(v) > 100:
            raise ValueError("Name must be 100 characters or fewer")
        return v.strip()

    @field_validator("message")
    @classmethod
    def message_max_length(cls, v: str) -> str:
        if len(v.strip()) == 0:
            raise ValueError("Message cannot be blank")
        if len(v) > 2000:
            raise ValueError("Message must be 2000 characters or fewer")
        return v.strip()

    @field_validator("org")
    @classmethod
    def org_max_length(cls, v: str) -> str:
        if len(v) > 150:
            raise ValueError("Organisation name must be 150 characters or fewer")
        return v.strip()


# ── Brevo email helper ────────────────────────────────────────────

def send_via_brevo(body: ContactRequest) -> None:
    """
    Forward the contact form submission as a transactional email
    using the Brevo (ex-Sendinblue) API.

    Set these environment variables on Render:
        BREVO_API_KEY       — your Brevo v3 API key
        BREVO_TO_EMAIL      — the inbox that receives submissions
        BREVO_TO_NAME       — display name for that inbox
        BREVO_SENDER_EMAIL  — verified sender address in Brevo
        BREVO_SENDER_NAME   — display name for the sender

    Raises RuntimeError if the Brevo API returns a non-2xx status.
    """
    api_key = os.getenv("BREVO_API_KEY")
    if not api_key:
        # Log and skip silently in dev so the form still "works"
        # without Brevo credentials. Remove this guard in production.
        logger.warning("BREVO_API_KEY not set — skipping email send")
        return

    payload = {
        "sender": {
            "email": os.getenv("BREVO_SENDER_EMAIL", "no-reply@cognifer.co.ke"),
            "name": os.getenv("BREVO_SENDER_NAME", "Cognifer Website"),
        },
        "to": [
            {
                "email": os.getenv("BREVO_TO_EMAIL", "info@cognifer.co.ke"),
                "name": os.getenv("BREVO_TO_NAME", "Cognifer Team"),
            }
        ],
        "subject": f"New contact form submission from {body.name}",
        # Plain-text body — easy to read in any email client
        "textContent": (
            f"Name:         {body.name}\n"
            f"Email:        {body.email}\n"
            f"Organisation: {body.org or '—'}\n\n"
            f"Message:\n{body.message}"
        ),
        # Optional reply-to so you can hit Reply directly to the sender
        "replyTo": {"email": body.email, "name": body.name},
    }

    response = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        json=payload,
        headers={
            "api-key": api_key,
            "Content-Type": "application/json",
        },
        timeout=10,  # don't block the response for more than 10 s
    )

    if not response.ok:
        raise RuntimeError(
            f"Brevo returned {response.status_code}: {response.text}"
        )


# ── Route handler ─────────────────────────────────────────────────

@router.post(
    "/contact",
    status_code=status.HTTP_200_OK,
    summary="Submit a contact form enquiry",
)
async def submit_contact(body: ContactRequest) -> dict:
    """
    Receive a contact form submission from the frontend.

    Returns:
        { "status": "received" } on success.

    Raises:
        HTTP 500 if the Brevo email send fails, so the frontend
        can display a meaningful error to the user.
    """
    try:
        send_via_brevo(body)
    except RuntimeError as exc:
        # Log the full error server-side but return a safe message
        logger.error("Email send failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Message received but email notification failed. "
                   "The team will follow up shortly.",
        ) from exc

    logger.info("Contact form submitted by %s <%s>", body.name, body.email)
    return {"status": "received"}