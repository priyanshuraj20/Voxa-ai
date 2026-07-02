import logging
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import (
    MONGODB_URI,
    DATABASE_NAME,
    USERS_COLLECTION,
)
# from app.core.config import TRANSLATIONS_COLLECTION



# Initialize logger
logger = logging.getLogger(__name__)

# Create the client instance (does not open connection yet)
client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=5000)

db = client[DATABASE_NAME]

users_collection = db[USERS_COLLECTION]
# translations_collection = db[TRANSLATIONS_COLLECTION]

# Call this function inside your framework's startup event (e.g., FastAPI lifespan)
async def check_database_connection():
    try:
        # Force a connection attempt by pinging the admin database
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB Atlas!")
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.critical(f"Database connection failed: {e}")
        # Insert your fallback logic here (e.g., sys.exit(1) to stop the server)
        raise e

users_collection = db[USERS_COLLECTION]