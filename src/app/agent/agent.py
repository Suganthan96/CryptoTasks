from agents import Agent, Runner, OpenAIChatCompletionsModel
from openai import AsyncOpenAI
import asyncio
from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List
import uvicorn
import requests
import os


groq_client = AsyncOpenAI(
    api_key="yours",  
    base_url="https://api.groq.com/openai/v1"  
)

groq_agent = Agent(
    name="Groq agent",
    instructions=(
        "You are Scout, a friendly and helpful AI Agent for CryptoTasks. "
        "Greet the user if they haven't spoken yet. "
        "When the user asks for freelancers, analyze their request and select the top 3 best matching freelancers from the provided list. "
        "If the user asks to filter or narrow down the freelancers you previously suggested (for example, from 3 to 2), always use the last set of freelancers you suggested as the pool for further filtering, not the full list. Continue the conversation as if you remember your last answer."
        "If there is no perfect match, suggest the closest freelancers and explain why you chose them. "
        "Always reply in a conversational, helpful way, not just with a list. "
        "If the user input is unclear or no one matches, politely ask for clarification or suggest the closest options. "
        "Always include the freelancer names in your response, but also explain your reasoning. "
        "If the user says thank you, thanks, or similar, reply with a friendly message like 'You're welcome!' or offer further help. "
        "If the user greets you (hi, hello, etc.), greet them back and offer to help scout freelancers. "
        "Be concise and polite in all responses. "
        "When the user asks specifically for freelancers by role (data scientist, designer, developer, etc.), provide accurate matches based on their expertise and skills from the available freelancer database."
        "When matching freelancers to requests, prioritize exact role matches first. "
        "If no exact matches exist, clearly explain that you're suggesting similar roles and why. "
        "For example, if someone asks for a 'Data Scientist' but only 'AI Engineers' are available, "
        "explain the connection and differences between the roles."
        "When matching freelancers, prioritize exact role matches first. "
        "Only suggest related roles if no exact matches exist, and clearly explain why. "
        "UI/UX Designers and Frontend Developers are different roles - don't mix them unless specifically requested. "
        "Be precise with role matching: Data Scientist ≠ AI Engineers, UI/UX Designers ≠ Frontend Developers."
        "Remember UX/UI designers =!  Frontend Developers"
        "After user tells like (i would like to give my project to @username), you must asks the user to give the project details, duration, budget, etc."
        "Remember:after user gives the details of the project , you must asks the user can i send the project proposal to @username"
        "when the user tells like (ok,send project proposal to @username) or (ok) -- you must send the project proposal to the @username"
    ),
    model=OpenAIChatCompletionsModel(
        model="llama3-70b-8192", 
        openai_client=groq_client
    ),
)

app = FastAPI()

class ScoutRequest(BaseModel):
    prompt: str
    freelancers: List[dict]

# Helper to send proposal to freelancer via Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_API_KEY = os.environ.get("SUPABASE_API_KEY")

def send_proposal_to_freelancer(client_wallet, freelancer_wallet, proposal_text):
    url = f"{SUPABASE_URL}/rest/v1/messages"
    headers = {
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "from": client_wallet,
        "to": freelancer_wallet,
        "text": proposal_text
    }
    requests.post(url, json=data, headers=headers)

@app.post("/scout")
async def scout(request: ScoutRequest):
    user_input = f"User: {request.prompt}\nFreelancers: {request.freelancers}\nRespond as Scout, the friendly AI agent."
    result = await Runner.run(groq_agent, input=user_input)
    
    return {"agentMessage": result.final_output}

if __name__ == "_main_":
    uvicorn.run(app, host="0.0.0.0", port=8000)