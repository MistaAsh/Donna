import React from 'react'

const UserMessage = ({message}) => {
  return (
      <p className='text-end p-3 bg-gray-300 rounded-l-[15px] rounded-tr-[15px] text-black flex justify-start mt-3 max-w-3xl self-end'>
        {message}
      </p>
  )
}

export default UserMessage;
