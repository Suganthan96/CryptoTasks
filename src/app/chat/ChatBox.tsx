"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";
import { freelancers } from "../freelancers/data";

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
  // Extract proposal details from the text
  const proposalText = message.text.replace("Project Proposal: ", "");
  
  return (
    <div className={`mb-4 flex ${isFromUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-xl p-4 ${
        isFromUser ? "bg-cyan-700" : "bg-purple-700"
      }`}>
        <div className="flex items-center mb-2">
          <span className="text-yellow-400 font-bold text-sm">🤖 SCOUT AGENT PROPOSAL</span>
          <span className="ml-2 px-2 py-1 rounded text-xs bg-yellow-600">
            AUTOMATED
          </span>
        </div>
        
        <div className="text-white">
          <p className="text-sm leading-relaxed">{proposalText}</p>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-600">
          <span className="text-xs text-gray-300">
            Sent by Scout Agent • {new Date(message.timestamp || Date.now()).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function autoLinkExplorer(text: string) {
  // Regex for block explorer URLs
  const urlRegex = /(https?:\/\/devnet\.explorer\.moved\.network\/transaction\/0x[0-9a-fA-F]+)/g;
  // Regex for transaction hashes
  const txHashRegex = /(0x[0-9a-fA-F]{64})/g;
  // First, replace explorer URLs with links
  let parts = text.split(urlRegex);
  parts = parts.flatMap((part, i) => {
    if (urlRegex.test(part)) {
      return [<a key={"explorer-"+i} href={part} target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">{part}</a>];
    }
    // Now, replace tx hashes with links to the explorer
    const subparts = part.split(txHashRegex);
    return subparts.map((sub, j) => {
      if (txHashRegex.test(sub)) {
        const url = `https://devnet.explorer.moved.network/transaction/${sub}`;
        return <a key={"txhash-"+i+"-"+j} href={url} target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">{sub}</a>;
      }
      return sub;
    });
  });
  return parts;
}

function ChatWindow({ user, peer, chat, onSend }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-cyan-400 font-bold text-lg mr-2">
            {peer.role === "freelancer" ? "Freelancer" : "Client"}:
          </span>
          <span className="text-gray-300 font-mono text-xs">{peer.address}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-gray-900 rounded-xl p-4">
        {chat.map((msg: ChatMessage, i: number) => {
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
            <div key={i} className={`mb-2 flex ${isFromUser ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-[70%] ${
                isFromUser ? "bg-cyan-700 text-white" : "bg-gray-700 text-white"
              }`}>
                {autoLinkExplorer(msg.text)}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex items-center mt-2">
        <input
          className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 outline-none placeholder-gray-400"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { 
            if (e.key === "Enter") { 
              onSend(input); 
              setInput(""); 
            } 
          }}
        />
        <button
          className="ml-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white transition-colors"
          onClick={() => { onSend(input); setInput(""); }}
        >
          Send
        </button>
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
  const [selectedFreelancer, setSelectedFreelancer] = useState<typeof freelancers[0] | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [firstMessage, setFirstMessage] = useState("");
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const receiver = searchParams.get("receiver");

  // Filtered freelancers for search
  const filteredFreelancers = search
    ? freelancers.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    : freelancers.slice(0, 5);

  // CLIENT: Set peer when a freelancer is selected
  useEffect(() => {
    if (role === "client") {
      // Only update peer if it actually changes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFreelancer, address, role]);

  // FREELANCER: Set peer from first chat (no pop-up, no receiver param)
  useEffect(() => {
    if (role === "freelancer" && address) {
      // Always try to find the first chat from supabase
      supabase
        .from('messages')
        .select('*')
        .or(`to.eq.${address},from.eq.${address}`)
        .order('timestamp', { ascending: true })
        .then(({ data }) => {
          // Find the first message where the freelancer is the receiver
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
    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
        const msg = payload.new as ChatMessage;
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

  // Helper to detect and parse 'Work done release <amount> eth' messages
  function parseWorkDoneRelease(msg: string): number | null {
    const match = msg.trim().match(/^Work done release ([0-9.]+) eth$/i);
    if (match) {
      return parseFloat(match[1]);
    }
    return null;
  }

  if (!isConnected) return null;

  // FREELANCER: Show a single chatbox with receiver address as 'to'
  if (role === "freelancer") {
    if (!peer) {
      return (
        <div className="text-gray-400 text-center mt-8">No client chat found. Please provide a receiver address in the URL or wait for a client to message you.</div>
      );
    }
    return (
      <div className="w-full flex flex-col items-center justify-center px-4 relative mt-8">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center mb-8 mt-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Welcome, Freelancer!</h1>
          <p className="text-gray-200 text-center mb-2 max-w-xl">
            You will receive automated project proposals from Scout Agents and can chat with clients in real time.
          </p>
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center mt-4">
            <div className="bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center w-full">
              <span className="text-gray-400 text-sm mb-1">Your Wallet Address:</span>
              <span className="text-cyan-300 font-mono break-all">{address}</span>
              <span className="text-gray-400 text-xs mt-1">Role: freelancer</span>
            </div>
            <div className="bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center w-full">
              <span className="text-gray-400 text-sm mb-1">Chatting with:</span>
              <span className="text-cyan-300 font-mono break-all">{peer.address}</span>
              <span className="text-gray-400 text-xs mt-1">Role: client</span>
            </div>
          </div>
        </div>
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

  // CLIENT: Responsive chat list UI
  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center px-4 relative mt-8">
      {/* Sidebar (desktop) or dropdown (mobile) */}
      <div className="w-full md:w-64 mb-4 md:mb-0 md:mr-8">
        {/* Search bar */}
        <div className="mb-4">
          <input
            className="w-full bg-gray-700 text-gray-100 rounded-lg px-4 py-2 outline-none placeholder-gray-400"
            placeholder="Search freelancers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Mobile dropdown */}
        <div className="block md:hidden mb-4">
          <button
            className="w-full bg-gray-800 text-cyan-300 rounded-lg px-4 py-2 text-left"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedFreelancer ? selectedFreelancer.name : "Select a freelancer to chat"}
          </button>
          {showDropdown && (
            <div className="bg-gray-900 rounded-lg shadow-lg mt-2">
              {filteredFreelancers.map((f) => (
                <div
                  key={f.wallet}
                  className="px-4 py-2 hover:bg-cyan-700 cursor-pointer text-white"
                  onClick={() => { setSelectedFreelancer(f); setShowDropdown(false); }}
                >
                  {f.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Desktop sidebar */}
        <div className="hidden md:block bg-gray-800 rounded-2xl shadow-xl p-4">
          <div className="text-cyan-400 font-bold mb-2">Freelancers</div>
          {filteredFreelancers.map((f) => (
            <div
              key={f.wallet}
              className={`px-3 py-2 rounded-lg mb-1 cursor-pointer ${selectedFreelancer?.wallet === f.wallet ? "bg-cyan-700 text-white" : "text-gray-200 hover:bg-cyan-900"}`}
              onClick={() => setSelectedFreelancer(f)}
            >
              {f.name}
            </div>
          ))}
        </div>
      </div>
      {/* Chat box */}
      <div className="flex-1">
        {!selectedFreelancer && (
          <div className="text-gray-400 text-center mt-8">Select a freelancer to start chatting.</div>
        )}
        {selectedFreelancer && peer && (
          <>
            {loadingChat ? (
              <div className="text-gray-400 text-center mt-8">Loading chat...</div>
            ) : hasHistory ? (
              <ChatWindow
                user={{ address: address as string, role: role as Role, name: "" }}
                peer={peer}
                chat={chat}
                onSend={async (msg: string) => {
                  if (!msg.trim()) return;
                  // Only client triggers fund release
                  if (role === "client") {
                    const amount = parseWorkDoneRelease(msg);
                    if (amount) {
                      // Post the message first
                      await supabase.from('messages').insert([
                        { from: address, to: peer.address, text: msg }
                      ]);
                      // Call the API to release funds
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
                      } catch (err: any) {
                        await supabase.from('messages').insert([
                          { from: address, to: peer.address, text: `Fund release failed: ${err.message || err}` }
                        ]);
                      }
                      return;
                    }
                  }
                  // Default: just send the message
                  await supabase.from('messages').insert([
                    { from: address, to: peer.address, text: msg }
                  ]);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center mt-8">
                <div className="text-gray-400 mb-4">No chat yet. Start the conversation!</div>
                <div className="w-full max-w-xl">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (firstMessage.trim()) {
                        await supabase.from('messages').insert([
                          { from: address, to: peer.address, text: firstMessage }
                        ]);
                        setFirstMessage("");
                        setHasHistory(true);
                      }
                    }}
                  >
                    <div className="flex">
                      <input
                        className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 outline-none placeholder-gray-400"
                        placeholder="Type your first message..."
                        value={firstMessage}
                        onChange={e => setFirstMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white"
                      >Send</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
