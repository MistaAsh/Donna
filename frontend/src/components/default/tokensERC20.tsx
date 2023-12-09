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
        <h2 className="text-lg font-bold">{token.name}</h2>
        <p className="text-sm font-medium text-[#424242]">{token.formattedAmount} {token.symbol}</p>
      </div>
    </div>
  </div>
);

const fetchNFTData = async (chainId, address) => {
    const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
    const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?nft=true&key=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      return response.data.data.items.filter(item => item.type === 'nft'); // Filtering NFT data
    } catch (error) {
      throw new Error("Error fetching NFT data:", error);
    }
  };


const TokensERC20ALL = ({ address, chainId }) => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    chainId = useChainId();
    address = useAddress();
    console.log("cool:",chainId);
    useEffect(() => {
      setLoading(true);
      fetchNFTData(chainId, address)
        .then((data) => {
          setNfts(data);
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

  if (nfts.length === 0) {
    return <p>No NFTs found</p>;
  }

  return (
    <div className="flex flex-col w-full">
      {nfts.map((token, index) => (
        <TokenCard key={index} token={token} />
      ))}
    </div>
  );
};

export default TokensERC20ALL;
