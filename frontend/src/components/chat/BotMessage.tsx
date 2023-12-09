/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useAddress, useChainId, useContract } from "@thirdweb-dev/react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '4px',
  p: 2,
};

const SwapModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { contract, isLoading, error } = useContract("", [
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      stateMutability: 'view',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address'
        },
        {
          name: '',
          type: 'address'
        }
      ],
      name: 'allowance',
      stateMutability: 'view',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      inputs: [
        {
          name: '',
          type: 'address'
        },
        {
          name: '',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [],
      payable: false,
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ]);

  const address = useAddress();
  const chainId = useChainId();
  const [fromTokenAddress, setFromTokenAddress] = useState('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270')
  const [toTokenAddress, setToTokenAddress] = useState('0xc2132D05D31c914a87C6611C10748AEb04B58e8F')
  const [amount, setAmount] = useState('100000000000000000000')

  const [fusionApiData, setFusionApiData] = useState()

  // call this url to get the data every 10 seconds
  useEffect(() => {
    try {
      const interval = setInterval(() => {
        fetch(`/api/swap`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fromTokenAddress, toTokenAddress, amount, address, chainId }),
        })
          .then((res) => res.json())
          .then((data) => {
            setFusionApiData(data?.data)
          })
          .catch((err) => {
            console.error("Error in handleSubmit:", err.message);
          })
      }, 10000);

      console.log(fusionApiData, 'lol')

      return () => clearInterval(interval);
    } catch (error) {
      console.log(error)
    }
  }, [fromTokenAddress, toTokenAddress, amount, address, chainId]);

  const handleSwap = async () => {
    // await contract?.call("approve", [fusionApiData?.routerAddress, fusionApiData?.fromTokenAmount], { value: 0, gasLimit: 1000000, gasPrice: 10000000000 })
    const data = contract?.call("balanceOf", [address], { value: 0, gasLimit: 1000000, gasPrice: 10000000000 })
  }

  return (
    <>
      <button className="py-2 px-3 bg-white mx-3 rounded-lg" onClick={handleOpen}>Swap</button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 bg-[#F8F8F8] px-5 py-4 rounded-md">
              <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                <span className="">You pay</span>
                <span>Balance: 100.123</span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src={"/images/alt-token.png"}
                    alt={""}
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="text-gray-800 font-bold text-2xl">{fusionApiData?.fromTokenSymbol || "WMATIC"}</span>
                </div>
                <span className="text-gray-800 font-bold text-2xl">{fusionApiData?.fromTokenAmount / 10 ** 18}</span>
              </div>
              <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                <span className="">{fusionApiData?.fromTokenName || "WMATIC"}</span>
                <span>~{fusionApiData?.volume?.usd?.fromToken}</span>
              </div>
            </div>
            <div className="flex flex-col items-center py-3">
              <img
                src={"/images/arrow-down.png"}
                alt={""}
                className="h-4 w-4 rounded-full"
              />
            </div>
            <div className="flex flex-col gap-2 bg-[#F8F8F8] px-5 py-4 rounded-md">
              <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                <span className="">You receive</span>
                <span>Balance: 0</span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src={"/images/alt-token.png"}
                    alt={""}
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="text-gray-800 font-bold text-2xl">{fusionApiData?.fromTokenSymbol || "USDT"}</span>
                </div>
                <span className="text-gray-800 font-bold text-2xl">{fusionApiData?.toTokenAmount / 10 ** 6}</span>
              </div>
              <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                <span className="">{fusionApiData?.fromTokenName || "Tether USD"}</span>
                <span>~{fusionApiData?.volume?.usd?.toToken}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-5 py-4 rounded-md mt-2">
              <div className="flex text-sm text-gray-600 font-bold flex-row items-center justify-between">
                {/* <span className="">1 MATIC = 0.868115 USDT <span className="font-semibold">(~$0.87)</span></span> */}
              </div>
              <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                <span className="">Auction Start Amount</span>
                <span className="font-bold">{fusionApiData?.presets?.fast?.auctionStartAmount}</span>
              </div>
              <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                <span className="">Auction End Amount</span>
                <span className="font-bold">{fusionApiData?.presets?.fast?.auctionEndAmount}</span>
              </div>
              {/* <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                <span className="">Minimum receive</span>
                <span className="font-bold">0.859014 USDT</span>
              </div> */}
              <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                <span className="">Network Fee</span>
                <span className="font-bold">{fusionApiData?.gas / 10 ** 6}</span>
              </div>
            </div>
            <button className="bg-[#adaaaa] py-2.5 rounded-md text-white text-lg font-semibold" onClick={handleSwap}>Swap</button>
          </div>
        </Box>
      </Modal>
    </>
  )
}


const BotMessage = ({ message }) => {
  return (
    <div className="flex justify-start w-full relative mb-6 max-w-3xl">
      <div className="flex bg-slate-600 rounded-2xl p-5">
        <div className="flex flex-col text-white ml-1 flex-grow overflow-hidden">
          {message}
        </div>
        <SwapModal />
      </div>
      <span className="w-10 h-10 rounded-br-full bg-slate-600 absolute bottom-0 left-0 transform translate-y-1/2"></span>
    </div>
  );
};

export default BotMessage;
