import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const TransactionSimulation = ({ transaction }) => {
    const [changes, setChanges] = useState([]);
    const [error, setError] = useState(null);

    const getChanges = async () => {
        const amountInWei = '10';
        const amountInWeiBN = ethers.utils.parseUnits(amountInWei, 'ether');
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
                        from: '0x857346484B617EefB237a9A717c600fa6431a31f',
                        to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                        value: amountHash,
                        // data: '0xa9059cbb000000000000000000000000fc43f5f9dd45258b3aff31bdbe6561d97e8b71de00000000000000000000000000000000000000000000000000000000000f4240'
                    }
                ]
            })
        };

        fetch('https://eth-mainnet.g.alchemy.com/v2/sZxThjTQPsozxGRWdM6rvaSLiKAL6-kh', options)
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
    }, [transaction]);

    return (
        <div className="max-w-md mx-auto mt-4 px-4 bg-white rounded-md shadow-md self-start">
            {changes.map((change, index) => (
                <div key={index} className="mb-2 pt-1 pb-1 border-b-[1px]">
                    <div className='flex'>
                        <img src={change.logo} alt={`${change.symbol} logo`} className="w-8 h-8 mt-2" />
                        <div className='flex flex-col m-2'>
                            <p className="text-gray-600">Sent To</p>
                            <p className="text-gray-400 text-xs">{change.to}</p>
                        </div>
                        <p className="flex text-green-500 text-sm items-center ml-2">{change.amount} {change.symbol}</p>
                    </div>
                </div>
            ))}
            <div className="mb-2 pt-1 pb-1 border-b-[1px]">
                {error && <p className="text-red-500 text-sm">{error.message}{": "}{error.revertReason}</p>}
            </div>
        </div >
    );
};

export default TransactionSimulation;
