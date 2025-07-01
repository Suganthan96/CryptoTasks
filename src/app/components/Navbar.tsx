"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleChatClick = () => {
    const address = window.prompt("Enter receiver wallet address:");
    if (address) {
      router.push(`/chat?receiver=${address}`);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 bg-[#004899] text-white rounded-b-2xl shadow-lg">
      <span className="text-2xl font-bold tracking-tight">CryptoTasks</span>
      <div className="flex gap-8">
        <a href="/freelancers" className="hover:underline underline-offset-4 font-semibold text-lg">Freelancers</a>
        <a href="/agent" className="hover:underline underline-offset-4 font-semibold text-lg">Agent</a>
        <a href="/profile" className="hover:underline underline-offset-4 font-semibold text-lg">Profile</a>
        <button onClick={handleChatClick} className="hover:underline underline-offset-4 font-semibold text-lg bg-transparent border-none cursor-pointer">Chat</button>
      </div>
    </nav>
  );
} 