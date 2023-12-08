import React from 'react'

const BotMessage = ({ message }) => {
    return (
        <p className='bg-slate-600 text-white p-3 rounded-r-[15px] rounded-tl-[15px] my-4 flex justify-start mt-3 max-w-3xl self-start'>
            {message}
        </p>
    )
};

export default BotMessage;