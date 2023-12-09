// ChatBox.jsx
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const ChatBox = () => {
  const supabase = createClient(
    "https://ydlodplhsscvfhxfgiha.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbG9kcGxoc3NjdmZoeGZnaWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIwNjM3MjIsImV4cCI6MjAxNzYzOTcyMn0.Y41Q9wTAHmPf9sH4DAUL56Z_O1RneJmH_aZPHGH_-DY"
  );
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sessionId = window.sessionStorage.getItem("sessionId");
    if (!inputValue.trim()) return;
    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ content: inputValue, session_id: sessionId, type: "user" }]);
      if (error) {
        throw error;
      }

      console.log('message sent')

      // Send to the middleware
      const data = await fetch(`/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: inputValue, sessionId }),
      });

      console.log(data);
    } catch (err) {
      console.error("Error in handleSubmit:", err.message);
    } finally {
      setInputValue("");
    }
  };

  return (
    <div className="mb-4 mx-4">
      <input
        type="text"
        className="rounded-2xl h-15 py-2 px-3 block w-full border border-gray-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
        placeholder="Enter your message here"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
      />
    </div>
  );
};

export default ChatBox;
