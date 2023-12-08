import { useQuery } from "@airstack/airstack-react";


interface QueryResponse {
  data: Data;
  loading: boolean;
  error: Error;
}

interface Data {
  Wallet: Wallet;
}

interface Error {
  message: string;
}

interface Wallet {
  socials: Social[];
  addresses: string[];
}

interface Social {
  dappName: "lens" | "farcaster";
  profileName: string;
}


const TokensNFT = ({identity, chain}) => {

  const query = `
    query MyQuery {
      TokenBalances(
        input: {filter: {owner: {_eq: "${identity}"}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain:  ${chain}, limit: 50}
      ) {
        TokenBalance {
          amount
          tokenAddress
          tokenId
          tokenType
          tokenNfts {
            contentValue {
              image {
                small
              }
            }
          }
        }
      }
    }
  `;

  // console.log(query); 
  const { data, loading, error }: QueryResponse = useQuery(query, {}, { cache: false });
  if (loading || !data ) {
    return <p>Loading...</p>;
  }
  if (!data.TokenBalances || !data.TokenBalances.TokenBalance) {
    return <p>No tokens found</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

   // Map the data to a suitable format

   const tokens = data.TokenBalances.TokenBalance.map(t => ({
    name: t.token.tokenNfts,
    symbol: t.token.symbol,
    logo: t.token.logo.original, // This will be null if the original logo is null
    formattedAmount: t.formattedAmount
  }));

  // Render the tokens
  return (
    <div className="flex flex-wrap -mx-2">
      {tokens.map((token, index) => (
        <TokenCard key={index} token={token} />
      ))}
    </div>
  );

}

export default TokensNFT;