/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '4px',
  p: 2,
};

const BotMessage = ({ message }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex justify-start w-full relative mb-6 max-w-3xl">
      <div className="flex bg-slate-600 rounded-2xl p-5">
        <div className="flex flex-col text-white ml-1 flex-grow overflow-hidden">
          {message}
        </div>
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
                    <span className="text-gray-800 font-bold text-2xl">MATIC</span>
                  </div>
                  <span className="text-gray-800 font-bold text-2xl">1</span>
                </div>
                <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                  <span className="">MATIC</span>
                  <span>~$0.912585</span>
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
                    <span className="text-gray-800 font-bold text-2xl">USDT</span>
                  </div>
                  <span className="text-gray-800 font-bold text-2xl">0.868115</span>
                </div>
                <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                  <span className="">Tether USD</span>
                  <span>~$0.870118 (-4.65%)</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 px-5 py-4 rounded-md mt-2">
                <div className="flex pt-2 text-sm text-gray-600 font-bold flex-row items-center justify-between">
                  <span className="">1 MATIC = 0.868115 USDT <span className="font-semibold">(~$0.87)</span></span>
                </div>
                <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                  <span className="">Slippage tolerance</span>
                  <span className="font-bold">1% Auto</span>
                </div>
                <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                  <span className="">Minimum receive</span>
                  <span className="font-bold">0.859014 USDT</span>
                </div>
                <div className="flex text-sm text-gray-600 font-semibold flex-row items-center justify-between">
                  <span className="">Network Fee</span>
                  <span className="font-bold">Free</span>
                </div>
              </div>
              <button className="bg-[#adaaaa] py-2.5 rounded-md text-white text-lg font-semibold">Swap</button>
            </div>
          </Box>
        </Modal>
      </div>
      <span className="w-10 h-10 rounded-br-full bg-slate-600 absolute bottom-0 left-0 transform translate-y-1/2"></span>
    </div>
  );
};

export default BotMessage;
