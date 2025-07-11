"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";
import { freelancers, Freelancer } from "../freelancers/data";

type Role = "client" | "freelancer";

interface Peer {
  address: string;
  role: Role;
  name: string;
}

interface ChatMessage {
  from: string;
  to: string;
  text: string;
  timestamp?: string | Date;
}

interface ChatWindowProps {
  user: Peer & { address: string };
  peer: Peer;
  chat: ChatMessage[];
  onSend: (msg: string) => void;
}

function ProposalMessage({ message, isFromUser }: {
  message: ChatMessage;
  isFromUser: boolean;
}) {
  const proposalText = message.text.replace("Project Proposal: ", "");
  
  return (
    <div className={`mb-6 flex ${isFromUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`max-w-[85%] rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl ${
        isFromUser 
          ? "bg-gradient-to-br from-cyan-600 to-cyan-700 shadow-cyan-500/20" 
          : "bg-gradient-to-br from-purple-600 to-purple-700 shadow-purple-500/20"
      }`}>
        <div className="flex items-center mb-3">
          <div className="flex items-center bg-yellow-500/20 rounded-full px-3 py-1">
            <span className="text-yellow-300 font-semibold text-sm">SCOUT AGENT</span>
          </div>
          <span className="ml-3 px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300 font-medium">
            AUTOMATED
          </span>
        </div>
        
        <div className="text-white">
          <p className="text-sm leading-relaxed font-medium">{proposalText}</p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/20">
          <span className="text-xs text-gray-200 opacity-75">
            Scout Agent • {new Date(message.timestamp || Date.now()).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function autoLinkExplorer(text: string) {
  const urlRegex = /(https?:\/\/devnet\.explorer\.moved\.network\/transaction\/0x[0-9a-fA-F]+)/g;
  const txHashRegex = /(0x[0-9a-fA-F]{64})/g;
  
  let parts: (string | React.JSX.Element)[] = text.split(urlRegex);
  parts = parts.flatMap((part, i) => {
    if (typeof part === "string" && urlRegex.test(part)) {
      return [
        <a 
          key={"explorer-"+i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline text-cyan-300 hover:text-cyan-200 transition-colors duration-200"
        >
          {part}
        </a>
      ];
    }
    if (typeof part !== "string") {
      return [part];
    }
    
    const subparts = part.split(txHashRegex);
    return subparts.map((sub: string, j: number) => {
      if (txHashRegex.test(sub)) {
        const url = `https://devnet.explorer.moved.network/transaction/${sub}`;
        return (
          <a 
            key={"txhash-"+i+"-"+j} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline text-cyan-300 hover:text-cyan-200 transition-colors duration-200"
          >
            {sub}
          </a>
        );
      }
      return sub;
    });
  });
  return parts;
}

function ChatWindow({ user, peer, chat, onSend }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-md p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {peer.role === "freelancer" ? "💼" : "👤"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {peer.role === "freelancer" ? "Freelancer" : "Client"}
              </h3>
              <p className="text-gray-400 font-mono text-sm">{peer.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex flex-col h-[500px] lg:h-[600px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chat.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">💬</span>
                </div>
                <p className="text-gray-400 text-lg font-medium">Start the conversation!</p>
                <p className="text-gray-500 text-sm mt-2">Send your first message to begin chatting</p>
              </div>
            </div>
          ) : (
            chat.map((msg: ChatMessage, i: number) => {
              const isFromUser = msg.from === user.address;
              const isProposal = msg.text.startsWith("Project Proposal:");
              
              if (isProposal) {
                return (
                  <ProposalMessage
                    key={i}
                    message={msg}
                    isFromUser={isFromUser}
                  />
                );
              }
              
              return (
                <div key={i} className={`flex ${isFromUser ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                    isFromUser 
                      ? "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white shadow-cyan-500/20" 
                      : "bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-gray-500/20"
                  }`}>
                    <div className="text-sm leading-relaxed">
                      {autoLinkExplorer(msg.text)}
                    </div>
                    <div className="text-xs opacity-60 mt-2">
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-700 rounded-2xl px-5 py-3 max-w-[75%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-6 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                className="w-full bg-gray-800/80 text-gray-100 rounded-2xl px-6 py-4 outline-none placeholder-gray-400 border border-gray-700/50 focus:border-cyan-500/50 focus:bg-gray-800 transition-all duration-300 text-sm"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { 
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>
            <button
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChatBoxProps {
  role: Role;
}

const ChatBox = ({ role }: ChatBoxProps) => {
  const { isConnected, address } = useAccount();
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [firstMessage, setFirstMessage] = useState("");
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();

  const filteredFreelancers = search
    ? freelancers.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    : freelancers.slice(0, 5);

  // CLIENT: Set peer when a freelancer is selected
  useEffect(() => {
    if (role === "client") {
      if (selectedFreelancer && address && selectedFreelancer.wallet !== address) {
        if (!peer || peer.address !== selectedFreelancer.wallet) {
          setPeer({ address: selectedFreelancer.wallet, role: "freelancer", name: selectedFreelancer.name });
          setChat([]);
          setHasHistory(false);
          setFirstMessage("");
        }
      } else {
        if (peer !== null) {
          setPeer(null);
          setChat([]);
          setHasHistory(false);
          setFirstMessage("");
        }
      }
    }
  }, [selectedFreelancer, address, role, peer]);

  // FREELANCER: Set peer from first chat
  useEffect(() => {
    if (role === "freelancer" && address) {
      supabase
        .from('messages')
        .select('*')
        .or(`to.eq.${address},from.eq.${address}`)
        .order('timestamp', { ascending: true })
        .then(({ data }) => {
          const firstMsg = (data as ChatMessage[] || []).find(msg => msg.to === address && msg.from !== address);
          if (firstMsg) {
            setPeer({ address: firstMsg.from, role: "client", name: "Client" });
          }
        });
      setChat([]);
      setHasHistory(false);
      setFirstMessage("");
    }
  }, [role, address]);

  // Fetch chat history when peer changes
  useEffect(() => {
    if (!address || !peer) return;
    setLoadingChat(true);
    supabase
      .from('messages')
      .select('*')
      .or(`and(from.eq.${address},to.eq.${peer.address}),and(from.eq.${peer.address},to.eq.${address})`)
      .order('timestamp', { ascending: true })
      .then(({ data }) => {
        setChat((data as ChatMessage[]) || []);
        setHasHistory(!!(data && data.length));
        setLoadingChat(false);
      });
    
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: { new: ChatMessage }) => {
        const msg = payload.new;
        if (
          (msg.from === address && msg.to === peer.address) ||
          (msg.from === peer.address && msg.to === address)
        ) {
          setChat((c: ChatMessage[]) => [...c, msg]);
          setHasHistory(true);
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [address, peer]);

  function parseWorkDoneRelease(msg: string): number | null {
    const match = msg.trim().match(/^Work done release ([0-9.]+) eth$/i);
    if (match) {
      return parseFloat(match[1]);
    }
    return null;
  }

  if (!isConnected) return null;

  // FREELANCER VIEW
  if (role === "freelancer") {
    if (!peer) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-8 mx-auto">
              <span className="text-6xl">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Waiting for Client Messages</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              No client conversations found. Share your wallet address with clients or wait for them to initiate a chat.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 py-8">
        {/* Welcome Header */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-8 border border-gray-700/50">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Welcome, Freelancer!
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
                Connect with clients through automated Scout Agent proposals and real-time messaging.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">You</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Your Wallet</span>
                      <div className="text-cyan-300 font-mono text-sm break-all">{address}</div>
                    </div>
                  </div>
                  <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    Freelancer
                  </span>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">👤</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Client</span>
                      <div className="text-purple-300 font-mono text-sm break-all">{peer.address}</div>
                    </div>
                  </div>
                  <span className="inline-block bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                    Client
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <ChatWindow
          user={{ address: address as string, role: role as Role, name: "" }}
          peer={peer}
          chat={chat}
          onSend={async (msg: string) => {
            if (msg.trim()) {
              await supabase.from('messages').insert([
                { from: address, to: peer.address, text: msg }
              ]);
            }
          }}
        />
      </div>
    );
  }

  // CLIENT VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                className="w-full bg-gray-800/80 text-gray-100 rounded-2xl px-6 py-4 pl-12 outline-none placeholder-gray-400 border border-gray-700/50 focus:border-cyan-500/50 focus:bg-gray-800 transition-all duration-300"
                placeholder="Search freelancers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Mobile Dropdown */}
            <div className="block lg:hidden">
              <button
                className="w-full bg-gray-800/80 backdrop-blur-sm text-cyan-300 rounded-2xl px-6 py-4 text-left border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 flex items-center justify-between"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>{selectedFreelancer ? selectedFreelancer.name : "Select a freelancer to chat"}</span>
                <svg className={`w-5 h-5 transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDropdown && (
                <div className="mt-2 bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
                  {filteredFreelancers.map((f) => (
                    <div
                      key={f.wallet}
                      className="px-6 py-4 hover:bg-cyan-700/50 cursor-pointer text-white transition-colors duration-200 border-b border-gray-700/30 last:border-b-0"
                      onClick={() => { setSelectedFreelancer(f); setShowDropdown(false); }}
                    >
                      <div className="font-medium">{f.name}</div>
                      <div className="text-sm text-gray-400 font-mono mt-1">{f.wallet.slice(0, 20)}...</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-white">Freelancers</h2>
                <p className="text-gray-400 text-sm mt-1">Select someone to chat with</p>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {filteredFreelancers.map((f) => (
                  <div
                    key={f.wallet}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                      selectedFreelancer?.wallet === f.wallet
                        ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-200 hover:bg-gray-700/50"
                    }`}
                    onClick={() => setSelectedFreelancer(f)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{f.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{f.name}</div>
                        <div className="text-sm opacity-75 font-mono truncate">{f.wallet}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {!selectedFreelancer && (
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <span className="text-6xl">💬</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Start a Conversation</h2>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                  Select a freelancer from the sidebar to begin chatting and collaborating on projects.
                </p>
              </div>
            )}
            
            {selectedFreelancer && peer && (
              <>
                {loadingChat ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading conversation...</p>
                  </div>
                ) : (
                  <ChatWindow
                    user={{ address: address as string, role: role as Role, name: "" }}
                    peer={peer}
                    chat={chat}
                    onSend={async (msg: string) => {
                      if (!msg.trim()) return;
                      
                      if (role === "client") {
                        const amount = parseWorkDoneRelease(msg);
                        if (amount) {
                          await supabase.from('messages').insert([
                            { from: address, to: peer.address, text: msg }
                          ]);
                          
                          try {
                            const res = await fetch("/api/release-funds", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ from: address, to: peer.address, amount })
                            });
                            const data = await res.json();
                            
                            if (data.hash) {
                              await supabase.from('messages').insert([
                                { from: address, to: peer.address, text: `Funds sent! Tx Hash: ${data.hash}` }
                              ]);
                            } else {
                              await supabase.from('messages').insert([
                                { from: address, to: peer.address, text: `Fund release failed: ${data.error || 'Unknown error'}` }
                              ]);
                            }
                          } catch (err) {
                            await supabase.from('messages').insert([
                              { from: address, to: peer.address, text: `Fund release failed: ${err instanceof Error ? err.message : String(err)}` }
                            ]);
                          }
                          return;
                        }
                      }
                      
                      await supabase.from('messages').insert([
                        { from: address, to: peer.address, text: msg }
                      ]);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;