from imports import *

# Setting up the Web3 provider
w3 = Web3(Web3.HTTPProvider(WEB3_HTTP_PROVIDER_URI))

# Settign up the Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


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


class GetAccountBalanceTool(BaseTool):
    name = "get_account_balance"
    description = """
        Useful when you want ot get the account balance of the given wallet address in ETH.
        The wallet address is the address of the wallet you want to get the balance of.
    """

    args_schema: Type[BaseModel] = GetAccountBalanceSchema

    def _run(self, account_address):
        balance = Account().get_account_balance(w3, account_address)
        return balance

    def _arun(self, account_address):
        raise NotImplementedError("get_account_balance does not support async")


class SendTransactionTool(BaseTool):
    name = "send_transaction"
    description = """
        Useful when you want to send a transaction from one wallet address to another.
        The sender_address is the address of the wallet you want to send the transaction from.
        The receiver_address is the address of the wallet you want to send the transaction to.
        The amount is the amount of ETH you want to send.
    """

    args_schema: Type[BaseModel] = SendTransactionSchema

    underlying_session_id: str = None

    def _run(self, sender_address, receiver_address, amount):
        tx = Account().send_transaction(w3, sender_address, receiver_address, amount)
        push_to_supabase(tx, "to_parse", self.underlying_session_id)
        return tx

    def _arun(self, sender_address, receiver_address, amount):
        raise NotImplementedError("send_transaction does not support async")


class SwapTokenTool(BaseTool):
    name = "swap_token"
    description = """
        Useful when you want to swap tokens. That is exchange the tokens I have with some other tokens I want.
        The from_token is the name of the token you want to swap.
        The from_token_amount is the amount of the from_token you want to swap.
        The to_token is the name of the token you want to swap to.
    """

    args_schema: Type[BaseModel] = SwapTokenSchema

    underlying_session_id: str = None

    def _run(self, from_token, from_token_amount, to_token):
        tx = Account().swap_token(w3, from_token, from_token_amount, to_token)
        push_to_supabase(tx, "to_parse", self.underlying_session_id)
        return tx

    def _arun(self, from_token, from_token_amount, to_token):
        raise NotImplementedError("swap_token does not support async")


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

    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

    # Initialize Agent
    tools = [
        GetAccountBalanceTool(),
        SendTransactionTool(underlying_session_id = data["session_id"]),
        SwapTokenTool(underlying_session_id = data["session_id"]),
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
    app.run(debug=True, port=8000)
