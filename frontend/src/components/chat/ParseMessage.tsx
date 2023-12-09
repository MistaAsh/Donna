import React, { useState } from "react";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { errors, ethers } from "ethers";

const ParseMessage = ({ message }) => {
  const signer = useSigner();
  const address = useAddress();
  const message_json = JSON.parse(message);

  const sendTransaction = async (payloads) => {
    try {
      // Iterate over the array of payloads
      for (const payload of payloads) {
        const tx = {
          to: payload.to,
          value: ethers.utils.parseUnits(payload.value, 'wei'),
          from: address,
        };
        const txResponse = await signer?.sendTransaction(tx);
        await txResponse?.wait();
      }
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };  

  const handleButtonClick = () => {
    const message_json = JSON.parse(message);
    if (message_json.method === "send_transaction" && !message_json.error) {
      sendTransaction(message_json.payload);
    }
  };

  // Conditionally render nothing if there is an error
  if (message_json.error !== false) {
    return null;
  }

  return (
    <div className="flex justify-start w-full relative mb-6 max-w-3xl">
      <div className="flex bg-slate-600 rounded-2xl p-5">
        <div className="flex flex-col text-white ml-1 flex-grow overflow-hidden">
          Please confirm the following transaction:
          <button
            className="text-slate-600 bg-white p-2 rounded"
            onClick={handleButtonClick}
          >
            Send Transaction
          </button>
        </div>
      </div>
      <span className="w-10 h-10 rounded-br-full bg-slate-600 absolute bottom-0 left-0 transform translate-y-1/2"></span>
    </div>
  );
};

export default ParseMessage;
