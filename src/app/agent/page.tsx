"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaPaperclip, FaArrowUp, FaStar } from "react-icons/fa";
import { freelancers as allFreelancers } from "../freelancers/page";

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
  const [selectedFreelancer, setSelectedFreelancer] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [privateChats, setPrivateChats] = useState<{ [username: string]: {from: string, text: string}[] }>({});
  const [privateChatOpen, setPrivateChatOpen] = useState(false);
  const [privateChatFreelancer, setPrivateChatFreelancer] = useState<any | null>(null);
  const privateInputRef = useRef<HTMLInputElement>(null);
  const [privateInput, setPrivateInput] = useState("");

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

    // Detect 'send project proposal to @username' or 'send project invitation to @username' or 'send project invitation to name'
    const proposalMatch = userPrompt.match(/send project (proposal|invitation) to @?(\w+)/i);
    if (proposalMatch) {
      const usernameOrName = proposalMatch[2].toLowerCase();
      // Try to match by username first
      let freelancer = allFreelancers.find(f => f.username.toLowerCase() === usernameOrName);
      // If not found, try to match by first name (case-insensitive)
      if (!freelancer) {
        freelancer = allFreelancers.find(f => f.name.toLowerCase().split(' ')[0] === usernameOrName);
      }
      if (freelancer) {
        // Open private chat and send proposal
        openPrivateChat(freelancer, true); // true = force proposal message
        setChat(prev => [
          ...prev,
          { role: "agent", content: `Project proposal sent to @${freelancer.username}!` },
        ]);
        setLoading(false);
        inputRef.current?.focus();
        return;
      }
    }

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

  function handleUsernameClick(freelancer: any) {
    setSelectedFreelancer(freelancer);
    setShowModal(true);
  }

  function openPrivateChat(freelancer: any, forceProposal = false) {
    setPrivateChatFreelancer(freelancer);
    setPrivateChatOpen(true);
    setPrivateChats(prev => {
      const alreadyHasChat = prev[freelancer.username] && prev[freelancer.username].length > 0;
      if (alreadyHasChat && !forceProposal) return prev;
      return {
        ...prev,
        [freelancer.username]: [
          { from: "agent", text: `Hi @${freelancer.username}, I have a project proposal for you! Please review the details and let me know if you're interested.` }
        ]
      };
    });
    setTimeout(() => privateInputRef.current?.focus(), 100);
    setShowModal(false);
  }

  function handleMessageClick(freelancer: any) {
    openPrivateChat(freelancer);
  }

  function handleSendPrivateMessage() {
    if (!privateInput.trim() || !privateChatFreelancer) return;
    setPrivateChats(prev => ({
      ...prev,
      [privateChatFreelancer.username]: [
        ...(prev[privateChatFreelancer.username] || []),
        { from: "client", text: privateInput.trim() }
      ]
    }));
    setPrivateInput("");
    setTimeout(() => privateInputRef.current?.focus(), 100);
  }

  function handlePrivateInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSendPrivateMessage();
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      {/* Floating button to open last private chat */}
      {Object.keys(privateChats).length > 0 && privateChatFreelancer && (
        <button
          className="fixed right-6 bottom-6 z-50 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center"
          style={{ boxShadow: '0 4px 16px #00f0ff55' }}
          onClick={() => setPrivateChatOpen(true)}
          title={`Open chat with @${privateChatFreelancer.username}`}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3C7.03 3 3 6.82 3 11c0 1.61.62 3.09 1.7 4.36-.13.5-.46 1.7-.7 2.64-.09.33.23.63.56.54.96-.25 2.19-.6 2.7-.74C8.91 18.38 10.41 19 12 19c4.97 0 9-3.82 9-8s-4.03-8-9-8Zm0 14c-1.41 0-2.77-.41-3.91-1.18a1 1 0 0 0-.8-.13c-.36.1-1.01.28-1.7.46.18-.7.36-1.36.45-1.7a1 1 0 0 0-.13-.8C4.41 13.77 4 12.41 4 11c0-3.31 3.58-6 8-6s8 2.69 8 6-3.58 6-8 6Z"/></svg>
        </button>
      )}
      {/* Private Chat Side Panel */}
      {privateChatOpen && privateChatFreelancer && (
        <div className="fixed top-0 right-0 h-full w-[400px] bg-gray-800 shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div>
              <div className="text-xl font-bold text-cyan-400">@{privateChatFreelancer.username}</div>
              <div className="text-gray-200 text-sm">{privateChatFreelancer.name}</div>
            </div>
            <button className="text-gray-400 hover:text-white text-2xl" onClick={() => setPrivateChatOpen(false)}>&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {(privateChats[privateChatFreelancer.username] || []).map((msg, idx) => (
              <div key={idx} className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.from === "client" ? "bg-cyan-700 self-end text-white" : "bg-gray-700 self-start text-white"}`}>{msg.text}</div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700 flex items-center">
            <input
              ref={privateInputRef}
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 outline-none placeholder-gray-400"
              value={privateInput}
              onChange={e => setPrivateInput(e.target.value)}
              onKeyDown={handlePrivateInputKeyDown}
            />
            <button
              className="ml-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white"
              onClick={handleSendPrivateMessage}
            >Send</button>
          </div>
        </div>
      )}
      {/* Modal for freelancer profile */}
      {showModal && selectedFreelancer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40">
          <div className="bg-gray-800 rounded-xl p-6 w-96">
            <div className="text-xl font-bold text-cyan-400 mb-2">@{selectedFreelancer.username}</div>
            <div className="text-gray-200 mb-4">{selectedFreelancer.desc}</div>
            <button
              className="ml-4 text-gray-400 hover:text-white"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
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
                          <div className="text-white text-lg font-bold mb-1 text-center mt-2">
                            {f.name} <span className="text-cyan-400 cursor-pointer" onClick={() => handleUsernameClick(f)}>@{f.username}</span>
                          </div>
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