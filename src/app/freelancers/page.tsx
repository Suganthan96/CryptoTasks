import React from "react";
import { FaInstagram, FaTwitter, FaDiscord, FaStar } from "react-icons/fa";

const freelancers = [
  { name: "Alice Kim", role: "Frontend Developer", projects: 24, stars: 4.8, perfection: 98 },
  { name: "Brian Lee", role: "Backend Engineer", projects: 31, stars: 4.6, perfection: 95 },
  { name: "Carla Smith", role: "UI/UX Designer", projects: 19, stars: 4.9, perfection: 99 },
  { name: "David Chen", role: "Full Stack Dev", projects: 27, stars: 4.7, perfection: 97 },
  { name: "Elena Rossi", role: "Mobile Developer", projects: 22, stars: 4.5, perfection: 94 },
  { name: "Felix Turner", role: "DevOps Engineer", projects: 18, stars: 4.8, perfection: 96 },
  { name: "Grace Park", role: "QA Specialist", projects: 20, stars: 4.7, perfection: 97 },
  { name: "Hugo Silva", role: "AI Engineer", projects: 16, stars: 4.9, perfection: 99 },
  { name: "Ivy Wang", role: "Web3 Developer", projects: 14, stars: 4.6, perfection: 95 },
  { name: "Jack Brown", role: "Cloud Architect", projects: 23, stars: 4.8, perfection: 98 },
  { name: "Kira Patel", role: "Security Analyst", projects: 17, stars: 4.7, perfection: 96 },
  { name: "Leo Müller", role: "Data Scientist", projects: 21, stars: 4.9, perfection: 99 },
  { name: "Maya Singh", role: "Product Manager", projects: 25, stars: 4.5, perfection: 93 },
  { name: "Nina Lopez", role: "Content Writer", projects: 29, stars: 4.8, perfection: 97 },
  { name: "Omar Farouk", role: "Blockchain Dev", projects: 15, stars: 4.7, perfection: 96 },
];

export default function Freelancers() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-wrap gap-8 justify-center items-start p-8">
      {freelancers.map((f, i) => (
        <div key={i} className="w-72 rounded-3xl bg-[#1a2235] shadow-lg overflow-hidden flex flex-col items-center p-6 relative">
          <div className="w-full h-32 bg-gradient-to-tr from-cyan-400 to-blue-400 rounded-t-3xl relative mb-4" style={{ borderBottomLeftRadius: '40% 30px', borderBottomRightRadius: '40% 30px' }}>
            <div className="absolute top-4 right-4 flex gap-3 text-white text-xl">
              <FaInstagram />
              <FaTwitter />
              <FaDiscord />
            </div>
          </div>
          <div className="text-white text-lg font-bold mb-1 text-center">{f.name}</div>
          <div className="text-cyan-200 text-sm mb-2 text-center">{f.role}</div>
          <div className="flex justify-between w-full text-white text-sm mt-4">
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
      ))}
    </div>
  );
} 