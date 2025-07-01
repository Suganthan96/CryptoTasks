"use client";

import React from "react";
import ChatBox from "./ChatBox";
import Navbar from "../components/Navbar";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Navbar />
      <ChatBox />
    </div>
  );
} 