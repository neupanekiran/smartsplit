"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import { Send, Mic, Play, User, Bot } from "lucide-react";
import CircularWaveAnimation from './CircularAnimation';

interface Message {
    text: string;
    sender: "user" | "bot";
    timestamp: string;
    status?: string;
    isSpeaking?: boolean;
    isLoading?: boolean;
}

let BOT_NAME = "ChatBot"; // More friendly bot name
let USER_NAME = "You";

const Chatbot: React.FC = memo(() => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [theme, setTheme] = useState<"nord" | "dim">("nord");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [audioQueue, setAudioQueue] = useState<{ text: string; playing: boolean }[]>([]);
    const [isBotSpeaking, setIsBotSpeaking] = useState(false);
    const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as "nord" | "dim" | null;
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute('data-theme', storedTheme);
        } else {
            setTheme('nord');
            document.documentElement.setAttribute('data-theme', 'nord');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "nord" ? "dim" : "nord";
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                setIsSpeechModalOpen(false);
            };

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsSpeechModalOpen(false);
            };

            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
                setIsSpeechModalOpen(false);
            };
        } else {
            console.warn("Speech recognition not supported in this browser.");
        }
    }, []);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newUserMessage: Message = { text: input, sender: "user", timestamp, status: "Sent" };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsBotTyping(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            const botMessageText = data.reply || "Error getting response";
            const botMessage: Message = {
                text: botMessageText,
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isLoading: false,
                status: "Delivered"
            };

            setMessages(prevMessages => [...prevMessages, botMessage]);
            setIsBotTyping(false);
            setAudioQueue(prevQueue => [...prevQueue, { text: botMessageText, playing: false }]);

        } catch (error) {
            console.error("Chat error:", error);
            const errorBotMessage: Message = {
                text: "Bot is unavailable. Please try again later.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: "Error"
            };
            setMessages(prevMessages => [...prevMessages, errorBotMessage]);
            setIsBotTyping(false);
            setAudioQueue(prevQueue => [...prevQueue, { text: "Bot is unavailable", playing: false }]);
        }
    };


    const playAudio = (text: string) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";

        utterance.onstart = () => {
            setIsBotSpeaking(true);
            setMessages(currentMessages => {
                return currentMessages.map(msg =>
                    msg.text === text && msg.sender === 'bot' ? { ...msg, isSpeaking: true } : msg
                );
            });
        };

        utterance.onend = () => {
            setIsBotSpeaking(false);
            setMessages(currentMessages => {
                return currentMessages.map(msg =>
                    msg.text === text && msg.sender === 'bot' ? { ...msg, isSpeaking: false } : msg
                );
            });
        };
        synth.speak(utterance);
    };

    const startListening = () => {
        setIsSpeechModalOpen(true);
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        } else if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setIsSpeechModalOpen(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="h-screen relative bg-base-100" > {/* Overall background color from theme */}
            <div className="navbar bg-base-100 shadow-md sticky top-0 z-10"> {/* Sticky navbar */}
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl" href="#">{BOT_NAME}</a>
                </div>
                <div className="flex-none">
                    <button className="btn btn-square btn-ghost" onClick={toggleTheme} aria-label="Toggle theme"> {/* Accessibility */}
                        {theme === "nord" ? (
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  >
                            <path
                              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                          </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.22 4.22l1.42 1.42" /><path d="M18.36 18.36l1.42 1.42" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M4.22 19.78l1.42-1.42" /><path d="M18.36 5.64l1.42-1.42" /></svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="chat-window flex flex-col h-[calc(100vh-theme(spacing.24))] px-6 py-4 bg-base-200 overflow-y-auto space-y-4 md:space-y-6"  style={{ maxHeight: 'calc(100vh - 120px)' }}> {/* Adjusted height, padding, spacing, max-height */}
                {messages.map((msg, index) => (
                    <div key={index} className={`chat ${msg.sender === "bot" ? "chat-start" : "chat-end"}`}>
                        <div className="chat-image avatar">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-base-300 px-3 py-3 text-base-content"> {/* Increased avatar size on md screens */}
                                {msg.sender === "bot" ? <Bot size={20}  /> : <User size={20} />} {/* Slightly larger icons */}
                            </div>
                        </div>
                        <div className="chat-header">
                            <div className="font-semibold">{msg.sender === "bot" ? BOT_NAME : USER_NAME}</div> {/* Bold name */}
                            <time className="text-xs opacity-50 ml-2">{msg.timestamp}</time> {/* Adjusted timestamp spacing */}
                        </div>
                        <div className={`chat-bubble text-lg md:text-xl ${msg.sender === "user" ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content'} rounded-xl md:rounded-2xl py-2 px-4 md:py-3 md:px-5`}> {/* Larger text, adjusted bubble padding and rounded corners */}
                            {msg.text}
                            {msg.sender === "bot" && <button onClick={() => playAudio(msg.text)} className="ml-2 btn btn-xs btn-circle">
                                <Play size={16} />
                            </button>}
                        </div>
                    </div>
                ))}
                {isBotTyping && (
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 h-10 md:w-12 md:h-12 px-3 py-3 rounded-full flex items-center justify-center bg-base-300 text-base-content">
                                <Bot size={20} />
                            </div>
                        </div>
                        <div className="chat-header">
                            <div className="font-semibold">{BOT_NAME}</div>
                        </div>
                        <div className="chat-bubble bg-base-300 text-base-content rounded-xl md:rounded-2xl py-2 px-4 md:py-3 md:px-5"> {/* Consistent bot bubble style */}
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef}></div>
            </div>

            <div className="chat-footer p-4 bg-base-100 shadow-md flex items-center justify-center  space-x-2 md:space-x-4 sticky bottom-0 z-10"> {/* Sticky footer, consistent spacing */}
                <button
                    onClick={startListening}
                    className={`btn btn-circle btn-ghost ${isListening ? 'bg-blue-200' : ''}`}
                    aria-label="Start speech to text"
                >
                    <Mic size={24} /> {/* Slightly larger mic icon */}
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="input input-bordered input-primary flex-1 max-w-xl md:max-w-3xl lg:max-w-4xl" /* Wider input on larger screens */
                    placeholder="Type a message..."
                    aria-label="Enter message"
                    onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
                />
                <button onClick={sendMessage} className="btn btn-primary btn-circle" aria-label="Send message">
                    <Send size={24} /> {/* Slightly larger send icon */}
                </button>
            </div>

            {isSpeechModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-base-100 p-10 rounded-3xl shadow-xl flex flex-col items-center space-y-6"> {/* Larger modal padding and rounded corners */}
                        <div className="text-5xl md:text-6xl"><Mic size={72} /></div> {/* Even larger mic icon in modal */}
                        <div className="relative w-28 h-28 md:w-32 md:h-32"> {/* Larger wave animation container */}
                            <CircularWaveAnimation />
                        </div>
                        <p className="text-lg md:text-xl font-semibold text-center">Speak now...</p> {/* Centered and styled text */}
                        <button
                            onClick={() => { recognitionRef.current?.stop(); setIsSpeechModalOpen(false); }}
                            className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3" /* Adjusted close button position */
                            aria-label="Close speech modal"
                        >✕</button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Chatbot;