class Account:
    """
    Middleware to handle account related requests
    """

    def get_account_balance(self, w3, account_address):
        """
        Get the balance of the account in ETH
        """
        error, payload = False, {}
        try:
            balance = w3.eth.get_balance(account_address)
            payload = {"account_address": account_address, "balance": balance}
        except Exception as e:
            error = True
            print(e)
        return {
            "get_account_balance": {"error": error, "payload": payload},
        }

    def send_transaction(self, w3, sender_address, receiver_address, amount):
        """
        Return a transaction object to the React frontend to sign
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
