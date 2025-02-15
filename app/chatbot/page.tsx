'use client'
import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Simulate chatbot response
    setTimeout(() => {
      const botResponse = "This is a bot response!";
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white p-4 shadow-md text-lg font-semibold">Chatbot</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="flex items-center p-4 bg-white shadow-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-full ml-2">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
