"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaPaperclip, FaArrowUp, FaStar } from "react-icons/fa";
import { freelancers as allFreelancers } from "../freelancers/data";
import Navbar from "../components/Navbar";
import { useAccount } from "wagmi";
import ClientProviders from "../components/ClientProviders";

interface ChatMessage {
  role: "user" | "agent" | "cards";
  content?: string;
  freelancers?: any[];
}

export default function Agent() {
  const { address: clientWallet, isConnected } = useAccount();
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
  const [pendingProposal, setPendingProposal] = useState<{ details: string, freelancerName: string, freelancerWallet?: string } | null>(null);

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
    const names: string[] = [];
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

    // If collecting project details
    if (pendingProposal && !pendingProposal.details) {
      // The user just entered project details
      setPendingProposal(prev => prev ? { ...prev, details: userPrompt } : null);
      if (pendingProposal && pendingProposal.freelancerWallet) {
        // Send proposal automatically
        await fetch("/api/send-proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: clientWallet,
            to: pendingProposal.freelancerWallet,
            text: `Project Proposal: ${userPrompt}\n\n[Client Wallet: ${clientWallet}]`,
          }),
        });
        setChat(prev => [
          ...prev,
          { role: "agent", content: `Project proposal sent to wallet ${pendingProposal.freelancerWallet}!` },
        ]);
        setPendingProposal(null);
        setLoading(false);
        inputRef.current?.focus();
        return;
      }
    }

    // Detect 'send project proposal to @username' or 'send project invitation to @username' or 'send project invitation to name'
    const proposalMatch = userPrompt.match(/send project (proposal|invitation) to @?(\w+)/i);
    if (proposalMatch) {
      const usernameOrName = proposalMatch[2].toLowerCase();
      let freelancer = allFreelancers.find(f => f.username.toLowerCase() === usernameOrName);
      if (!freelancer) {
        freelancer = allFreelancers.find(f => f.name.toLowerCase().split(' ')[0] === usernameOrName);
      }
      if (freelancer && pendingProposal && pendingProposal.details) {
        // Send proposal automatically using freelancer's wallet address
        await fetch("/api/send-proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: clientWallet,
            to: freelancer.wallet,
            text: `Project Proposal: ${pendingProposal.details}\n\n[Client Wallet: ${clientWallet}]`,
          }),
        });
        setChat(prev => [
          ...prev,
          { role: "agent", content: `Project proposal sent to wallet ${freelancer.wallet}!` },
        ]);
        setPendingProposal(null);
        setLoading(false);
        inputRef.current?.focus();
        return;
      }
      // If project details are not yet collected, store freelancer info and prompt for details
      if (freelancer && (!pendingProposal || !pendingProposal.details)) {
        setPendingProposal({ details: "", freelancerName: freelancer.name, freelancerWallet: freelancer.wallet });
        setChat(prev => [
          ...prev,
          { role: "agent", content: `Please provide the project details for ${freelancer.name}.` },
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
    <>
      <style jsx global>{`
        body {
          background: #000000;
          min-height: 100vh;
        }
        
        .agent-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #111111 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }

        .chat-interface {
          width: 100%;
          max-width: 1000px;
          display: flex;
          flex-direction: column;
          height: 85vh;
          position: relative;
        }

        .chat-header {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px 20px 0 0;
          padding: 1.5rem 2rem;
          text-align: center;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .scout-title {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #00f5ff 0%, #4a90e2 25%, #8b45ff 75%, #ff0080 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .scout-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          font-weight: 500;
        }

        .chat-messages {
          flex: 1;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.05) 0%, 
            rgba(255, 255, 255, 0.02) 100%);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 400px;
        }

        .message-bubble {
          max-width: 80%;
          padding: 1rem 1.5rem;
          border-radius: 20px;
          font-size: 1rem;
          line-height: 1.5;
          position: relative;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .user-message {
          background: linear-gradient(135deg, #00f5ff 0%, #0099cc 100%);
          color: #ffffff;
          align-self: flex-end;
          box-shadow: 0 4px 15px rgba(0, 245, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .agent-message {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.08) 100%);
          color: rgba(255, 255, 255, 0.95);
          align-self: flex-start;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .loading-message {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          align-self: flex-start;
          opacity: 0.8;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.5; }
        }

        .chat-input-container {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0 0 20px 20px;
          padding: 1.25rem;
          box-shadow: 
            0 -8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }

        .input-wrapper:focus-within {
          border-color: rgba(0, 245, 255, 0.5);
          box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
        }

        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          padding: 0.5rem;
        }

        .chat-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .input-button {
          padding: 0.75rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .attach-button {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
        }

        .attach-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(0, 245, 255, 0.9);
          transform: scale(1.05);
        }

        .send-button {
          background: linear-gradient(135deg, #00f5ff 0%, #0099cc 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 245, 255, 0.3);
        }

        .send-button:hover {
          background: linear-gradient(135deg, #33f7ff 0%, #00ccff 100%);
          box-shadow: 0 6px 20px rgba(0, 245, 255, 0.4);
          transform: translateY(-2px);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .floating-chat-button {
          position: fixed;
          right: 2rem;
          bottom: 2rem;
          z-index: 50;
          background: linear-gradient(135deg, #00f5ff 0%, #0099cc 100%);
          color: #ffffff;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 
            0 8px 25px rgba(0, 245, 255, 0.4),
            0 0 20px rgba(0, 245, 255, 0.3);
          transition: all 0.3s ease;
        }

        .floating-chat-button:hover {
          transform: scale(1.1);
          box-shadow: 
            0 12px 35px rgba(0, 245, 255, 0.5),
            0 0 30px rgba(0, 245, 255, 0.4);
        }

        .private-chat-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 400px;
          background: linear-gradient(135deg, 
            rgba(0, 0, 0, 0.95) 0%, 
            rgba(20, 20, 20, 0.9) 100%);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 50;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.5);
        }

        .private-chat-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .private-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .private-message {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          max-width: 80%;
          word-break: break-word;
        }

        .private-message.client {
          background: linear-gradient(135deg, #00f5ff 0%, #0099cc 100%);
          color: #ffffff;
          align-self: flex-end;
        }

        .private-message.agent {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          align-self: flex-start;
        }

        .private-chat-input {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 0.75rem;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 40;
        }

        .modal-content {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          width: 400px;
          max-width: 90vw;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 768px) {
          .agent-container {
            padding: 1rem;
          }
          
          .chat-interface {
            height: 90vh;
            max-width: 100%;
          }
          
          .scout-title {
            font-size: 1.5rem;
          }
          
          .scout-subtitle {
            font-size: 0.9rem;
          }
          
          .chat-header {
            padding: 1rem 1.5rem;
          }
          
          .private-chat-panel {
            width: 100vw;
          }
        }
      `}</style>
      
      <Navbar />
      <div className="agent-container">
        {/* Floating button to open last private chat */}
        {Object.keys(privateChats).length > 0 && privateChatFreelancer && (
          <button
            className="floating-chat-button"
            onClick={() => setPrivateChatOpen(true)}
            title={`Open chat with @${privateChatFreelancer.username}`}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 3C7.03 3 3 6.82 3 11c0 1.61.62 3.09 1.7 4.36-.13.5-.46 1.7-.7 2.64-.09.33.23.63.56.54.96-.25 2.19-.6 2.7-.74C8.91 18.38 10.41 19 12 19c4.97 0 9-3.82 9-8s-4.03-8-9-8Zm0 14c-1.41 0-2.77-.41-3.91-1.18a1 1 0 0 0-.8-.13c-.36.1-1.01.28-1.7.46.18-.7.36-1.36.45-1.7a1 1 0 0 0-.13-.8C4.41 13.77 4 12.41 4 11c0-3.31 3.58-6 8-6s8 2.69 8 6-3.58 6-8 6Z"/>
            </svg>
          </button>
        )}

        {/* Private Chat Side Panel */}
        {privateChatOpen && privateChatFreelancer && (
          <div className="private-chat-panel">
            <div className="private-chat-header">
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#00f5ff' }}>
                  @{privateChatFreelancer.username}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                  {privateChatFreelancer.name}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Wallet: {privateChatFreelancer.wallet}
                </div>
              </div>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
                onClick={() => setPrivateChatOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="private-chat-messages">
              {(privateChats[privateChatFreelancer.username] || []).map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`private-message ${msg.from === "client" ? "client" : "agent"}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            
            <div className="private-chat-input">
              <input
                ref={privateInputRef}
                type="text"
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none'
                }}
                value={privateInput}
                onChange={e => setPrivateInput(e.target.value)}
                onKeyDown={handlePrivateInputKeyDown}
              />
              <button
                style={{
                  background: 'linear-gradient(135deg, #00f5ff 0%, #0099cc 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  color: '#ffffff',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={handleSendPrivateMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Modal for freelancer profile */}
        {showModal && selectedFreelancer && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00f5ff', marginBottom: '0.5rem' }}>
                @{selectedFreelancer.username}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Wallet: {selectedFreelancer.wallet}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {selectedFreelancer.desc}
              </div>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer'
                }}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="chat-interface">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="scout-title">Hi, I'm Scout 🤖</div>
            <div className="scout-subtitle">Ask Scout to find the best freelancers for your needs</div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {chat.map((msg, i) => {
              if (msg.role === "cards") {
                const scoutedFreelancers = msg.freelancers || [];
                return (
                  <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', margin: '1rem 0' }}>
                    {scoutedFreelancers.map((f, j) => (
                      <div
                        key={j}
                        style={{
                          position: 'relative',
                          width: '280px',
                          borderRadius: '24px',
                          padding: '3px',
                          background: 'linear-gradient(135deg, #00f0ff, #a020f0, #ff00ea)',
                          boxShadow: '0 0 32px 4px #00f0ff33, 0 0 32px 4px #a020f033, 0 0 32px 4px #ff00ea33',
                        }}
                      >
                        <div style={{
                          borderRadius: '24px',
                          background: '#11131a',
                          padding: '1.5rem',
                          minHeight: '320px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <div style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                            {f.name} <span style={{ color: '#00f5ff', cursor: 'pointer' }} onClick={() => handleUsernameClick(f)}>@{f.username}</span>
                          </div>
                          <div style={{ color: '#00f5ff', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>{f.role}</div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem', lineHeight: 1.4 }}>
                            {f.desc}
                          </div>
                          
                          <div style={{ width: '100%', marginTop: 'auto' }}>
                            <div style={{ color: '#00f5ff', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Fun Fact</div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>
                              {getFunFact(f)}
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                              <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{f.projects}</span>
                              <span style={{ opacity: 0.7, color: 'rgba(255, 255, 255, 0.7)' }}>Projects</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold', color: '#ffffff' }}>
                                {f.stars} <FaStar style={{ color: '#ffd700' }} />
                              </span>
                              <span style={{ opacity: 0.7, color: 'rgba(255, 255, 255, 0.7)' }}>Stars</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                              <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{f.perfection}%</span>
                              <span style={{ opacity: 0.7, color: 'rgba(255, 255, 255, 0.7)' }}>Perfect</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              } else if (msg.role === "agent" || msg.role === "user") {
                const isUser = msg.role === "user";
                return (
                  <div key={i} className={`message-bubble ${isUser ? "user-message" : "agent-message"}`}>
                    {msg.content}
                  </div>
                );
              }
              return null;
            })}
            
            {loading && (
              <div className="message-bubble loading-message">
                Scout is thinking...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="chat-input-container">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your request for Scout..."
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={loading}
              />
              <button
                className="input-button attach-button"
                tabIndex={-1}
                disabled={loading}
              >
                <FaPaperclip size={18} />
              </button>
              <button
                className="input-button send-button"
                onClick={handleSend}
                disabled={loading}
              >
                <FaArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AgentWithProviders() {
  return (
    <ClientProviders>
      <Agent />
    </ClientProviders>
  );
}