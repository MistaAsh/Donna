import { ConnectWallet, useAddress, useNetwork } from "@thirdweb-dev/react";
import { useBalance } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useState } from "react";
import TokensERC20 from "../src/components/airstack/tokensERC20.tsx";
import TokensNFT from "../src/components/airstack/tokensNFT.tsx";
import TransactionHistory from "../src/components/transactionHistory.tsx";
import Contacts from "../src/components/Contacts.tsx";
import { useRouter } from 'next/router';

const ActiveButton = ({ activeTab, tab, onClick }) => {
  return (
    <button
      className={`w-1/4 py-2 text-md font-semibold hover:border-b-2 hover:border-b-gray-300 ${activeTab === tab.toLowerCase() && "border-b-2 border-b-gray-300"
        }`}
      onClick={onClick}
    >
      {tab}
    </button>
  );
};

export default function Home() {
  const address = useAddress();
  const network = useNetwork();
  const { data, isLoading } = useBalance(NATIVE_TOKEN_ADDRESS);
  const [activeTab, setActiveTab] = useState("tokens");
  const router = useRouter();
  if (!address) {
    return (
      <div className="bg-[#F8F8F8] h-screen px-[300px] flex flex-col items-center justify-center gap-6">
        <img
          src={"/images/logo.png"}
          alt={"Logo"}
          className="h-48 w-48 rounded-full"
        />
        <div className="text-4xl pb-2 font-bold">Chat With Donna</div>
        <div>
          <ConnectWallet
            dropdownPosition={{
              side: "bottom",
              align: "center",
            }}
            className="bg-[#e9e6e6] text-gray-700"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <div className="bg-white mx-[300px] min-h-screen pt-10 pb-10 flex flex-col items-center gap-6">
        <div
          className="flex flex-row items-center justify-center gap-2 cursor-pointer bg-black text-white px-5 py-3 rounded-lg font-semibold"
          onClick={() => router.push('/chat')}
        >
          Chat with Donna
        </div>
        <div>
          <ConnectWallet
            dropdownPosition={{
              side: "bottom",
              align: "center",
            }}
            theme="light"
            className="bg-[#e9e6e6] text-gray-700"
          />
        </div>
        <div className="w-full py-2">
          <div className="flex flex-start justify-between items-center w-full">
            <ActiveButton
              activeTab={activeTab}
              tab="Tokens"
              onClick={() => setActiveTab("tokens")}
            />
            <ActiveButton
              activeTab={activeTab}
              tab="Transactions"
              onClick={() => setActiveTab("transactions")}
            />
            <ActiveButton
              activeTab={activeTab}
              tab="NFTs"
              onClick={() => setActiveTab("nfts")}
            />
            <ActiveButton
              activeTab={activeTab}
              tab="Contacts"
              onClick={() => setActiveTab("contacts")}
            />
          </div>
          <div className="flex flex-row items-center justify-center pt-10 px-6 w-full">
            {activeTab === "tokens" && (
              <TokensERC20 identity={address} chain="ethereum" />
            )}
            {activeTab === "transactions" && (
              <TransactionHistory chainId={1} address={address} />
            )}
            {activeTab === "nfts" && (
              <TokensNFT identity={address} chain="polygon" />
            )}
            {activeTab === "contacts" && <Contacts />}
          </div>
        </div>
      </div>
    </div>
  );
}
