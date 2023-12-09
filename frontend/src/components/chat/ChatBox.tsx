// ChatBox.jsx
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAddress, useChainId } from "@thirdweb-dev/react";

const ChatBox = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient(
    "https://ydlodplhsscvfhxfgiha.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbG9kcGxoc3NjdmZoeGZnaWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIwNjM3MjIsImV4cCI6MjAxNzYzOTcyMn0.Y41Q9wTAHmPf9sH4DAUL56Z_O1RneJmH_aZPHGH_-DY"
  );
  const [inputValue, setInputValue] = useState("");
  const network = useChainId();
  const address = useAddress();

  useEffect(() => {
    console.log("network:", network);
  }, [network]);

  const InputProcessor = (inputValue: string) => {
    inputValue.concat(`\n My address is ${address}`);
  }

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const sessionId = window.sessionStorage.getItem("sessionId");
    if (!inputValue.trim()) return;
    setInputValue("");
    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ content: inputValue, session_id: sessionId, type: "user" }]);
      if (error) {
        throw error;
      }

    // Send to the middleware
    const data = await fetch(`/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: InputProcessor(inputValue), sessionId }),
    });

    console.log(data);

    } catch (err) {
      console.error("Error in handleSubmit:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-4">
      <input
        type="text"
        className="rounded-2xl h-15 my-3 py-5 px-4 block w-full border border-gray-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white text-gray-400 dark:focus:ring-gray-600"
        placeholder="Enter your message here"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
        disabled={isLoading}
      />
    </div>
  );
};

export default ChatBox;
