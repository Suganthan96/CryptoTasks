"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaPaperclip, FaArrowUp, FaStar } from "react-icons/fa";
import { freelancers as allFreelancers } from "../freelancers";

interface ChatMessage {
  role: "user" | "agent" | "cards";
  content?: string;
  freelancers?: any[];
}

export default function Agent() {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [scoutedFreelancers, setScoutedFreelancers] = useState<any[]>([]);

  useEffect(() => {
    setChat([
      {
        role: "agent",
        content: "Hi! I'm Scout, your AI assistant. How can I help you today? Want me to scout any freelancer for you?",
      },
    ]);
    setScoutedFreelancers([]);
  }, []);

  const extractFreelancerNames = (message: string) => {
    // Try to extract names from the agent's message (bolded or capitalized names)
    const names = [];
    const regex = /\*\*(.*?)\*\*|([A-Z][a-z]+ [A-Z][a-z]+)/g;
    let match;
    while ((match = regex.exec(message))) {
      if (match[1]) names.push(match[1]);
      else if (match[2]) names.push(match[2]);
    }
    // Remove duplicates
    return [...new Set(names)];
  };

  // Helper to detect if a message is a scouting request
  function isScoutingRequest(text: string) {
    const scoutKeywords = [
      "find", "top", "developer", "dev", "engineer", "designer", "freelancer", "data scientist", "web3", "backend", "frontend", "ai", "blockchain", "cloud", "qa", "product manager", "content writer", "security", "devops"
    ];
    return scoutKeywords.some((kw) => text.toLowerCase().includes(kw));
  }

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
        if (isScoutingRequest(userPrompt)) {
          const names = extractFreelancerNames(data.agentMessage);
          const matched = allFreelancers.filter(f => names.includes(f.name));
          // Short summary for chat (2 lines per freelancer)
          const summary = matched.map(f => `• ${f.name} (${f.role}): ${f.desc.split(".")[0]}. Projects: ${f.projects}, Stars: ${f.stars}`).join("\n");
          setChat((prev) => [
            ...prev,
            {
              role: "agent",
              content: `Here are the top matches:\n${summary}`,
            },
            {
              role: "cards",
              freelancers: matched,
            },
          ]);
        } else {
          setChat((prev) => [
            ...prev,
            {
              role: "agent",
              content: data.agentMessage,
            },
          ]);
        }
      } else {
        setChat((prev) => [
          ...prev,
          {
            role: "agent",
            content: "Sorry, I couldn't process your request right now. Please try again later.",
          },
        ]);
      }
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Sorry, something went wrong.",
        },
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

  // Generate a fun fact for a freelancer
  function getFunFact(f: any) {
    // Simple fun fact logic: pick a highlight from their description or stats
    if (f.projects >= 25) return `Has completed over ${f.projects} projects!`;
    if (f.stars >= 4.9) return `Rated among the top with ${f.stars} stars!`;
    if (f.perfection >= 99) return `Nearly perfect with a ${f.perfection}% score!`;
    if (f.desc.toLowerCase().includes("blockchain")) return "Blockchain enthusiast!";
    if (f.desc.toLowerCase().includes("ai")) return "Loves working with AI!";
    if (f.desc.toLowerCase().includes("mobile")) return "Expert in mobile app development!";
    if (f.desc.toLowerCase().includes("cloud")) return "Cloud infrastructure specialist!";
    return f.desc.split(".")[0] + ".";
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-2xl flex flex-col">
        <div className="bg-gray-800 rounded-t-2xl p-6 min-h-[220px] flex flex-col items-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2 text-center">Hi, I'm CryptoTasks Scout.</div>
          <div className="text-lg text-gray-200 mb-8 text-center">Ask Scout to find the best freelancers for your needs.</div>
          <div className="w-full flex flex-col gap-4 mt-4">
            {chat.map((msg, i) => {
              if (msg.role === "cards") {
                const scoutedFreelancers = msg.freelancers || [];
                return (
                  <div key={i} className="w-full flex flex-wrap gap-6 mt-6 justify-center">
                    {scoutedFreelancers.map((f, j) => (
                      <div
                        key={j}
                        className="relative w-72 rounded-3xl p-[3px]"
                        style={{
                          background:
                            "linear-gradient(135deg, #00f0ff, #a020f0, #ff00ea)",
                          boxShadow:
                            "0 0 32px 4px #00f0ff33, 0 0 32px 4px #a020f033, 0 0 32px 4px #ff00ea33",
                        }}
                      >
                        <div className="rounded-3xl bg-[#11131a] flex flex-col items-center p-6 min-h-[340px]">
                          <div className="text-white text-lg font-bold mb-1 text-center mt-2">{f.name}</div>
                          <div className="text-cyan-200 text-sm mb-1 text-center">{f.role}</div>
                          <ul className="text-gray-300 text-xs mb-2 text-left list-disc pl-5" style={{ minHeight: "2.5em" }}>
                            <li><span className="font-semibold">Role:</span> {f.role}</li>
                            <li><span className="font-semibold">Projects:</span> {f.projects}</li>
                            <li><span className="font-semibold">Stars:</span> {f.stars}</li>
                            <li><span className="font-semibold">Perfection:</span> {f.perfection}%</li>
                            <li><span className="font-semibold">About:</span> {f.desc}</li>
                          </ul>
                          <div className="w-full mt-2">
                            <div className="text-cyan-400 font-semibold text-sm mb-1">Fun Fact</div>
                            <div className="text-gray-200 text-xs text-center">
                              {getFunFact(f)}
                            </div>
                          </div>
                          <div className="flex-1" />
                          <div className="flex justify-between w-full text-white text-sm">
                            <div className="flex flex-col items-center flex-1">
                              <span className="font-bold">{f.projects}</span>
                              <span className="opacity-70">Projects</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                              <span className="flex items-center font-bold gap-1">{f.stars} <FaStar className="text-yellow-400" /></span>
                              <span className="opacity-70">Stars</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                              <span className="font-bold">{f.perfection}%</span>
                              <span className="opacity-70">Perfection</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className={`w-fit max-w-[90%] px-4 py-2 rounded-lg text-white ${
                    msg.role === "user"
                      ? "bg-cyan-700 self-end"
                      : "bg-gray-700 self-start"
                  }`}
                >
                  {msg.content?.split("\n").map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              );
            })}
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