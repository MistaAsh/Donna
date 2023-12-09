import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useChainId, useAddress } from "@thirdweb-dev/react";

const TokenCard = ({ token }) => (
  <div className="w-full px-2 mb-4">
    <div className="flex flex-row items-center gap-6 border-b-2 pb-5 px-6 border-b-[#F8F8F8]">
      <img
        src={token.logo || "/images/alt-token.png"}
        alt={token.name}
        className="h-12 w-12 rounded-full"
      />
      <div>
        <h2 className="text-lg font-bold">{token?.contract_display_name}</h2>
        <p className="text-sm font-medium text-[#424242]">{token.balance / 10 ** token.contract_decimals} {token.contract_ticker_symbol}</p>
      </div>
    </div>
  </div>
);

const fetchTokensData = async (chainId, address) => {
  const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log("response:", response);
    return response.data.data.items.filter(item => item.type === 'cryptocurrency');
  } catch (error) {
    throw new Error("Error fetching NFT data:", error);
  }
};


const TokensERC20All = ({ address, chainId }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  chainId = useChainId();
  address = useAddress();

  useEffect(() => {
    setLoading(true);
    fetchTokensData(chainId, address)
      .then((data) => {
        setTokens(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [chainId, address]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (tokens.length === 0) {
    return <p>No Tokens found</p>;
  }

  return (
    <div className="flex flex-col w-full">
      {tokens?.map((token, index) => (
        <TokenCard key={index} token={token} />
      ))}
    </div>
  );
};

export default TokensERC20All;
