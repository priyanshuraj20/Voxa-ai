print("MAIN.PY LOADED")
from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.speech import router as speech_router
from app.api.translation import router as translation_router
from app.api.websocket_api import router as websocket_router
from app.api.pdf import router as pdf_router
from app.core.config import FRONTEND_URL
from fastapi.responses import RedirectResponse

from app.database import check_database_connection




from app.auth.router import router as auth_router


app = FastAPI(
    title="Voxa Ai",
    description="Real-Time Multilingual Speech & Document Translation Platform.",
    version="1.0.0"
)


from app.core.rate_limit import RateLimitMiddleware
app.add_middleware(RateLimitMiddleware)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await check_database_connection()


app.include_router(auth_router)   
app.include_router(health_router)
app.include_router(speech_router)
app.include_router(translation_router)
app.include_router(websocket_router)
app.include_router(pdf_router)

@app.get("/test")
def test_route():
    return {"status": "The server is alive!"}
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")