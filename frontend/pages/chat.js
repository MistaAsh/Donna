import React from 'react'
import ChatWindow from '../src/components/chat/ChatWindow'
import { useEffect } from "react";
import { generateRandomString } from "../src/utils/generateRandomString";

const Chat = () => {
  useEffect(() => {
    // Check if session ID is already stored in sessionStorage
    const storedSessionId = sessionStorage.getItem('sessionId');

    if (!storedSessionId) {
      // If session ID is not stored, generate a new one and store it in sessionStorage
      const newSessionId = generateRandomString(10);
      sessionStorage.setItem('sessionId', newSessionId);
      // console.log('Session ID generated and stored in sessionStorage: ', newSessionId);
    }
  }, []);
  return (
    <ChatWindow />
  )
}

export default Chat;
