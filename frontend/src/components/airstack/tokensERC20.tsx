import { useQuery } from "@airstack/airstack-react";

const TokenCard = ({ token }) => (
  <div className="w-full px-2 mb-4">
    <div className="flex flex-row items-center gap-6 border-b-2 pb-5 px-6 border-b-[#F8F8F8]">
      <img
        src={token?.logo || "/images/alt-token.png"}
        alt={token?.name}
        className="h-12 w-12 rounded-full"
      />
      <div>
        <h2 className="text-lg font-bold">{token.name}</h2>
        <p className="text-sm font-medium text-[#424242]">{token.formattedAmount} {token.symbol}</p>
      </div>
    </div>
  </div>
);

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

// `${}`
const GET_VITALIK_LENS_FARCASTER_ENS = `
query MyQuery {
  Wallet(input: {identity: "vitalik.eth", blockchain: ethereum}) {
    socials {
      dappName
      profileName
    }
    addresses
  }
}
`;

const TokensERC20 = ({ identity, chain }) => {
  const query = `
    query MyQuery {
      TokenBalances(
        input: {filter: {owner: {_eq: "${identity}"}}, blockchain: ${chain}, limit: 50}
      ) {
        TokenBalance {
          token {
            name
            symbol
            logo {
              original
            }
          }
          formattedAmount
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
    return <p>No tokens found</p>;
  }
  
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Map the data to a suitable format

  const tokens = data?.TokenBalances?.TokenBalance.map((t) => ({
    name: t.token.name,
    symbol: t.token.symbol,
    logo: t.token.logo.original, // This will be null if the original logo is null
    formattedAmount: t.formattedAmount,
  }));

  // Render the tokens
  return (
    <div className="flex flex-col w-full">
      {tokens?.map((token, index) => (
        <TokenCard key={index} token={token} />
      ))}
    </div>
  );
};

export default TokensERC20;
