import React from "react";
import { FaPaperclip, FaArrowUp } from "react-icons/fa";

export default function Agent() {
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-2xl flex flex-col">
        <div className="bg-gray-800 rounded-t-2xl p-6 min-h-[220px] flex flex-col items-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2 text-center">Hi, I'm CryptoTasks.</div>
          <div className="text-lg text-gray-200 mb-8 text-center">Ask Agent, it works for you </div>
          {/* Chat messages would go here */}
        </div>
        <div className="bg-gray-800 rounded-b-2xl p-3 flex flex-col">
          <div className="flex items-center w-full">
            <input
              type="text"
              placeholder="Message CryptoTasks"
              className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-3 outline-none placeholder-gray-400"
            />
            <button className="ml-2 p-3 text-gray-300 hover:text-cyan-400">
              <FaPaperclip size={20} />
            </button>
            <button className="ml-2 p-3 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white">
              <FaArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 