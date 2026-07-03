import re
import time
import logging
from collections import defaultdict
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.auth.jwt import verify_token

logger = logging.getLogger(__name__)

# Pattern for spam emails e.g., userjnwwrn99@gmail.com
SPAM_EMAIL_PATTERN = re.compile(r"^user[a-z0-9]{8}@gmail\.com$", re.IGNORECASE)

# Whitelist of emails that are exempted from rate limits (presentation accounts)
WHITELISTED_EMAILS = {
    "priyanshurajrock2@gmail.com",
    "code.priyanshu20@gmail.com",
    "priyanshu2011005@gmail.com",
    "p@gmail.com",
}

# In-memory IP and User blocklists
BLOCKED_IPS = set()
BLOCKED_USERS = set()

# Request history tracking: {identifier: [timestamp1, timestamp2, ...]}
# Keys will be IP addresses or user_ids
general_request_history = defaultdict(list)
heavy_request_history = defaultdict(list)
register_request_history = defaultdict(list)

# Limits configuration
GENERAL_WINDOW = 10  # seconds
GENERAL_MAX = 5      # requests per window

HEAVY_WINDOW = 10    # seconds
HEAVY_MAX = 2        # requests per window

REGISTER_WINDOW = 10 # seconds
REGISTER_MAX = 1     # request per window

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # We only rate limit HTTP requests
        if request.scope.get("type") != "http":
            return await call_next(request)

        path = request.url.path

        # 1. Get real client IP address (taking Render load balancer header into account)
        client_ip = request.headers.get("x-forwarded-for")
        if client_ip:
            client_ip = client_ip.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        # 2. Check if IP is blocked
        if client_ip in BLOCKED_IPS:
            logger.warning(f"Blocked request from IP: {client_ip} calling {path}")
            return JSONResponse(
                status_code=403,
                content={"detail": "You are blocked."}
            )

        # 3. Extract Authorization details if present
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

        # 4. Check if User/Email is blocked (IP rotation protection)
        if (user_id and user_id in BLOCKED_USERS) or (email and email in BLOCKED_USERS):
            logger.warning(f"IP Rotation detected: Blocked user {user_id}/{email} is trying to access from new IP: {client_ip}")
            # Immediately block this new IP as well
            BLOCKED_IPS.add(client_ip)
            return JSONResponse(
                status_code=403,
                content={"detail": "You are blocked."}
            )

        # 5. Check if user is whitelisted
        if email and email.lower() in WHITELISTED_EMAILS:
            # Exempt from all rate limits
            return await call_next(request)

        # 6. Check blocklists / spam patterns on current user email
        if email and SPAM_EMAIL_PATTERN.match(email):
            logger.warning(f"Blocking request from spam email: {email} (IP: {client_ip})")
            # Automatically block the spamming user and IP
            BLOCKED_IPS.add(client_ip)
            if user_id:
                BLOCKED_USERS.add(user_id)
            BLOCKED_USERS.add(email)
            return JSONResponse(
                status_code=403,
                content={"detail": "You are blocked."}
            )

        # 7. Intercept registrations to inspect registration details (email / name)
        if path == "/auth/register" and request.method == "POST":
            try:
                body_bytes = await request.body()
                
                # Restore the receive channel so subsequent routers can read request body
                async def receive():
                    return {"type": "http.request", "body": body_bytes, "more_body": False}
                request._receive = receive

                if body_bytes:
                    import json
                    body_json = json.loads(body_bytes.decode("utf-8"))
                    reg_email = body_json.get("email", "")
                    reg_name = body_json.get("full_name", "")

                    # Block if email is a spam pattern or name is john doe (often used in scripts)
                    if (reg_email and SPAM_EMAIL_PATTERN.match(reg_email)) or (reg_name and reg_name.lower().strip() == "john doe"):
                        logger.warning(f"Blocking spam registration attempt: Email: {reg_email}, Name: {reg_name} (IP: {client_ip})")
                        BLOCKED_IPS.add(client_ip)
                        if reg_email:
                            BLOCKED_USERS.add(reg_email)
                        return JSONResponse(
                            status_code=403,
                            content={"detail": "You are blocked."}
                        )
            except Exception as body_err:
                logger.error(f"Error checking registration body: {body_err}")

        # 8. Apply rate limiting and automatic IP/User blocking
        now = time.time()
        identifier = user_id if user_id else client_ip

        # Identify endpoint type
        is_heavy = any(path.startswith(prefix) for prefix in ["/pdf", "/translation", "/speech"])
        is_register = (path == "/auth/register")

        if is_register:
            # Registration limiting
            history = register_request_history[client_ip]
            history.append(now)
            history[:] = [t for t in history if now - t < REGISTER_WINDOW]
            
            # If they hit 3 registration requests in 10s, block their IP and identifier
            if len(history) >= (REGISTER_MAX * 3):
                logger.error(f"IP {client_ip} has been blocked for excessive registration attempts.")
                BLOCKED_IPS.add(client_ip)
                return JSONResponse(
                    status_code=403,
                    content={"detail": "You are blocked."}
                )
            elif len(history) > REGISTER_MAX:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many registration attempts. Please try again later."}
                )

        elif is_heavy:
            # Heavy endpoint rate limiting (PDF/Translation/Speech)
            history = heavy_request_history[identifier]
            history.append(now)
            history[:] = [t for t in history if now - t < HEAVY_WINDOW]
            
            # If they hit 5 requests in 10s, block their IP and user
            if len(history) >= 5:
                logger.error(f"IP/User {identifier} has been blocked for heavy endpoint spam.")
                BLOCKED_IPS.add(client_ip)
                if user_id:
                    BLOCKED_USERS.add(user_id)
                if email:
                    BLOCKED_USERS.add(email)
                return JSONResponse(
                    status_code=403,
                    content={"detail": "You are blocked."}
                )
            elif len(history) > HEAVY_MAX:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests to AI processing endpoints. Please wait before requesting again."}
                )

        else:
            # General endpoint rate limiting
            history = general_request_history[identifier]
            history.append(now)
            history[:] = [t for t in history if now - t < GENERAL_WINDOW]
            
            # If they hit 10 requests in 10s, block their IP and user
            if len(history) >= 10:
                logger.error(f"IP/User {identifier} has been blocked for general endpoint spam.")
                BLOCKED_IPS.add(client_ip)
                if user_id:
                    BLOCKED_USERS.add(user_id)
                if email:
                    BLOCKED_USERS.add(email)
                return JSONResponse(
                    status_code=403,
                    content={"detail": "You are blocked."}
                )
            elif len(history) > GENERAL_MAX:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Please slow down."}
                )

        return await call_next(request)
