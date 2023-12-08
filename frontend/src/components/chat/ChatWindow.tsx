import React from 'react'
import UserMessage from './UserMessage'
import BotMessage from './BotMessage'
import ChatBox from './ChatBox'

const ChatWindow = () => {
    const messages = [
        {
            content: 'something',
            type: 'bot'
        },
        {
            content: 'something 2',
            type: 'user'
        }
    ]

    return (
        <div className='flex flex-col justify-between bg-slate-300'>
            <div className='overflow-y-auto h-[415px] mt-4 flex flex-col gap-3.5'>
                <UserMessage message={messages[0]} />
                <BotMessage message={messages[1]} />
            </div>
            <ChatBox />
        </div>
    )
}

export default ChatWindow;