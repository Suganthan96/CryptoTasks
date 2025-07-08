"use client";
import { useAccount, useDisconnect, WagmiConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import '@rainbow-me/rainbowkit/styles.css';
import ClientProviders from "../components/ClientProviders";
import styled from "styled-components";


const StyledWrapper = styled.div`
  .outer {
    width: 800px;
    height: 650px;
    border-radius: 10px;
    padding: 1px;
    background: radial-gradient(circle 230px at 0% 0%, #ffffff, #0c0d0d);
    position: relative;
    margin: 0 auto;
  }
  .dot {
    width: 5px;
    aspect-ratio: 1;
    position: absolute;
    background-color: #fff;
    box-shadow: 0 0 10px #ffffff;
    border-radius: 100px;
    z-index: 2;
    right: 10%;
    top: 10%;
    animation: moveDot 6s linear infinite;
  }
  @keyframes moveDot {
    0%, 100% { top: 10%; right: 10%; }
    25% { top: 10%; right: calc(100% - 35px); }
    50% { top: calc(100% - 30px); right: calc(100% - 35px); }
    75% { top: calc(100% - 30px); right: 10%; }
  }
  .card {
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 9px;
    border: solid 1px #202222;
    background-size: 20px 20px;
    background: radial-gradient(circle 280px at 0% 0%, #444444, #0c0d0d);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-direction: column;
    color: #fff;
    padding: 0;
  }
  .ray {
    width: 500px;
    height: 110px;
    border-radius: 100px;
    position: absolute;
    background-color: #c7c7c7;
    opacity: 0.4;
    box-shadow: 0 0 50px #fff;
    filter: blur(10px);
    transform-origin: 10%;
    top: 0%;
    left: 0;
    transform: rotate(40deg);
  }
  .line {
    width: 100%;
    height: 1px;
    position: absolute;
    background-color: #2c2c2c;
  }
  .topl {
    top: 10%;
    background: linear-gradient(90deg, #888888 30%, #1d1f1f 70%);
  }
  .bottoml {
    bottom: 10%;
  }
  .leftl {
    left: 10%;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, #747474 30%, #222424 70%);
  }
  .rightl {
    right: 10%;
    width: 1px;
    height: 100%;
  }
`;

const ProfileCard = ({ address, isConnected, disconnect }: { address: string; isConnected: boolean; disconnect: () => void }) => {
  return (
    <StyledWrapper>
      <div className="outer">
        <div className="dot" />
        <div className="card">
          <div className="ray" />
          <div className="text text-2xl font-bold mb-2">{isConnected ? address : "Not Connected"}</div>
          <div className="mb-2">WALLET ADDRESS</div>
          <div className="w-full items-center justify-center flex flex-col gap-2 pb-6">
            <div className="mb-2">
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
              <button
                onClick={disconnect}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow text-lg"
              >
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