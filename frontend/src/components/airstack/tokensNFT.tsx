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

const TokensNFT = ({ identity, chain }) => {
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
  const { data, loading, error }: QueryResponse = useQuery(
    query,
    {},
    { cache: false },
  );

  if (loading || !data) {
    return <p>Loading...</p>;
  }

  if (!data?.TokenBalances || !data?.TokenBalances.TokenBalance) {
    return <p>No NFTs found</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  } 

  return (
    <div className="flex flex-wrap justify-center overflow-y-auto h-full">
      {data?.items?.map((token, index) => (
        <div key={index} className="p-4">
          <img
            src={token.logo_url || "/images/alt-nft.png"}
            alt={`${token.contract_name} Logo`}
            className="h-52 w-52 rounded-lg shadow-lg"
          />
        </div>
      ))}
    </div>

  );
};

export default TokensNFT;
