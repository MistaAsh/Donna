import { useQuery } from "@airstack/airstack-react";

const TokenCard = ({ token }) => (
  <div className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
    <div className="bg-white rounded-lg shadow p-4 h-full flex items-center">
      {token.logo && (
        <img
          src={token.logo}
          alt={token.name}
          className="h-12 w-12 rounded-full mr-4"
        />
      )}
      <div>
        <h2 className="text-xl font-semibold">{token.name}</h2>
        <p className="text-gray-600">{token.symbol}</p>
        <p className="text-gray-600">Amount: {token.formattedAmount}</p>
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
  if (!data.TokenBalances || !data.TokenBalances.TokenBalance) {
    return <p>No tokens found</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Map the data to a suitable format

  const tokens = data.TokenBalances.TokenBalance.map((t) => ({
    name: t.token.name,
    symbol: t.token.symbol,
    logo: t.token.logo.original, // This will be null if the original logo is null
    formattedAmount: t.formattedAmount,
  }));

  // Render the tokens
  return (
    <div className="flex flex-wrap -mx-2">
      {tokens.map((token, index) => (
        <TokenCard key={index} token={token} />
      ))}
    </div>
  );
};

export default TokensERC20;
