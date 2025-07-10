"use client";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import Navbar from "../components/Navbar";
import ClientProviders from "../components/ClientProviders";
import { useState, useEffect } from "react";

function middleEllipsis(address: string, chars = 8) {
  if (!address || address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

function ProfileCard({ 
  address, 
  isConnected, 
  disconnect,
  connect,
  connectors
}: { 
  address: string; 
  isConnected: boolean; 
  disconnect: () => void;
  connect: (options: { connector: any }) => void;
  connectors: readonly any[];
}) {
  const [copied, setCopied] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const shortAddress = address && address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  const status = isConnected ? "Connected" : "Not Connected";
  const subtitle = isConnected ? "Web3 User" : "Guest";
  const displayAddress = isConnected ? middleEllipsis(address, 6) : "Not Connected";

  const handleCopyAddress = async () => {
    if (isConnected && address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 sm:px-0">
      <div 
        className="relative group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Blur */}
        <div 
          className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition-all duration-700"
          style={{
            background: isHovered 
              ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.6) 0%, rgba(59, 130, 246, 0.4) 25%, rgba(6, 182, 212, 0.3) 50%, transparent 70%)`
              : undefined
          }}
        />
        
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          {/* Holographic Overlay */}
          <div 
            className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-white/5 to-transparent"
            style={{
              background: isHovered 
                ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                : undefined
            }}
          />
          
          {/* Status Indicator */}
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs font-medium text-white/80">{status}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 p-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {isConnected ? '🔗' : '👤'}
                      </span>
                    </div>
                  </div>
                </div>
                {isConnected && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </div>
              
              {/* Address Display */}
              <div className="text-center mb-6">
                <div 
                  className="text-xl sm:text-2xl font-bold text-white mb-2 cursor-pointer hover:text-purple-300 transition-colors duration-300 break-all"
                  onClick={handleCopyAddress}
                  title={isConnected ? `Click to copy: ${address}` : undefined}
                >
                  {displayAddress}
                </div>
                <div className="text-sm text-slate-400 font-medium">{subtitle}</div>
                {copied && (
                  <div className="text-xs text-green-400 mt-1 animate-fade-in">
                    Address copied!
                  </div>
                )}
              </div>
            </div>
            
            {/* User Info Card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 mb-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {isConnected ? shortAddress.slice(0, 2) : '??'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      @{shortAddress}
                    </div>
                    <div className="text-xs text-slate-400">{status}</div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Wallet Switcher */}
              <div className="relative z-20 mb-2">
                {!isConnected ? (
                  <select
                    onChange={e => connect({ connector: connectors[parseInt(e.target.value, 10)] })}
                    className="w-full bg-slate-800 text-white font-semibold py-2 px-4 rounded-2xl border border-slate-700 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Choose Wallet</option>
                    {connectors.map((connector, idx) => (
                      <option value={idx} key={connector.id}>{connector.name}</option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={() => disconnect()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl mb-2 transition-all duration-300"
                  >
                    Switch Wallet
                  </button>
                )}
              </div>
              {/* Custom Connect Button */}
              <div className="relative z-20">
                {!isConnected ? (
                  <button
                    onClick={() => connect({ connector: connectors[0] })}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <div className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                    <span className="text-sm">✓</span>
                    <span>Wallet Connected</span>
                  </div>
                )}
              </div>
              {/* Disconnect Button (only show when connected) */}
              {isConnected && (
                <button
                  onClick={disconnect}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Disconnect Wallet
                </button>
              )}
            </div>
          </div>
          
          {/* Animated Bottom Border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  );
}

function ProfileContent() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col items-center justify-center px-4 py-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Web3 Profile
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Connect your wallet to view your decentralized identity
          </p>
        </div>
        
        <ProfileCard 
          address={address || "Wallet not connected"} 
          isConnected={isConnected} 
          disconnect={disconnect}
          connect={connect}
          connectors={connectors}
        />
        
        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm relative z-10">
          <p>Powered by Web3 Technology</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Custom button styling */
        .custom-connect-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border: none;
          border-radius: 16px;
          padding: 12px 24px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.3);
          color: white;
        }
        
        .custom-connect-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(139, 92, 246, 0.4);
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .text-4xl { font-size: 2rem; }
          .text-5xl { font-size: 2.5rem; }
        }
      `}</style>
    </>
  );
}

export default function Profile() {
  return (
    <ClientProviders>
      <ProfileContent />
    </ClientProviders>
  );
}