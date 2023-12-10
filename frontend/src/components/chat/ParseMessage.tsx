import React, { useEffect, useState } from "react";
import { useAddress, useSigner, useWallet } from "@thirdweb-dev/react";
import { errors, ethers, BigNumber } from "ethers";
import TransactionSimulation from "./TransactionSimulation";
import { SwapWidget } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import Markdown from 'react-markdown'

const ParseMessage = ({ message }) => {
  const [messageJson, setMessageJson] = useState([]);
  useEffect(() => {
    async function parseMessage() {
      const message_json = await JSON.parse(message);
      setMessageJson(message_json);
    }
    parseMessage();
  }, [message]);

  return (
    <>
      {messageJson?.map((transaction, index) => {
        if (transaction) {
          return <TransactionWidget key={index} transaction={transaction} />
        }
      })}
    </>
  );
};


const TransactionWidget = ({ transaction }) => {
  if (Object.keys(transaction?.payload).length === 0) return null;

  const signer = useSigner();
  const address = useAddress();
  const wallet = useWallet();
  const [swapDetails, setSwapDetails] = useState({
    from_token: "",
    to_token: "",
    from_token_amount: "",
  });
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    if (transaction?.method === "swap_token") {
      const from_token = transaction.payload.from_token;
      const to_token = transaction.payload.to_token;
      const from_token_amount = transaction.payload.from_token_amount;
      setSwapDetails({
        from_token,
        to_token,
        from_token_amount,
      });
    }

    console.log("Transaction", transaction);
  }, [transaction]);

  const NATIVE = 'NATIVE'

  // WBTC as the default output token
  const WBTC = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'

  const sendTransaction = async (payload) => {
    try {
      // Assuming payload.value is in Ether and needs to be converted to Wei
      const valueInWei = ethers.utils.parseUnits(payload?.value?.toString(), 'ether');

      const tx = {
        to: payload.to,
        value: valueInWei.toString(),
        from: address,
      };

      const txResponse = await signer?.sendTransaction(tx);
      await txResponse?.wait();
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="flex justify-start w-full relative mb-6">
      <div className="flex bg-slate-600 rounded-2xl p-5">
        {
          (transaction?.method === "send_transaction") && (
            <div className="flex flex-col text-white ml-1 flex-grow overflow-hidden">
              This is a preview of the transaction you are about to sign
              <TransactionSimulation transaction={{
                from: transaction.payload.from,
                to: transaction.payload.to,
                value: transaction.payload.value
              }} />
              <div className="flex flex-col mt-3">
                Please review the details before confirming
                <button
                  className="text-slate-600 bg-white p-2 rounded mt-3"
                  onClick={() => sendTransaction(transaction?.payload)}
                >
                  Confirm and Send Transactions
                </button>
              </div>
            </div>
          )
        }
        {
          (transaction?.method === "swap_token") && (
            <div className="Uniswap">
              <SwapWidget
                defaultInputTokenAddress={NATIVE}
                defaultInputAmount={2}
                defaultOutputTokenAddress={WBTC}
              />
            </div>
          )
        }
        {
          transaction?.method === "create_and_deploy_tcontract" && (
            <div className="markdown-body p-4">
              <Markdown>
                {transaction.payload}
              </Markdown>
            </div>
          )
        }
      </div>
      <span className="w-10 h-10 rounded-br-full bg-slate-600 absolute bottom-0 left-0 transform translate-y-1/2"></span>
    </div>
  )
}

export default ParseMessage;
