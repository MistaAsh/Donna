from pydantic import BaseModel, Field


class GetAccountBalanceSchema(BaseModel):
    """
    Input for get_account_balance
    """

    account_address: str = Field(
        description="The address of the account to get the balance of"
    )
    token_symbol: str = Field(
        description="A set of usually uppercase alphabets of not more than 4 characters in length. This is associated with the token you want to get the balance of.",
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
    token_symbol: str = Field(
        description="A set of usually uppercase alphabets of not more than 4 characters in length. This is associated with the token you want to get the balance of.",
    )
    amount: int = Field(description="The amount of ETH to send")


class SwapTokenSchema(BaseModel):
    """
    Input for swap_token
    """

    from_token: str = Field(description="The name of the token that you want to swap")
    from_token_amount: int = Field(
        description="The amount of the from_token that you want ot swap"
    )
    to_token: str = Field(description="The name of the token that you want to swap to")


class CheckSocialFollowersSchema(BaseModel):
    """
    Input for check_social_followers
    """

    social_media_platform: str = Field(
        description="The name of the social media platform to check the followers of"
    )
    social_media_handle: str = Field(
        description="The username of the account to check the followers of"
    )


class GetENSDomainSchema(BaseModel):
    """
    Input for get_ens_domain
    """

    address: str = Field(description="The address to get the ens domain of")
