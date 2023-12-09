import React, { useEffect, useState } from 'react';
import { useChainId } from "@thirdweb-dev/react";
import { ethers } from 'ethers';

const chainIdLinkMapping = {
    1: 'https://eth-mainnet.g.alchemy.com/v2/sZxThjTQPsozxGRWdM6rvaSLiKAL6-kh',
    84532: 'https://base-mainnet.g.alchemy.com/v2/eYiwU232OAwjYKZQrKWshJ-4hIdr-mj3',
    137: 'https://polygon-mainnet.g.alchemy.com/v2/KVgK4nBEuq3n90EzFAKWgUbcHBTEzqHv',
    80001: 'https://polygon-mumbai.g.alchemy.com/v2/MmJ-scazZpKa-Rr2QkDFzfdYpScIQeN2'
}

const TransactionSimulation = ({ transaction }) => {
    const [changes, setChanges] = useState([]);
    const [error, setError] = useState(null);
    const chainId = useChainId();

    const getChanges = async () => {
        const amountInWei = transaction.value;
        const amountInWeiBN = ethers.utils.parseUnits(amountInWei, 'wei');
        console.log(amountInWeiBN)
        const amountHash = amountInWeiBN.toHexString();
        const options = {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json' },
            body: JSON.stringify({
                id: 1,
                jsonrpc: '2.0',
                method: 'alchemy_simulateAssetChanges',
                params: [
                    {
                        from: transaction.from,
                        to: transaction.to,
                        value: amountHash,
                    }
                ]
            })
        };

        fetch(chainIdLinkMapping[chainId], options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setChanges(response.result.changes)
                if (response.result.error !== null) {
                    setError(response.result.error)
                    console.log(response.result.error)
                }
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        getChanges();
    }, [chainId]);

    return (
        <div className="max-w-md mx-auto mt-4 px-4 bg-white rounded-md shadow-md self-start">
            {changes.map((change, index) => (
                <div key={index} className="mb-2 py-2 px-1 border-b border-gray-300">
                    <div className='flex items-center justify-between gap-5'>
                        <div className='flex'>
                            <img src={change.logo} alt={`${change.symbol} logo`} className="w-8 h-8 mr-2" />
                            <div className='flex flex-col'>
                                <p className="text-gray-600 self-start">Sent To</p>
                                <p className="text-gray-400 text-xs">{change.to.slice(0, 4)}...{change.to.slice(-4)}</p>
                            </div>
                        </div>
                        <p className="text-green-500 text-sm ml-auto">{change.amount} {change.symbol}</p>
                    </div>
                </div>
            ))}
            {
                error &&
                (<div className="mb-2 pt-1 pb-1 border-b border-gray-300">
                    <p className="text-red-500 text-sm">{error.message}: {error.revertReason}</p>
                </div>)
            }
        </div>
    );
};

export default TransactionSimulation;
