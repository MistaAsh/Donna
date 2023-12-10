import React from "react";

const UserMessage = ({ message }) => {
  return (
    <div className="flex justify-end w-full relative mb-6">
      <div className="flex bg-slate-400 rounded-2xl p-5 max-w-2xl min-w-[50px] text-right overflow-hidden">
        <div className="flex flex-col text-white font-medium flex-grow">{message}</div>
      </div>
      <span className="w-10 h-10 rounded-bl-full bg-slate-400 absolute bottom-0 right-0 transform translate-y-1/2"></span>
    </div>
  );
};

export default UserMessage;
