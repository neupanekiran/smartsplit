"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, Play } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [audioQueue, setAudioQueue] = useState<{ text: string; playing: boolean }[]>([]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
    }
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages: Message[] = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = data.reply || "Error getting response";
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
      setAudioQueue([...audioQueue, { text: botMessage, playing: false }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([...newMessages, { text: "Bot is unavailable", sender: "bot" }]);
      setAudioQueue([...audioQueue, { text: "Bot is unavailable", playing: false }]);
    }
  };

  const playAudio = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white p-4 shadow-md text-lg font-semibold">Chatbot</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"}`}>
            {msg.text}
            {msg.sender === "bot" && (
              <button onClick={() => playAudio(msg.text)} className="ml-2 text-blue-500">
                <Play size={16} />
              </button>
            )}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="flex items-center p-4 bg-white shadow-md">
        <button onClick={startListening} className="p-2 bg-gray-300 text-black rounded-full mr-2">
          <Mic size={20} />
        </button>
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
