# from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel
import asyncio
from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List
import uvicorn
import re
import os
import httpx

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-70b-8192"

class GroqAgent:
    def __init__(self, name, instructions, model=GROQ_MODEL):
        self.name = name
        self.instructions = instructions
        self.model = model

    async def run(self, user_input):
        match = re.search(r"User: (.*?)\nFreelancers: (\[.*\])", user_input, re.DOTALL)
        if not match:
            return "Sorry, I couldn't understand the input. Could you please rephrase?"
        prompt = match.group(1).strip()
        import ast
        try:
            freelancers = ast.literal_eval(match.group(2))
        except Exception:
            freelancers = []
        # Directly call Groq API here
        instructions = self.instructions
        user_message = prompt
        if freelancers is not None:
            user_message += f"\nFreelancers: {freelancers}"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": instructions},
                {"role": "user", "content": user_message}
            ]
        }
        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.post(GROQ_API_URL, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Sorry, there was an error contacting the Groq API: {e}"

groq_agent = GroqAgent(
    name="Groq agent",
    instructions=(
        "You are Scout, a friendly and helpful AI Agent for CryptoTasks. "
        "Greet the user if they haven't spoken yet. "
        "When the user asks for freelancers, analyze their request and select the top 3 best matching freelancers from the provided list. "
        "If there is no perfect match, suggest the closest freelancers and explain why you chose them. "
        "Always reply in a conversational, helpful way, not just with a list. "
        "If the user input is unclear or no one matches, politely ask for clarification or suggest the closest options. "
        "Always include the freelancer names in your response, but also explain your reasoning. "
        "If the user says thank you, thanks, or similar, reply with a friendly message like 'You're welcome!' or offer further help. "
        "If the user greets you (hi, hello, etc.), greet them back and offer to help scout freelancers. "
        "Be concise and polite in all responses."
    ),
    model=GROQ_MODEL
)

app = FastAPI()

class ScoutRequest(BaseModel):
    prompt: str
    freelancers: List[dict]

@app.post("/scout")
async def scout(request: ScoutRequest):
    user_input = f"User: {request.prompt}\nFreelancers: {request.freelancers}\nRespond as Scout, the friendly AI agent."
    result = await groq_agent.run(user_input)
    return {"agentMessage": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
