import React from 'react'

const BotMessage = ({ message }) => {
    return (
        <p className='bg-white p-3 rounded-r-[15px] rounded-tl-[15px]'>
            {message.content}
        </p>
    )
};

export default BotMessage;