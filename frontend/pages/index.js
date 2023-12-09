import { ConnectWallet, useAddress, useChainId } from "@thirdweb-dev/react";
import { useBalance } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useState } from "react";
import TokensERC20 from "../src/components/airstack/tokensERC20.tsx";
import TokensERC721All from "../src/components/default/tokensERC721All.tsx";
import TokensERC20All from "../src/components/default/tokensERC20All.tsx";
import TokensNFT from "../src/components/airstack/tokensNFT.tsx";
import TransactionHistory from "../src/components/transactionHistory.tsx";
import Contacts from "../src/components/Contacts.tsx";
import { useRouter } from "next/router";

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
  const chainId = useChainId();
  let network = "ethereum";
  if (chainId === 137) {
    network = "polygon";
  } else if (chainId === 8453) {
    network = "base";
  } else if (chainId === 534352) {
    network = "scroll";
  } else if (chainId === 5000) {
    network = "mantle";
  }

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
          className="flex flex-row items-center justify-center gap-2 cursor-pointer bg-black text-white p-3 rounded-md"
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
            {activeTab === "tokens" && (chainId === 137 || chainId === 8453 || chainId === 1)
              ? (<TokensERC20 identity={address} chain={network} />)
              : activeTab === "tokens" && chainId && <TokensERC20All identity={address} chain={chainId} />
            }

            {activeTab === "transactions" &&
              <TransactionHistory chainId={chainId} address={address} />}

            {activeTab === "nfts" && (chainId === 137 || chainId === 8453 || chainId === 1)
              ? (<TokensNFT identity={address} chain={network} />)
              : activeTab === "nfts" && chainId && <TokensERC721All identity={address} chain={chainId} />
            }

            {activeTab === "contacts" && <Contacts />}
          </div>
        </div>
      </div>
    </div>
  );
}
