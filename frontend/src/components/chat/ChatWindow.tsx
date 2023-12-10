'use client'


import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import ParseMessage from "./ParseMessage";
import ChatBox from "./ChatBox";
import Header from "./Header";

const ChatWindow = () => {
  const supabase = createClient(
    "https://ydlodplhsscvfhxfgiha.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbG9kcGxoc3NjdmZoeGZnaWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIwNjM3MjIsImV4cCI6MjAxNzYzOTcyMn0.Y41Q9wTAHmPf9sH4DAUL56Z_O1RneJmH_aZPHGH_-DY",
  );
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const sessionId = window.sessionStorage.getItem("sessionId");
    async function getMessages() {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("content, type, session_id")
          .order("created_at", { ascending: false });
        if (data === null) {
          setMessages([]);
        } else {
          setMessages(data.filter((msg) => msg.session_id === sessionId));
        }
      } catch (error) {
        console.log(error);
      }
    }
    getMessages();
  }, []);

  useEffect(() => {
    const sessionId = window.sessionStorage.getItem("sessionId");
    const channel = supabase
      .channel("realtime posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prevMessages) => {
            // Check if message with this ID already exists and the session ID matches
            if (
              prevMessages.some((msg) => msg.id === payload.new.id) ||
              payload.new.session_id !== sessionId
            ) {
              return prevMessages; // Return the unchanged state
            }
            // Otherwise, append the new message
            return [payload.new, ...prevMessages];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex flex-col justify-between min-h-screen px-[300px] bg-[#faf9f9]">
      <div className="flex flex-col bg-white gap-3.5">
        <Header />
        <div className="flex flex-col-reverse flex-grow p-5 bg-white overflow-y-scroll h-[78vh]">
          {messages?.map(({ type, content }) =>
            (type === "bot" && <BotMessage message={content} />) ||
            (type === "user" && <UserMessage message={content} />) ||
            (type === "to_parse" && <ParseMessage message={content} />),
          )}
        </div>
      </div>
      <ChatBox />
    </div>
  );
};

export default ChatWindow;
