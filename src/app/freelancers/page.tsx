import React from "react";
import { FaInstagram, FaTwitter, FaDiscord, FaStar } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { freelancers } from "./data";

export default function Freelancers() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-wrap gap-8 justify-center items-start p-8">
        {freelancers.map((f, i) => (
          <div
            key={i}
            className="relative w-72 rounded-3xl p-[3px]"
            style={{
              background: "linear-gradient(135deg, #00f0ff, #a020f0, #ff00ea)",
              boxShadow: "0 0 32px 4px #00f0ff33, 0 0 32px 4px #a020f033, 0 0 32px 4px #ff00ea33"
            }}
          >
            <div className="rounded-3xl bg-[#11131a] flex flex-col items-center p-6 min-h-[340px]">
              <div className="absolute top-7 right-10 flex gap-3 text-white text-xl">
                <FaInstagram />
                <FaTwitter />
                <FaDiscord />
              </div>
              <div className="text-white text-lg font-bold mb-1 text-center mt-12">{f.name}</div>
              <div className="text-cyan-200 text-sm mb-1 text-center">{f.role}</div>
              <div className="text-gray-400 text-xs mb-2 text-center whitespace-pre-line" style={{minHeight:'2.5em'}}>{f.desc}</div>
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
    </>
  );
} 