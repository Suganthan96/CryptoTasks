"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";

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

function ChatWindow({ user, peer, chat, onSend }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  return (
    <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col h-[500px]">
      <div className="flex items-center mb-4">
        <span className="text-cyan-400 font-bold text-lg mr-2">{peer.role === "freelancer" ? "Freelancer" : "Client"}:</span>
        <span className="text-gray-300 font-mono text-xs">{peer.address}</span>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-900 rounded-xl p-4">
        {chat.map((msg: ChatMessage, i: number) => (
          <div key={i} className={`mb-2 flex ${msg.from === user.address ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-lg max-w-[70%] ${msg.from === user.address ? "bg-cyan-700 text-white" : "bg-gray-700 text-white"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center mt-2">
        <input
          className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 outline-none placeholder-gray-400"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { onSend(input); setInput(""); } }}
        />
        <button
          className="ml-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white"
          onClick={() => { onSend(input); setInput(""); }}
        >Send</button>
      </div>
    </div>
  );
}

interface ChatBoxProps {
  role?: Role;
}

const ChatBox = ({ role: propRole }: ChatBoxProps) => {
  const { isConnected, address } = useAccount();
  const role = propRole || 'client';
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [peer, setPeer] = useState<Peer | null>(null);
  const searchParams = useSearchParams();
  const receiver = searchParams.get("receiver");

  // Set peer from query param after role is set
  useEffect(() => {
    if (
      role &&
      receiver &&
      address &&
      receiver !== address &&
      (!peer || peer.address !== receiver || peer.role !== (role === "client" ? "freelancer" : "client"))
    ) {
      setPeer({ address: receiver, role: role === "client" ? "freelancer" : "client", name: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, address, receiver]);

  // Fetch and subscribe to chat messages from Supabase
  useEffect(() => {
    if (!address || !peer) return;
    let ignore = false;
    supabase
      .from('messages')
      .select('*')
      .or(`and(from.eq.${address},to.eq.${peer.address}),and(from.eq.${peer.address},to.eq.${address})`)
      .order('timestamp', { ascending: true })
      .then(({ data }) => { if (!ignore) setChat((data as ChatMessage[]) || []); });
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
        const msg = payload.new as ChatMessage;
        if (
          (msg.from === address && msg.to === peer.address) ||
          (msg.from === peer.address && msg.to === address)
        ) {
          setChat((c: ChatMessage[]) => [...c, msg]);
        }
      })
      .subscribe();
    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [address, peer]);

  if (!isConnected) return null;
  if (!receiver) return <div className="text-red-400 text-center mt-8">Please provide a receiver wallet address to start a chat.</div>;
  if (!peer) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 relative mt-8">
      {/* Main content */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center mb-8 mt-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!</h1>
        <p className="text-gray-200 text-center mb-2 max-w-xl">
          {role === "client"
            ? "You can send project proposals to freelancers and chat in real time."
            : "You can receive project proposals from clients and chat in real time."}
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center mt-4">
          <div className="bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center w-full">
            <span className="text-gray-400 text-sm mb-1">Your Wallet Address:</span>
            <span className="text-cyan-300 font-mono break-all">{address}</span>
            <span className="text-gray-400 text-xs mt-1">Role: {role}</span>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center w-full">
            <span className="text-gray-400 text-sm mb-1">Chatting with:</span>
            <span className="text-cyan-300 font-mono break-all">{peer.address}</span>
            <span className="text-gray-400 text-xs mt-1">Role: {peer.role}</span>
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
};

export default ChatBox; 