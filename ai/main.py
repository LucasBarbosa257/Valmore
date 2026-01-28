from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import create_agent
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

allowed_origins = [
    os.getenv("CLIENT_URL"),
]

allowed_origins = [origin for origin in allowed_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(
    request: Request, 
    authorization: str = Header(None),
    x_api_key: str = Header(None, alias="x-api-key"),
):
    if not authorization or " " not in authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key not provided.")

    bearer_token = authorization.split(" ")[1]

    agent = create_agent(bearer_token, x_api_key)

    response = await agent.arun(request.message)

    return {
        "content": response.content
    }