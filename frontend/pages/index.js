import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useBalance } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";

export default function Home() {
  const address = useAddress();
  const { data, isLoading } = useBalance(NATIVE_TOKEN_ADDRESS);

  if (!address) {
    return (
      <div className="mx-[300px] flex flex-col items-center justify-center h-[100vh] gap-6">
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
    <div className="mx-[300px] mt-10 flex flex-col items-center justify-center gap-6">
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
    </div>
  )
}
