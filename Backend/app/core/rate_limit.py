import re
import os
import time
import logging
from collections import defaultdict
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.auth.jwt import verify_token

logger = logging.getLogger(__name__)


SPAM_EMAIL_PATTERN = re.compile(r"^user[a-z0-9]{8}@gmail\.com$", re.IGNORECASE)

# FIX #1: Whitelist ab .env se aata hai (public GitHub repo mein
# personal emails expose nahi honge). .env file mein add karo:
# RATE_LIMIT_WHITELIST=email1@gmail.com,email2@gmail.com
WHITELISTED_EMAILS = set(
    e.strip().lower()
    for e in os.getenv("RATE_LIMIT_WHITELIST", "").split(",")
    if e.strip()
)

# FIX #3: set() ki jagah dict use kiya — { identifier: expiry_timestamp }
# Isse block permanent nahi rehta, apne aap expire ho jata hai BLOCK_DURATION ke baad.
# Pehle: BLOCKED_IPS = set()  -> hamesha ke liye block, server restart tak.
BLOCKED_IPS = {}
BLOCKED_USERS = {}
BLOCK_DURATION = 3600  # 1 hour — is time ke baad block khud hi expire ho jata hai

# Request history tracking: {identifier: [timestamp1, timestamp2, ...]}
general_request_history = defaultdict(list)
heavy_request_history = defaultdict(list)
register_request_history = defaultdict(list)

# Limits configuration
GENERAL_WINDOW = 10
GENERAL_MAX = 5

HEAVY_WINDOW = 10
HEAVY_MAX = 2

REGISTER_WINDOW = 10
REGISTER_MAX = 1


def is_blocked(store: dict, identifier: str) -> bool:
    """
    FIX #3 helper: block check karo AND expired entries ko auto-cleanup karo.
    Agar block expire ho chuka hai, identifier ko store se hata do (auto-unblock)
    aur False return karo — user ko access mil jayega.
    """
    if not identifier:
        return False
    expiry = store.get(identifier)
    if expiry is None:
        return False
    if time.time() > expiry:
        store.pop(identifier, None)
        return False
    return True


def block_identifier(store: dict, identifier: str, duration: int = BLOCK_DURATION):
    """
    FIX #3 helper: identifier ko block karo with expiry time (permanent nahi).
    """
    if identifier:
        store[identifier] = time.time() + duration


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.scope.get("type") != "http":
            return await call_next(request)

        path = request.url.path

        # 1. Real client IP nikalo (Render load balancer header ke through)
        client_ip = request.headers.get("x-forwarded-for")
        if client_ip:
            client_ip = client_ip.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        # 2. Token decode karo agar present hai — email/user_id nikalo.
        #    FIX #2: Ye ab IP-block check se PEHLE hota hai, taaki whitelist
        #    check ke liye email/user_id available ho IP-block check se pehle hi.
        email = None
        user_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = verify_token(token)
                if payload:
                    email = payload.get("email")
                    user_id = payload.get("user_id")
            except Exception as e:
                logger.error(f"Error decoding token in middleware: {e}")

        # 3. FIX #2 — ROOT CAUSE FIX: Whitelist check ab SABSE PEHLE hota hai,
        #    IP-block check se bhi pehle. Pehle whitelist check baad mein tha
        #    (IP-block check ke baad), isliye agar tumhari IP kisi purani reason
        #    se block ho chuki thi, whitelist check tak request pahuchti hi nahi thi
        #    aur tum khud whitelisted hote hue bhi block ho jaate the.
        #    Ab whitelisted email har cheez se exempt hai — IP block, user block, sab se.
        if email and email.lower() in WHITELISTED_EMAILS:
            return await call_next(request)

        # 4. Ab IP-block check (whitelist check ke baad, taaki whitelist override kare)
        if is_blocked(BLOCKED_IPS, client_ip):
            logger.warning(f"Blocked request from IP: {client_ip} calling {path}")
            return JSONResponse(status_code=403, content={"detail": "You are blocked."})

        # 5. User/Email block check (IP rotation protection)
        #    FIX #3: Ye ab TTL-based hai — agar koi real user galti se block ho gaya,
        #    max BLOCK_DURATION (1 hour) baad access wapas mil jayega, permanent nahi.
        if (user_id and is_blocked(BLOCKED_USERS, user_id)) or (email and is_blocked(BLOCKED_USERS, email)):
            logger.warning(f"IP Rotation detected: Blocked user {user_id}/{email} trying new IP: {client_ip}")
            block_identifier(BLOCKED_IPS, client_ip)
            return JSONResponse(status_code=403, content={"detail": "You are blocked."})

        # 6. Spam email pattern check
        if email and SPAM_EMAIL_PATTERN.match(email):
            logger.warning(f"Blocking request from spam email: {email} (IP: {client_ip})")
            block_identifier(BLOCKED_IPS, client_ip)
            if user_id:
                block_identifier(BLOCKED_USERS, user_id)
            block_identifier(BLOCKED_USERS, email)
            return JSONResponse(status_code=403, content={"detail": "You are blocked."})

        # 7. Registration body inspection (spam email/name detect)
        if path == "/auth/register" and request.method == "POST":
            try:
                body_bytes = await request.body()

                async def receive():
                    return {"type": "http.request", "body": body_bytes, "more_body": False}
                request._receive = receive

                if body_bytes:
                    import json
                    body_json = json.loads(body_bytes.decode("utf-8"))
                    reg_email = body_json.get("email", "")
                    reg_name = body_json.get("full_name", "")

                    if (reg_email and SPAM_EMAIL_PATTERN.match(reg_email)) or (reg_name and reg_name.lower().strip() == "john doe"):
                        logger.warning(f"Blocking spam registration attempt: Email: {reg_email}, Name: {reg_name} (IP: {client_ip})")
                        block_identifier(BLOCKED_IPS, client_ip)
                        if reg_email:
                            block_identifier(BLOCKED_USERS, reg_email)
                        return JSONResponse(status_code=403, content={"detail": "You are blocked."})
            except Exception as body_err:
                logger.error(f"Error checking registration body: {body_err}")

        # 8. Rate limiting (sliding window log) + escalation to TTL block
        now = time.time()
        identifier = user_id if user_id else client_ip

        is_heavy = any(path.startswith(prefix) for prefix in ["/pdf", "/translation", "/speech"])
        is_register = (path == "/auth/register")

        if is_register:
            history = register_request_history[client_ip]
            history.append(now)
            history[:] = [t for t in history if now - t < REGISTER_WINDOW]

            if len(history) >= (REGISTER_MAX * 3):
                logger.error(f"IP {client_ip} blocked for excessive registration attempts.")
                block_identifier(BLOCKED_IPS, client_ip)
                return JSONResponse(status_code=403, content={"detail": "You are blocked."})
            elif len(history) > REGISTER_MAX:
                return JSONResponse(status_code=429, content={"detail": "Too many registration attempts. Please try again later."})

        elif is_heavy:
            history = heavy_request_history[identifier]
            history.append(now)
            history[:] = [t for t in history if now - t < HEAVY_WINDOW]

            if len(history) >= 5:
                logger.error(f"IP/User {identifier} blocked for heavy endpoint spam.")
                block_identifier(BLOCKED_IPS, client_ip)
                if user_id:
                    block_identifier(BLOCKED_USERS, user_id)
                if email:
                    block_identifier(BLOCKED_USERS, email)
                return JSONResponse(status_code=403, content={"detail": "You are blocked."})
            elif len(history) > HEAVY_MAX:
                return JSONResponse(status_code=429, content={"detail": "Too many requests to AI processing endpoints. Please wait before requesting again."})

        else:
            history = general_request_history[identifier]
            history.append(now)
            history[:] = [t for t in history if now - t < GENERAL_WINDOW]

            if len(history) >= 10:
                logger.error(f"IP/User {identifier} blocked for general endpoint spam.")
                block_identifier(BLOCKED_IPS, client_ip)
                if user_id:
                    block_identifier(BLOCKED_USERS, user_id)
                if email:
                    block_identifier(BLOCKED_USERS, email)
                return JSONResponse(status_code=403, content={"detail": "You are blocked."})
            elif len(history) > GENERAL_MAX:
                return JSONResponse(status_code=429, content={"detail": "Too many requests. Please slow down."})

        return await call_next(request)
