import React from "react";
import { FaInstagram, FaTwitter, FaDiscord, FaStar } from "react-icons/fa";

export const freelancers = [
  { name: "Alice Kim", role: "Frontend Developer", desc: "Passionate about crafting beautiful and responsive UIs. Loves working with React and Tailwind CSS.", projects: 24, stars: 4.8, perfection: 98 },
  { name: "Brian Lee", role: "Backend Engineer", desc: "Expert in scalable APIs and databases. Enjoys optimizing server performance.", projects: 31, stars: 4.6, perfection: 95 },
  { name: "Carla Smith", role: "UI/UX Designer", desc: "Designs intuitive user experiences. Focused on accessibility and clean layouts.", projects: 19, stars: 4.9, perfection: 99 },
  { name: "David Chen", role: "Full Stack Dev", desc: "Bridges frontend and backend seamlessly. Always learning new tech stacks.", projects: 27, stars: 4.7, perfection: 97 },
  { name: "Elena Rossi", role: "Mobile Developer", desc: "Builds fast, reliable mobile apps. Enthusiastic about cross-platform solutions.", projects: 22, stars: 4.5, perfection: 94 },
  { name: "Felix Turner", role: "DevOps Engineer", desc: "Automates deployments and monitors systems. Keeps everything running smoothly.", projects: 18, stars: 4.8, perfection: 96 },
  { name: "Grace Park", role: "QA Specialist", desc: "Ensures bug-free releases. Detail-oriented and passionate about quality.", projects: 20, stars: 4.7, perfection: 97 },
  { name: "Hugo Silva", role: "AI Engineer", desc: "Develops smart algorithms and ML models. Loves solving complex problems.", projects: 16, stars: 4.9, perfection: 99 },
  { name: "Ivy Wang", role: "Web3 Developer", desc: "Builds decentralized apps and smart contracts. Blockchain enthusiast.", projects: 14, stars: 4.6, perfection: 95 },
  { name: "Jack Brown", role: "Cloud Architect", desc: "Designs scalable cloud infrastructure. AWS and Azure certified.", projects: 23, stars: 4.8, perfection: 98 },
  { name: "Kira Patel", role: "Security Analyst", desc: "Protects systems from threats. Conducts audits and penetration tests.", projects: 17, stars: 4.7, perfection: 96 },
  { name: "Leo Müller", role: "Data Scientist", desc: "Turns data into actionable insights. Skilled in Python and visualization.", projects: 21, stars: 4.9, perfection: 99 },
  { name: "Maya Singh", role: "Product Manager", desc: "Leads teams to deliver great products. Strong communicator and planner.", projects: 25, stars: 4.5, perfection: 93 },
  { name: "Nina Lopez", role: "Content Writer", desc: "Creates engaging and clear content. Loves storytelling and research.", projects: 29, stars: 4.8, perfection: 97 },
  { name: "Omar Farouk", role: "Blockchain Dev", desc: "Specializes in secure blockchain solutions. Keeps up with crypto trends.", projects: 15, stars: 4.7, perfection: 96 },
];

export default function Freelancers() {
  return (
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
  );
} 