import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";

import Web3 from "web3";
import axios from 'axios';

import {getQuote} from "./get-rate";
import {FusionSDK, PrivateKeyProviderConnector} from "@1inch/fusion-sdk";
import {
  authKey,
  ethNetworkRPC,
  network,
  OneInchRouter,
  OneInchToken,
  OneInchTokenAmount,
  pk,
  WETH_Token
} from "./config/config";

export default function Home() {
  const web3 = new Web3(new Web3.providers.HttpProvider(ethNetworkRPC));

  const blockchainProvider = new PrivateKeyProviderConnector(
      pk,
      // @ts-ignore
      web3,
  )

  const sdk = new FusionSDK({
    url: "https://api.1inch.dev/fusion",
    network: network,
    blockchainProvider,
    authKey: authKey,
  });

  async function testCool() {
    const quote = await getQuote(sdk, OneInchToken, WETH_Token, OneInchTokenAmount);
    console.log(quote);
    console.log("cool");
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome to{" "}
            <span className={styles.gradientText0}>
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                thirdweb.
              </a>
            </span>
          </h1>

          <p className={styles.description}>
            Get started by configuring your desired network in{" "}
            <code className={styles.code}>src/index.js</code>, then modify the{" "}
            <code className={styles.code}>src/App.js</code> file!
          </p>

          <div className={styles.connect}>
            <ConnectWallet
              dropdownPosition={{
                side: "bottom",
                align: "center",
              }}
            />
            <button className={styles.button} onClick={testCool}>
              Click me!
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://portal.thirdweb.com/"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/portal-preview.png"
              alt="Placeholder preview of starter"
              width={300}
              height={200}
            />
            <div className={styles.cardText}>
              <h2 className={styles.gradientText1}>Portal ➜</h2>
              <p>
                Guides, references, and resources that will help you build with
                thirdweb.
              </p>
            </div>
          </a>

          <a
            href="https://thirdweb.com/dashboard"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/dashboard-preview.png"
              alt="Placeholder preview of starter"
              width={300}
              height={200}
            />
            <div className={styles.cardText}>
              <h2 className={styles.gradientText2}>Dashboard ➜</h2>
              <p>
                Deploy, configure, and manage your smart contracts from the
                dashboard.
              </p>
            </div>
          </a>

          <a
            href="https://thirdweb.com/templates"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/templates-preview.png"
              alt="Placeholder preview of templates"
              width={300}
              height={200}
            />
            <div className={styles.cardText}>
              <h2 className={styles.gradientText3}>Templates ➜</h2>
              <p>
                Discover and clone template projects showcasing thirdweb
                features.
              </p>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
