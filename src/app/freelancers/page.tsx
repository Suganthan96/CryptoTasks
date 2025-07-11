"use client";
import React, { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { freelancers } from "./data";

interface CardProps {
  name: string;
  role: string;
  desc: string;
  projects: number;
  stars: number;
  perfection: number;
  username?: string;
  wallet?: string;
}

const Card = ({ name, role, desc, projects, stars, perfection, username, wallet }: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Generate static values that won't change on re-render
  const staticValues = useMemo(() => ({
    rate: (Math.random() * 0.8 + 0.2).toFixed(2),
    responseTime: Math.floor(Math.random() * 4) + 1,
    location: ['USA', 'Canada', 'UK', 'Germany', 'Australia', 'Singapore'][Math.floor(Math.random() * 6)],
    skills: role.includes('Developer') ? 'React, Node.js, TypeScript' :
            role.includes('Designer') ? 'Figma, Adobe XD, Sketch' :
            role.includes('Engineer') ? 'Python, AWS, Docker' :
            'React, API, Database'
  }), [role]);

  return (
    <>
      <style jsx>{`
        .freelancer-card {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.9) 50%,
            rgba(51, 65, 85, 0.85) 100%);
          backdrop-filter: blur(25px);
          border: 2px solid transparent;
          border-radius: 24px;
          padding: 2.5rem;
          margin: 0.75rem;
          min-width: 360px;
          max-width: 400px;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 2px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          cursor: pointer;
        }

        .freelancer-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(99, 102, 241, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.2);
        }

        .card-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          position: relative;
          z-index: 2;
          margin-bottom: 1.5rem;
        }

        .freelancer-name {
          font-size: 1.75rem;
          font-weight: 900;
          background: linear-gradient(135deg, 
            #00f5ff 0%, 
            #4facfe 25%, 
            #a855f7 50%, 
            #ec4899 75%, 
            #ff0080 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }

        .freelancer-username {
          color: rgba(59, 130, 246, 0.9);
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          width: fit-content;
        }

        .freelancer-role {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.2) 0%, 
            rgba(59, 130, 246, 0.2) 100%);
          border: 2px solid rgba(16, 185, 129, 0.4);
          border-radius: 30px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .freelancer-desc {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.03) 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 1.25rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(99, 102, 241, 0.1) 0%, 
            rgba(168, 85, 247, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-item:hover::before {
          opacity: 1;
        }

        .stat-item:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.12) 0%, 
            rgba(255, 255, 255, 0.06) 100%);
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .stat-value {
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 800;
          position: relative;
          z-index: 2;
        }

        .star-rating {
          color: #ffd700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          font-size: 1.2rem;
        }

        .additional-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 2px solid rgba(255, 255, 255, 0.1);
        }

        .detail-item {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.06) 0%, 
            rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .detail-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(236, 72, 153, 0.1) 0%, 
            rgba(168, 85, 247, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .detail-item:hover::before {
          opacity: 1;
        }

        .detail-item:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.04) 100%);
          border-color: rgba(236, 72, 153, 0.4);
          transform: translateY(-1px) scale(1.02);
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 2;
        }

        .detail-value {
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 800;
          position: relative;
          z-index: 2;
        }

        .floating-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: linear-gradient(135deg, 
            rgba(236, 72, 153, 0.9) 0%, 
            rgba(168, 85, 247, 0.9) 100%);
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 700;
          z-index: 3;
          box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .perfection-high {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.9) 0%, 
            rgba(5, 150, 105, 0.9) 100%);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .perfection-medium {
          background: linear-gradient(135deg, 
            rgba(245, 158, 11, 0.9) 0%, 
            rgba(217, 119, 6, 0.9) 100%);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .eth-rate {
          color: #627eea;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pulse-animation {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.2), 
            transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @media (max-width: 768px) {
          .freelancer-card {
            min-width: 320px;
            max-width: 360px;
            margin: 0.5rem;
            padding: 2rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .additional-details {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .freelancer-name {
            font-size: 1.5rem;
          }
        }
      `}</style>
      
      <div 
        className="freelancer-card shimmer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: 'relative' }}
      >
        <div style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
          color: '#fff',
          padding: '0.5rem 1.25rem',
          borderRadius: '25px',
          fontWeight: 700,
          fontSize: '0.95rem',
          letterSpacing: '0.5px',
          boxShadow: '0 4px 16px rgba(16,185,129,0.18)',
          zIndex: 3,
          border: '1.5px solid rgba(255,255,255,0.18)',
          textShadow: '0 2px 8px rgba(16,185,129,0.18)'
        }}>
          {perfection}% PERFECT
        </div>
        <div className="card-content">
          {/* Header */}
          <div className="card-header">
            <div className="freelancer-name">{name}</div>
            {username && (
              <div className="freelancer-username">
                <span>@{username}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>🔗</span>
              </div>
            )}
            <div className="freelancer-role">{role}</div>
            <div className="freelancer-desc">{desc}</div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Projects</div>
              <div className="stat-value">{projects}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Rating</div>
              <div className="stat-value star-rating">
                {stars} ⭐
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="additional-details">
            <div className="detail-item">
              <div className="detail-label">💰 Rate</div>
              <div className="detail-value eth-rate">
                {staticValues.rate} ETH
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">⚡ Response</div>
              <div className="detail-value">{staticValues.responseTime}h avg</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">🌍 Location</div>
              <div className="detail-value">{staticValues.location}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">🔧 Skills</div>
              <div className="detail-value">{staticValues.skills}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Freelancers() {
  return (
    <>
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
          min-height: 100vh;
        }
        
        .freelancers-container {
          min-height: 100vh;
          background: linear-gradient(135deg, 
            #000000 0%, 
            #0f0f23 25%, 
            #1a1a2e 50%, 
            #16213e 75%, 
            #0f3460 100%);
          padding: 3rem;
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          align-items: flex-start;
          position: relative;
        }

        .freelancers-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .page-title {
          width: 100%;
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 2;
        }
        
        .title-text {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, 
            #00f5ff 0%, 
            #4facfe 20%, 
            #a855f7 40%, 
            #ec4899 60%, 
            #ff6b6b 80%, 
            #ff0080 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          text-shadow: 0 0 50px rgba(0, 245, 255, 0.3);
        }
        
        .subtitle-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.3rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .freelancers-container {
            padding: 2rem 1rem;
            gap: 1.5rem;
          }
          
          .title-text {
            font-size: 2.5rem;
          }
          
          .subtitle-text {
            font-size: 1.1rem;
          }
        }
      `}</style>
      
      <Navbar />
      <div className="freelancers-container">
        <div className="page-title">
          <h1 className="title-text">Elite Freelancers</h1>
          <p className="subtitle-text">Discover top-tier talent for your next project</p>
        </div>
        
        {freelancers.map((f, i) => (
          <Card key={i} {...f} />
        ))}
      </div>
    </>
  );
}