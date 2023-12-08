from pydantic import BaseModel, Field


class GetAccountBalanceSchema(BaseModel):
    """
    Input for get_account_balance
    """
    account_address: str = Field(
        description="The address of the account to get the balance of"
    )


class SendTransactionSchema(BaseModel):
    """
    Input for send_transaction
    """
    sender_address: str = Field(
        description="The address of the account to send the transaction from"
    )
    receiver_address: str = Field(
        description="The address of the account to send the transaction to"
    )
    amount: int = Field(description="The amount of ETH to send")
