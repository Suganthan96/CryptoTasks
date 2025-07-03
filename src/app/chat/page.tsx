"use client";

import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Navbar from "../components/Navbar";

const ROLE_KEY = "user_role";

function RoleSelector({ onSelect }: { onSelect: (role: "client" | "freelancer") => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Select your role</h2>
        <button
          className="mb-4 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold text-lg w-64"
          onClick={() => onSelect("client")}
        >
          Client
        </button>
        <button
          className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-lg w-64"
          onClick={() => onSelect("freelancer")}
        >
          Freelancer
        </button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [role, setRole] = useState<"client" | "freelancer" | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    // Check localStorage for role
    const savedRole = typeof window !== "undefined" ? localStorage.getItem(ROLE_KEY) : null;
    if (savedRole === "client" || savedRole === "freelancer") {
      setRole(savedRole);
    } else {
      setShowSelector(true);
    }
  }, []);

  const handleSelectRole = (selectedRole: "client" | "freelancer") => {
    localStorage.setItem(ROLE_KEY, selectedRole);
    setRole(selectedRole);
    setShowSelector(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Navbar />
      {showSelector && <RoleSelector onSelect={handleSelectRole} />}
      {role && <ChatBox role={role} />}
    </div>
  );
} 