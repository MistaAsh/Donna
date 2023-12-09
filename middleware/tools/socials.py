from constants import AIRSTACK_API_KEY
from airstack.execute_query import AirstackClient
import json
from web3 import Web3
class Socials():
    """
    Middleware to handle account related requests
    """

    async def check_social_followers(self, social_media, username):
        """
        Return the number of followers of the username on the social media platform
        """
        error, payload = False, {}
        api_client = AirstackClient(api_key=AIRSTACK_API_KEY)

        social_media = social_media.lower()
        username = username.lower()

        if social_media.lower() not in ["lens","farcaster"]:
            return "incorrect_social_media_platform"
        try:
            query =  """
            query MyQuery($identity: Identity, $platform: SocialDappName)  {
            Socials(
                input: {filter: {dappName: {_eq: $platform}, identity: {_eq: $identity}}, blockchain: ethereum}
            ) {
                Social {
                followerCount
                }
            }
            }
            """
            
            variables = {
            "identity": username,
            "platform": social_media,
            }

            print(variables)
            execute_query_client = api_client.create_execute_query_object(query=query, variables=variables)
            query_response = await execute_query_client.execute_paginated_query()

            error = query_response.error
            data = json.dumps(query_response.data)
            print(data)
        except Exception as e:
            error = e
            print(e)

        return {
            "get_account_balance": {"error": error, "payload": data},
            }

    async def get_ens_domain(self, address):
        """
        Return the ens domain of a particular address
        """
        error, payload = False, {}
        api_client = AirstackClient(api_key=AIRSTACK_API_KEY)

        # check if address is valid
        if not Web3.isAddress(address):
            return "invalid_address"
        try:
            query =  """
            query MyQuery($address: Address)  {
                Domains(input: {filter: {owner: {_eq: $address}}, blockchain: ethereum}) {
                    Domain {
                    name
                    }
  }
            }
            """
            
            variables = {
            "address": address,
            }

            print(variables)
            execute_query_client = api_client.create_execute_query_object(query=query, variables=variables)
            query_response = await execute_query_client.execute_paginated_query()

            error = query_response.error
            data = json.dumps(query_response.data)
            print(data)
        except Exception as e:
            error = e
            print(e)

        return {
            "get_account_balance": {"error": error, "payload": data},
            }