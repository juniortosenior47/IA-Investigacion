from fastapi import FastAPI
from app.api.routes import router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

app.include_router(router, prefix="/api", tags=["Correction"])

@app.get("/")
def root():
    return {"message": "Text Corrector API is running"}
