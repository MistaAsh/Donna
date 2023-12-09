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
          {/* Render your transaction details here */}
          <p>Transaction Hash: {transaction.tx_hash}</p>
          {/* Add more transaction details as needed */}
        </div>
      ))}
    </div>
  );
};

export default TransactionHistoryComponent;
