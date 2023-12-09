import React, { useState, useEffect } from "react";
import axios from "axios";

// Function to fetch transaction history
const fetchTransactionHistory = async (chainId, address) => {
  const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/transactions_v2/?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.data.items; // The transaction data
  } catch (error) {
    throw new Error("Error fetching transaction history:", error);
  }
};

// React component to display transaction history
const TransactionHistoryComponent = ({ chainId, address }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchTransactionHistory(chainId, address)
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [chainId, address]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {transactions.map((transaction, index) => (
        <div key={index}>
          <div key={transaction.date} className='flex border-b-slate-200 border-b-[1px]'>
            <div className="items-stretch flex gap-4 pr-4 py-4">
              <div className="items-center flex justify-between gap-4 pr-16 max-md:pr-5">
                <div className="items-stretch self-stretch flex grow basis-[0%] flex-col">
                  <div className="text-neutral-700 text-base font-bold leading-6 whitespace-nowrap">
                    <span className="text-neutral-700">{transaction.type}</span>
                    <span className="text-neutral-700">&nbsp;{transaction.amount}&nbsp;{transaction.currency}</span>
                  </div>
                  <div className="items-center flex justify-between gap-4">
                    <div className="items-stretch flex gap-1.5 my-auto">
                      <div className="text-neutral-700 text-opacity-60 text-sm font-medium tracking-normal grow whitespace-nowrap">
                        {transaction.address.substring(0, 2)}...{transaction.address.slice(-2)}
                      </div>
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/73fb33e673669b7868f52e6633b49936e329dfb5e66a28dd7f6c8f1b885e6739?apiKey=3d055ebf140b4df39c45c33773b9d984&"
                        className="aspect-square object-contain object-center w-3.5 overflow-hidden shrink-0 max-w-full self-start"
                      />
                    </div>
                    <div className="ml-2 text-neutral-700 text-opacity-60 text-sm font-medium leading-5 self-stretch grow whitespace-nowrap">
                      11:34 PM IST
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistoryComponent;
