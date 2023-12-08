import React from 'react';

const UserMessage = ({ message }) => {
  return (
    <div className='flex justify-end w-full relative mb-6'>
      <div className='flex bg-slate-300 rounded-2xl p-5 max-w-2xl overflow-hidden'>
        <div className='flex flex-col text-white flex-grow'>
          {message}
        </div>
      </div>
      <span className='w-10 h-10 rounded-bl-full bg-slate-300 absolute bottom-0 right-0 transform translate-y-1/2'></span>
    </div>
  );
};

export default UserMessage;
