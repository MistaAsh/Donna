import React from 'react'

const UserMessage = ({message}) => {
  return (
      <p className='text-end p-3 bg-[#17C3CE] rounded-l-[15px] rounded-tr-[15px] text-white'>
        {message.content}
      </p>
  )
}

export default UserMessage;
