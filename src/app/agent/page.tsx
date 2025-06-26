"use client";
import React, { useState, useRef } from "react";
import { FaPaperclip, FaArrowUp } from "react-icons/fa";

interface ChatMessage {
  role: "user" | "agent";
  content: string;
}

export default function Agent() {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userPrompt = input.trim();
    setChat((prev) => [...prev, { role: "user", content: userPrompt }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        const names = data.topFreelancers.map((f: any) => f.name).join(", ");
        setChat((prev) => [
          ...prev,
          {
            role: "agent",
            content: `Top 3 freelancers for your request: ${names}`,
          },
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          { role: "agent", content: "Sorry, I couldn't find top freelancers right now." },
        ]);
      }
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "agent", content: "Sorry, something went wrong." },
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-2xl flex flex-col">
        <div className="bg-gray-800 rounded-t-2xl p-6 min-h-[220px] flex flex-col items-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2 text-center">Hi, I'm CryptoTasks Scout.</div>
          <div className="text-lg text-gray-200 mb-8 text-center">Ask Scout to find the best freelancers for your needs.</div>
          <div className="w-full flex flex-col gap-4 mt-4">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`w-fit max-w-[90%] px-4 py-2 rounded-lg text-white ${
                  msg.role === "user"
                    ? "bg-cyan-700 self-end"
                    : "bg-gray-700 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="w-fit max-w-[90%] px-4 py-2 rounded-lg bg-gray-700 text-white self-start opacity-70">
                Scout is thinking...
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-800 rounded-b-2xl p-3 flex flex-col">
          <div className="flex items-center w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your request for Scout..."
              className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-3 outline-none placeholder-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
            />
            <button
              className="ml-2 p-3 text-gray-300 hover:text-cyan-400"
              tabIndex={-1}
              disabled={loading}
            >
              <FaPaperclip size={20} />
            </button>
            <button
              className="ml-2 p-3 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white"
              onClick={handleSend}
              disabled={loading}
            >
              <FaArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 