import json

class Account:
    """
    Middleware to handle account related requests
    """

    def get_account_balance(self, w3, account_address, token_address=None):
        """
        Get the balance of the account in ETH
        """
        error, payload = False, {}
        try:
            if token_address:
                with open('../middleware/abi/erc20.abi.json', 'r') as abi_file:
                    ERC20_ABI = json.load(abi_file)
                # Create a contract instance for the ERC20 token
                token_contract = w3.eth.contract(address=token_address, abi=ERC20_ABI)
                # Get token balance
                balance = token_contract.functions.balanceOf(account_address).call()
                balance_symbol = token_contract.functions.symbol().call()  # To get the token symbol
            else:
                # Get ETH balance
                balance = w3.eth.get_balance(account_address)/10**18
                balance_symbol = 'ETH'

            payload = {"account_address": account_address, "balance": balance, "currency": balance_symbol}

        except Exception as e:
            error = e
            print(e)

        return {
            "get_account_balance": {"error": error, "payload": payload},
            }

    def send_transaction(self, w3, sender_address, receiver_address, amount):
        """
        Return a transaction object to the frontend to sign
        """
        error, payload = False, {}
        try:
            tx = {
                "from": sender_address,
                "to": receiver_address,
                "value": w3.toWei(amount, "ether"),
                # "gas": 2000000,
                # "gasPrice": w3.toWei("50", "gwei")
            }
            payload = tx
        except Exception as e:
            error = True
            print(e)
        return {"send_transaction": {"error": error, "payload": payload}}

    # TODO: Identify the parameters to swap_token on the frontend and send the required from the backend
    def swap_token(self, w3, from_token, from_token_amount, to_token):
        """
        Return a transaction object to swap tokens
        """
        error, payload = False, {}
        try:
            tx = {
                "from": from_token,
                # "from_token_address":  ,
                "to": to_token,
                # "to_token_address": ,
                "amount": from_token_amount,
                # "gas": 2000000,
                # "gasPrice": w3.toWei("50", "gwei")
            }
            payload = tx
        except Exception as e:
            error = True
            print(e)
        return {"swap_token": {"error": error, "payload": payload}}
    def check_social_followers(self, social_media, username):
        """
        Return the number of followers of the username on the social media platform
        """
        error, payload = False, {}
        try:
            pass
        except Exception as e:
            error = True
            print(e)