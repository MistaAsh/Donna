import { ConnectWallet, useAddress, useNetwork } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useBalance } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useState } from "react";
import TokensERC20 from '../src/components/airstack/tokensERC20.tsx'
import TransactionHistory from '../src/components/transactionHistory.tsx'
const ActiveButton = ({ activeTab, tab, onClick }) => {
  return (
    <button className={`w-1/4 py-2 hover:border-b-2 ${activeTab === tab.toLowerCase() && 'border-b-2'}`} onClick={onClick}>{tab}</button>
  )
}

export default function Home() {
  const address = useAddress();
  const network = useNetwork();
  const { data, isLoading } = useBalance(NATIVE_TOKEN_ADDRESS);
  const [activeTab, setActiveTab] = useState("tokens");

  if (!address) {
    return (
      <div className="bg-[#F8F8F8] px-[300px] flex flex-col items-center justify-center h-[100vh] gap-6">
        <div>Logo</div>
        <div>Donna</div>
        <div>
          <ConnectWallet
            dropdownPosition={{
              side: "bottom",
              align: "center",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] h-[100vh]">
      <div className="bg-white mx-[300px] h-[100vh] pt-10 flex flex-col items-center gap-6">
        <div>Donna</div>
        <div>
          <ConnectWallet
            dropdownPosition={{
              side: "bottom",
              align: "center",
            }}
          />
        </div>
        <div>{data?.displayValue} {data?.name}</div>
        <div className="w-full py-2">
          <div className="flex flex-start justify-between items-center w-full">
            <ActiveButton activeTab={activeTab} tab="Tokens" onClick={() => setActiveTab('tokens')} />
            <ActiveButton activeTab={activeTab} tab="Transactions" onClick={() => setActiveTab('transactions')} />
            <ActiveButton activeTab={activeTab} tab="NFTs" onClick={() => setActiveTab('nfts')} />
            <ActiveButton activeTab={activeTab} tab="Contacts" onClick={() => setActiveTab('contacts')} />
          </div>
          <div className="flex flex-row items-center justify-center pt-10">
            {activeTab}
            {activeTab === 'tokens' && (
                <TokensERC20 identity= {address} chain='ethereum'/>
              )}
            {activeTab === 'transactions' && (
                <TransactionHistory chainId={1} address={address} />
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
