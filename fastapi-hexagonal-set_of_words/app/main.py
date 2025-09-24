from fastapi import FastAPI
from .adapters.http import rest

app = FastAPI(title="Set of Words API")

app.include_router(rest.router)
