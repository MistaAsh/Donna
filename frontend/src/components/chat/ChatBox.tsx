// ChatBox.jsx
import React from 'react';

const ChatBox = () => {
  return (
    <div className="mb-4 mx-4">
      <input
        type="text"
        className="rounded-2xl h-15 py-2 px-3 block w-full border border-gray-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
        placeholder="Enter your message here"
      />
    </div>
  );
};

export default ChatBox;
