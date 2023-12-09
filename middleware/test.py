from constants import OPENAI_API_KEY
from openai import OpenAI

client = OpenAI(api_key = OPENAI_API_KEY)

contract_name = "Pipy"
contract_description = "create a NFT contract called tokenio that mind 20 nfts to 0x0"

prompt = f"""
    Generate a Solidity smart contract with the following description:
    Contract Name: {contract_name}
    Contract Description: {contract_description}
    
    Additionally,
    1. The contract should always have this line at the top of the file: `// SPDX-License-Identifier: MIT`
"""

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": prompt,
        }
    ],
    model="gpt-3.5-turbo",
)

print(chat_completion.choices[0].message.content)