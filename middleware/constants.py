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

# Airstack Constants
AIRSTACK_API_KEY = os.environ.get("AIRSTACK_API_KEY")

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
    "goerli": "https://goerli.drpc.org/",
    "optimism": "https://mainnet.optimism.io",
    "gnosis": "https://gnosis.drpc.org/",
    "polygon": "https://polygon-rpc.com/",
    "mumbai": "https://polygon-mumbai.drpc.org/",
    "mantle": "https://mantle-testnet.drpc.org/",
    "arbitrum": "https://arbitrum.drpc.org/",
}

ERC20_SYMBOL_TO_ADDRESS = {
    "ETH": "ETH",
    "WETH": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "USDT": "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "USDC": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "MATIC": "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    "DAI": "0x6b175474e89094c44da98b954eedeac495271d0f",
}
