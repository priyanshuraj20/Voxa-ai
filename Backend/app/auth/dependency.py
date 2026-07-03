from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.jwt import verify_token
from app.database import users_collection
from bson import ObjectId

security = HTTPBearer()

# In-memory user document cache to speed up authentication
USER_CACHE = {}

def invalidate_user_cache(user_id: str):
    """
    Remove user from the cache when they log out, update preferences, or change passwords.
    """
    user_id_str = str(user_id)
    if user_id_str in USER_CACHE:
        USER_CACHE.pop(user_id_str, None)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    user_id = payload["user_id"]
    
    # Check cache first to avoid slow database queries (speeds up auth significantly)
    if user_id in USER_CACHE:
        return USER_CACHE[user_id]

    user = await users_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    # Store in cache
    USER_CACHE[user_id] = user
    return user