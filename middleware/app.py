from imports import *

# Setting up the Web3 provider
w3 = Web3(Web3.HTTPProvider(WEB3_HTTP_PROVIDER_URI))

# Supabase Setup
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


class GetAccountBalanceTool(BaseTool):
    name = "get_account_balance"
    description = """
        Useful when you want ot get the account balance of the given wallet address in ETH.
        The wallet address is the address of the wallet you want to get the balance of.
    """

    args_schema: Type[BaseModel] = GetAccountBalanceSchema

    def _run(self, account_address):
        balance = Account().get_account_balance(
            self,
        )
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

    def _run(self, sender_address, receiver_address, amount):
        tx = Account().send_transaction(self, sender_address, receiver_address, amount)
        return tx

    def _arun(self, sender_address, receiver_address, amount):
        raise NotImplementedError("send_transaction does not support async")


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

    if data["text"] is None or data["text"] == "":
        return jsonify(message="No Text"), 400
    if data["user_id"] is None or data["user_id"] == "":
        return jsonify(message="No User ID"), 400
    if data["chat_id"] is None or data["chat_id"] == "":
        return jsonify(message="No Chat ID"), 400

    try:
        data["chat_id"] = int(data["chat_id"])
        chat_id = data["chat_id"]
    except:
        print("chat_id must be a number")
        return jsonify(message="chat_id must be a number")

    llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)

    # Initialize Agent
    tools = [
        GetAccountBalanceTool(),
        SendTransactionTool(),
    ]
    agent = initialize_agent(
        tools,
        llm,
        agent=AgentType.OPENAI_FUNCTIONS,
        verbose=True,
        agent_kwargs=AGENT_KWARGS,
    )

    output = agent.run(data["text"])

    # Store the output in supabase
    try:
        result = (
            supabase.table("messages")
            .insert(
                {
                    "text": output,
                    "is_bot": True,
                    "conversation_id": data["chat_id"],
                }
            )
            .execute()
        )
    except Exception as e:
        print(e, "chat id must be valid")
        return jsonify(message="chat_id must be valid")
    return jsonify(message="Success")


if __name__ == "__main__":
    app.run(debug=True, port=8000)
