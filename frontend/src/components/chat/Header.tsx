// components/Header.js
import { useRouter } from "next/router";
import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";

const Header = () => {
  const router = useRouter();

  return (
    <header className="flex flex-row items-center justify-between px-4 py-6 border-b-slate-600 border-b-[1px]">
      <div className="flex flex-row items-center">
        <div className="mr-3">
          {/* Back button leading to '/' */}
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>
        <h1 className="text-2xl font-bold ml-1">Chat With Your Wallet</h1>
        <img
          src={"/images/logo.png"}
          alt={"Logo"}
          className="h-16 w-16 pl-3 rounded-full"
        />
      </div>
      <div className="">
        <ConnectWallet
          dropdownPosition={{
            side: "bottom",
            align: "center",
          }}
          theme="light"
          className="bg-[#e9e6e6] text-gray-700"
        />
      </div>
    </header>
  );
};

export default Header;
