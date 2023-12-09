from langchain.schema import SystemMessage
from dotenv import load_dotenv
import os

load_dotenv()

# Web3 Constants
WEB3_HTTP_PROVIDER_URI = os.environ.get("WEB3_HTTP_PROVIDER_URI")

# OpenAI Constants
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Supabase Constants
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# ChatGPT System Prompt
SYSTEM_MESSAGE = SystemMessage(
    content="""
        You are a specialized AI, designed to act as an chatbot that help facilitate blockchain transaction
        -- When asked to generate a contract invoke the generate contract function while passing in the english description of the task
        -- After calling the send transaction tool create a message that contains $start$reciver_address|value$end$
        -- The generated contract code url should be sent in this format #wasmstart# url #wasmend#
    """
)
AGENT_KWARGS = {"system_message": SYSTEM_MESSAGE}

RPC_URL = {
    "ethereum": "https://cloudflare-eth.com",
}