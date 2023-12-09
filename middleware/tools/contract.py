from openai import OpenAI
from constants import OPENAI_API_KEY

class Contract:
    """
    Middleware to handle contract related requests
    """

    def create_and_deploy_contract(self, contract_name, contract_description):
        """
        Calls the OpenAI API to generate a contract from the contract and calls a server to deploy it
        """
        error, payload = False, {}
        try:
            client = OpenAI(
                api_key = OPENAI_API_KEY,
            )

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
            print("Chat: ", chat_completion)
            payload = chat_completion.choices[0].message.content
        except Exception as e:
            error = e
        return {"method": "create_and_deploy_tcontract", "error": error, "payload": payload}

                            
   