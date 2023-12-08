import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { init } from "@airstack/airstack-react";
import { AirstackProvider, useQuery } from "@airstack/airstack-react";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";
init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY);

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
