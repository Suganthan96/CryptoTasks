import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 bg-[#004899] text-white rounded-b-2xl shadow-lg">
      <span className="text-2xl font-bold tracking-tight">CryptoTasks</span>
      <div className="flex gap-8">
        <a href="/freelancers" className="hover:underline underline-offset-4 font-semibold text-lg">Freelancers</a>
        <a href="/agent" className="hover:underline underline-offset-4 font-semibold text-lg">Agent</a>
        <a href="/profile" className="hover:underline underline-offset-4 font-semibold text-lg">Profile</a>
      </div>
    </nav>
  );
} 