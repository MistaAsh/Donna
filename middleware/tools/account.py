from web3 import Web3
import json


class Account:
    """
    Middleware to handle account related requests
    """

    def get_account_balance(self, w3, account_address, token_address):
        """
        Get the balance of the account in ETH
        """
        error, payload = False, {}
        try:
            if token_address != "ETH":
                with open("../middleware/abi/erc20.abi.json", "r") as abi_file:
                    ERC20_ABI = json.load(abi_file)
                token_contract = w3.eth.contract(
                    address=Web3.to_checksum_address(token_address), abi=ERC20_ABI
                )

                balance = token_contract.functions.balanceOf(
                    Web3.to_checksum_address(account_address)
                ).call()
                balance_symbol = token_contract.functions.symbol().call()
            else:
                balance = w3.eth.get_balance(account_address) / 10**18
                balance_symbol = "ETH"

            payload = {
                "account_address": account_address,
                "balance": str(balance / (10**6)),
                "token_symbol": balance_symbol,
            }
        except Exception as e:
            error = e
            print(e)

        return {"method": "get_account_balance", "error": error, "payload": payload}

    def send_transaction(
        self, w3, sender_address, receiver_address, token_symbol, token_address, amount
    ):
        """
        Return a transaction object to the frontend to sign
        """
        error, payload = False, {}

        balance = float(self.get_account_balance(w3, sender_address, token_address)["payload"]["balance"])
        if balance < amount:
            error = "Insufficient funds"
        else:
            try:
                tx = {
                    "from": sender_address,
                    "to": receiver_address,
                    "value": w3.to_wei(amount, "ether"),
                    "token_symbol": token_symbol,
                    # "gas": 2000000,
                    # "gasPrice": w3.toWei("50", "gwei")
                }
                payload = tx
            except Exception as e:
                error = e
                print(e)
        return {"method": "send_transaction", "error": error, "payload": payload}

    # TODO: Identify the parameters to swap_token on the frontend and send the required from the backend
    def swap_token(self, w3, account_address, from_token_address, from_token_amount, to_token_address):
        """
        Return a transaction object to swap tokens
        """
        error, payload = False, {}
        try:
            tx = {
                "account_address": account_address,
                "from_token_address": from_token_address,
                "to_token_address": to_token_address,
                "amount": from_token_amount,
                # "gas": 2000000,
                # "gasPrice": w3.toWei("50", "gwei")
            }
            payload = tx
        except Exception as e:
            error = e
            print(e)
        return 