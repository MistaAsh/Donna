from imports import *

# Setting up the Web3 provider
# w3 = Web3(Web3.HTTPProvider(RPC_URL["ethereum"]))

# Settign up the Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def is_valid_web3_addresses(addresses):
    # for address in addresses:
    #     if not Web3.is_address(address):
    #         return False
    return True


def create_web3_provider_modal(network_id):
    if network_id not in RPC_URL.keys():
            raise ValueError(f"Chain ID {network_id} not supported")
    network_rpc_url = RPC_URL[network_id]
    return Web3(Web3.HTTPProvider(network_rpc_url))


def push_to_supabase(output, type, session_id):
    try:
        result = (
            supabase.table("messages")
            .insert(
                {
                    "content": output,
                    "type": type,
                    "session_id": session_id,
                }
            )
            .execute()
        )
    except Exception as e:
        return jsonify(message="Error in inserting to Supabase"), 400


executor = ThreadPoolExecutor()


def run_async(async_func):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    return loop.run_until_complete(async_func)


class GetAccountBalanceTool(BaseTool):
    name = "get_account_balance"
    description = """
        Useful when you want ot get the account balance of the given wallet address in native token or ERC20 token.
        The wallet address is the address of the wallet you want to get the balance of.
        The token_symbol is a set of usually uppercase alphabets of not more than 4 characters in length. This is associated with the token you want to get the balance of (If not provided we are using the native token and don't need it as input).
        The current_network_id is the id of the network you are currently on
    """

    args_schema: Type[BaseModel] = GetAccountBalanceSchema

    def _run(self, account_address, token_symbol, current_network_id):
        # Initalize web3 provider
        w3 = create_web3_provider_modal(current_network_id)
        # Get token address
        token_address = ERC20_SYMBOL_TO_ADDRESS[current_network_id].get(token_symbol)
        if token_address is None:
            raise ValueError("Token not supported")
        # Check if addresses are valid
        if not is_valid_web3_addresses([account_address, token_address]):
            raise ValueError("Invalid account_address or token_address")
        balance = Account().get_account_balance(w3, account_address, token_address)
        return balance

    def _arun(self, account_address):
        raise NotImplementedError("get_account_balance does not support async")


class SendTransactionTool(BaseTool):
    name = "send_transaction"
    description = """
        Useful when you want to send a transaction from one wallet address to another. 
        The sender_address is the address of the wallet you want to send the transaction from.
        The receiver_address is the address of the wallet you want to send the transaction to.
        The token_symbol is a set of usually uppercase alphabets of not more than 4 characters in length. This is associated with the token you want to send (If not provided we are using the native token and don't need it as input).
        The current_network_id is the id of the network you are currently on
    """

    args_schema: Type[BaseModel] = SendTransactionSchema

    underlying_session_id: str = None

    def _run(self, sender_address, receiver_address, token_symbol, amount, current_network_id):
        # Initalize web3 provider
        w3 = create_web3_provider_modal(current_network_id)
        # Get token address
        token_address = ERC20_SYMBOL_TO_ADDRESS[current_network_id].get(token_symbol)
        if token_address is None:
            raise ValueError("Token not supported")
        # Check if addresses are valid
        if not is_valid_web3_addresses(
            [sender_address, receiver_address, token_address]
        ):
            raise ValueError("Invalid account_address or token_address")
        tx = Account().send_transaction(
            w3, sender_address, receiver_address, token_symbol, token_address, amount
        )
        push_to_supabase([tx], "to_parse", self.underlying_session_id)
        return [tx]

    def _arun(self, sender_address, receiver_address, amount):
        raise NotImplementedError("send_transaction does not support async")


class SwapTokenTool(BaseTool):
    name = "swap_token"
    description = """
        Useful when you want to swap tokens. That is exchange the tokens I have with some other tokens I want.
        The account_address is the address of the current wallet.
        The from_token is the name of the token you want to swap.
        The from_token_amount is the amount of the from_token you want to swap.
        The to_token is the name of the token you want to swap to.
        The current_network_id is the id of the network you are currently on
    """

    args_schema: Type[BaseModel] = SwapTokenSchema

    underlying_session_id: str = None

    def _run(self, account_address, from_token, from_token_amount, to_token, current_network_id):
        # Initalize web3 provider
        w3 = create_web3_provider_modal(current_network_id)
        # Get token address
        from_token_address = ERC20_SYMBOL_TO_ADDRESS[current_network_id].get(from_token)
        to_token_address = ERC20_SYMBOL_TO_ADDRESS[current_network_id].get(to_token)
        if from_token_address is None or to_token_address is None:
            raise ValueError("Token not supported")
        # Check if addresses are valid
        if not is_valid_web3_addresses(
            [account_address, from_token_address, to_token_address]
        ):
            raise ValueError("Invalid account_address or token_address")
        tx = Account().swap_token(w3, account_address, from_token_address, from_token_amount, to_token_address)
        print(tx)
        push_to_supabase([tx], "to_parse", self.underlying_session_id)
        return tx
    
    def _arun(self, from_token, from_token_amount, to_token):
        raise NotImplementedError("swap_token does not support async")


class CreateAndDeployContractTool(BaseTool):
    name = "create_and_deploy_contract"
    description = """
        Useful when you want to create and deploy a contract.
        The contract_name is the name of the contract you want to create and deploy.
        The contract_description is the description of the contract you want to create and deploy.
    """

    args_schema: Type[BaseModel] = CreateAndDeployContractSchema

    underlying_session_id: str = None

    def _run(self, contract_name, contract_description):
        tx = Contract().create_and_deploy_contract(contract_name, contract_description)
        push_to_supabase([tx], "to_parse", self.underlying_session_id)

        regex = r"```solidity(.*?)```"
        match = re.search(regex, tx['payload'], re.DOTALL)
        result = None
        if match:
            result = match.group(1)
        else:
            return "Invalid code was generated"
        
        response = requests.post('http://localhost:3023/compile', json={"sourceCode":result})
        response_string = response.text
        response_data = json.loads(response_string)
        print("response:",response_data['abi'])
        push_to_supabase(f"#abistart#{response_data['abi']}#abiend#\n#bcstart#{response_data['bytecode']}#bcend#", "bot", self.underlying_session_id)

        return "Button to generate contract has been created"

    def _arun(self, contract_name, contract_description):
        raise NotImplementedError("create_and_deploy_contract does not support async")



class CheckSocialFollowersTool(BaseTool):
    name = "check_social_followers"
    description = """
        Useful when you want to check the number of followers on Web3 social media platforms like Lens or Fancaster for a particular user or address.
        The social_media_platform is the name of the social media platform you want to check.
        The social_media_handle is the handle of the account you want to check.
    """

    args_schema: Type[BaseModel] = CheckSocialFollowersSchema

    underlying_session_id: str = None

    def _run(self, social_media_platform, social_media_handle):
        future = executor.submit(
            run_async,
            Socials().check_social_followers(
                social_media_platform, social_media_handle
            ),
        )
        followers = future.result()
        return followers

    def _arun(self, social_media_platform, social_media_handle):
        raise NotImplementedError("check_social_followers only supports async")


class GetENSDomainTool(BaseTool):
    name = "get_ens_domain"
    description = """
        Useful when you want to get the ens domain of a particular address.
        The address is the address you want to get the ens domain of.
    """

    args_schema: Type[BaseModel] = GetENSDomainSchema

    underlying_session_id: str = None

    def _run(self, address):
        future = executor.submit(run_async, Socials().get_ens_domain(address))
        followers = future.result()
        return followers

    def _arun(self, address):
        raise NotImplementedError("get_ens_domain does not support async")


# Setting up the Flask app
app = Flask(__name__)


@app.route("/")
def index():
    """
    Default route of the middleware
    """
    return jsonify(message="Welcome to the Donna's Middleware!")


@app.route("/generate", methods=["GET"])
def generate_output():
    """
    Generate output from the OpenAI API
    """
    try:
        data = request.get_json()
    except:
        return jsonify(message="Invalid JSON"), 400

    if data is None:
        return jsonify(message="No JSON"), 400
    if data["content"] is None or data["content"] == "":
        return jsonify(message="No Text"), 400
    if data["session_id"] is None or data["session_id"] == "":
        return jsonify(message="No Chat ID"), 400

    llm = ChatOpenAI(model="gpt-4-1106-preview", temperature=0)

    # Initialize Agent
    tools = [
        # Account Tools
        GetAccountBalanceTool(),
        SendTransactionTool(underlying_session_id=data["session_id"]),
        SwapTokenTool(underlying_session_id=data["session_id"]),
        # Contract Generation Tools
        CreateAndDeployContractTool(underlying_session_id=data["session_id"]),
        # Socials Tools
        CheckSocialFollowersTool(underlying_session_id=data["session_id"]),
        GetENSDomainTool(underlying_session_id=data["session_id"]),
    ]
    agent = initialize_agent(
        tools,
        llm,
        agent=AgentType.OPENAI_FUNCTIONS,
        verbose=True,
        agent_kwargs=AGENT_KWARGS,
    )

    output = agent.run(data["content"])
    push_to_supabase(output, "bot", data["session_id"])

    return jsonify(message="Success")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
