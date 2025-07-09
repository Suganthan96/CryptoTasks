"use client";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navbar from "../components/Navbar";
import ClientProviders from "../components/ClientProviders";
import styled from "styled-components";

const StyledWrapper = styled.div`
  .outer {
    width: 800px;
    height: 650px;
    border-radius: 20px;
    padding: 2px;
    background: conic-gradient(from 0deg, #667eea 0deg, #764ba2 90deg, #f093fb 180deg, #f5576c 270deg, #667eea 360deg);
    position: relative;
    margin: 0 auto;
    /* animation: borderRotate 8s linear infinite; */ /* Removed rotation */
  }

  /* Removed keyframes for rotation */
  /*
  @keyframes borderRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  */

  .dot {
    width: 8px;
    aspect-ratio: 1;
    position: absolute;
    background: radial-gradient(circle, #00d4ff, #0099cc);
    box-shadow: 0 0 20px #00d4ff, 0 0 40px #0099cc;
    border-radius: 50%;
    z-index: 2;
    right: 10%;
    top: 10%;
    animation: moveDot 6s ease-in-out infinite;
  }

  @keyframes moveDot {
    0%, 100% {
      top: 10%;
      right: 10%;
      transform: scale(1);
      box-shadow: 0 0 20px #00d4ff, 0 0 40px #0099cc;
    }
    25% {
      top: 10%;
      right: calc(100% - 35px);
      transform: scale(1.2);
      box-shadow: 0 0 30px #ff6b6b, 0 0 50px #ff4757;
    }
    50% {
      top: calc(100% - 30px);
      right: calc(100% - 35px);
      transform: scale(1);
      box-shadow: 0 0 20px #4ecdc4, 0 0 40px #26d0ce;
    }
    75% {
      top: calc(100% - 30px);
      right: 10%;
      transform: scale(1.2);
      box-shadow: 0 0 30px #ffa726, 0 0 50px #ff9800;
    }
  }

  .card {
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 18px;
    border: solid 1px rgba(255, 255, 255, 0.1);
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-direction: column;
    color: #fff;
    padding: 0;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
  }

  .ray {
    width: 600px;
    height: 120px;
    border-radius: 100px;
    position: absolute;
    background: linear-gradient(45deg, #667eea, #764ba2);
    opacity: 0.3;
    box-shadow: 0 0 80px rgba(102, 126, 234, 0.5);
    filter: blur(15px);
    transform-origin: 10%;
    top: -10%;
    left: -50px;
    transform: rotate(40deg);
    animation: rayPulse 4s ease-in-out infinite alternate;
  }

  @keyframes rayPulse {
    0% {
      opacity: 0.3;
      transform: rotate(40deg) scale(1);
    }
    100% {
      opacity: 0.6;
      transform: rotate(40deg) scale(1.1);
    }
  }

  .line {
    position: absolute;
    background: linear-gradient(45deg, #667eea, #764ba2);
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
    animation: lineGlow 3s ease-in-out infinite alternate;
  }

  @keyframes lineGlow {
    0% {
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
    }
    100% {
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
    }
  }

  .topl {
    top: 10%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  }

  .bottoml {
    bottom: 10%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #667eea 100%);
  }

  .leftl {
    left: 10%;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  }

  .rightl {
    right: 10%;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, #f093fb 0%, #f5576c 50%, #667eea 100%);
  }

  .wallet-address {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    animation: textShimmer 3s ease-in-out infinite;
  }

  @keyframes textShimmer {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .wallet-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    padding-bottom: 1.5rem;
  }

  .disconnect-button {
    padding: 0.75rem 2rem;
    background: linear-gradient(45deg, #ff6b6b, #ff4757);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    position: relative;
    overflow: hidden;
  }

  .disconnect-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  .disconnect-button:hover::before {
    left: 100%;
  }

  .disconnect-button:hover {
    background: linear-gradient(45deg, #ff5252, #ff1744);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  }

  .disconnect-button:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }

  .connect-button-wrapper {
    margin-bottom: 0.5rem;
  }

  .connect-button-wrapper button {
    background: linear-gradient(45deg, #667eea, #764ba2) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 0.75rem 2rem !important;
    font-weight: 600 !important;
    font-size: 1.1rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .connect-button-wrapper button:hover {
    background: linear-gradient(45deg, #5a67d8, #6b46c1) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
  }

  .floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: radial-gradient(circle, #667eea, transparent);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }

  .particle:nth-child(1) { left: 20%; animation-delay: 0s; }
  .particle:nth-child(2) { left: 40%; animation-delay: 1s; }
  .particle:nth-child(3) { left: 60%; animation-delay: 2s; }
  .particle:nth-child(4) { left: 80%; animation-delay: 3s; }

  @keyframes float {
    0%, 100% {
      transform: translateY(100px) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: translateY(-100px) rotate(180deg);
      opacity: 1;
    }
  }
`;

const ProfileCard = ({ address, isConnected, disconnect }: { address: string; isConnected: boolean; disconnect: () => void }) => {
  return (
    <StyledWrapper>
      <div className="outer">
        <div className="dot" />
        <div className="card">
          <div className="floating-particles">
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
          </div>
          <div className="ray" />
          <div className="wallet-address">{isConnected ? address : "Not Connected"}</div>
          <div className="wallet-label">WALLET ADDRESS</div>
          <div className="button-container">
            <div className="connect-button-wrapper">
              <ConnectButton
                showBalance={false}
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                chainStatus="icon"
                label="Switch Wallet"
              />
            </div>
            {isConnected && (
              <button onClick={disconnect} className="disconnect-button">
                Disconnect Wallet
              </button>
            )}
          </div>
          <div className="line topl" />
          <div className="line leftl" />
          <div className="line bottoml" />
          <div className="line rightl" />
        </div>
      </div>
    </StyledWrapper>
  );
};

function ProfileContent() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-1100 flex flex-col items-center justify-center px-4">
        <ProfileCard address={address || "Wallet not connected"} isConnected={isConnected} disconnect={disconnect} />
      </div>
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