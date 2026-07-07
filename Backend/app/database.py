import logging 
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError    #used forr printing or storing the error of info msg...
from motor.motor_asyncio import AsyncIOMotorClient   #motor mongo db ka async driver hain
from app.core.config import (
    MONGODB_URI,
    DATABASE_NAME,
    USERS_COLLECTION,
)
logger = logging.getLogger(__name__)


client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=5000)

db = client[DATABASE_NAME]

users_collection = db[USERS_COLLECTION]

async def check_database_connection():
    try:
        # Force a connection attempt by pinging the admin database
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB Atlas!")
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.critical(f"Database connection failed: {e}")
        # Insert your fallback logic here 
        raise e

users_collection = db[USERS_COLLECTION]
