from fastapi import APIRouter
from pydantic import BaseModel
from core.ai_client import client

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(req: ChatRequest):

    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "user",
                "content": req.message
            }
        ]
    )

    return {
        "reply": completion.choices[0].message.content
    }