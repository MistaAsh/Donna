import React from 'react'
import UserMessage from './UserMessage'
import BotMessage from './BotMessage'
import ChatBox from './ChatBox'
import Header from './Header'

const ChatWindow = () => {
    const messages = [
        {
            content: 'something',
            type: 'bot'
        },
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
        <div className='flex flex-col justify-between bg-black h-screen mx-[300px]'>
            <div className='overflow-y-auto flex flex-col gap-3.5'>
                <Header />
                <div className='flex flex-col flex-grow p-5 overflow-y-scroll'>
                    {messages.map(({ type, content }) => (
                        type === 'bot' ?
                            <BotMessage message={content} />
                            : <UserMessage message={content} />
                    ))}
                </div>
            </div>
            <ChatBox />
        </div>
    )
}

export default ChatWindow;