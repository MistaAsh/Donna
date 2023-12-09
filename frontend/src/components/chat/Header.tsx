// components/Header.js
import { useRouter } from "next/router";
import Link from "next/link";

const Header = () => {
  const router = useRouter();

  return (
    <header className="bg-black text-white p-4 border-b-slate-600 border-b-[1px]">
      <div className="flex items-center">
        <div className="mr-4">
          {/* Back button leading to '/' */}
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
        </div>
        <h1 className="text-xl font-bold ml-3">Chat with Your Wallet</h1>
      </div>
    </header>
  );
};

export default Header;
