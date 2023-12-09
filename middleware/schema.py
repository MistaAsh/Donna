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


class SwapTokenSchema(BaseModel):
    """
    Input for swap_token
    """
    from_token: str = Field(
        description="The name of the token that you want to swap"
    )
    from_token_amount: int = Field(
        description="The amount of the from_token that you want ot swap"
    )
    to_token: str = Field(
        description="The name of the token that you want to swap to"
    )
