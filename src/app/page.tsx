"use client";

import { useEffect, useState } from "react";
import { WagmiConfig, useAccount, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import styled from 'styled-components';

const config = getDefaultConfig({
  appName: "CryptoTasks",
  projectId: "64f747071044dfdaf878267ba0e66076",
  chains: [mainnet, polygon, optimism, arbitrum, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const StyledConnectWrapper = styled.div`
  .connect-btn-row {
    display: flex;
    align-items: center;
    position: relative;
    width: fit-content;
  }
  .button-with-arrow {
    position: relative;
    display: flex;
    align-items: center;
  }
  button {
    --primary: #ff5569;
    --neutral-1: #f7f8f7;
    --neutral-2: #e7e7e7;
    --radius: 14px;
    cursor: pointer;
    border-radius: var(--radius);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    border: none;
    box-shadow: 0 0.5px 0.5px 1px rgba(255, 255, 255, 0.2),
      0 10px 20px rgba(0, 0, 0, 0.2), 0 4px 5px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
    min-width: 200px;
    padding: 20px 48px 20px 20px; /* right padding for arrow */
    height: 68px;
    font-family: "Galano Grotesque", Poppins, Montserrat, sans-serif;
    font-style: normal;
    font-size: 18px;
    font-weight: 600;
  }
  button:hover {
    transform: scale(1.02);
    box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3),
      0 15px 30px rgba(0, 0, 0, 0.3), 0 10px 3px -3px rgba(0, 0, 0, 0.04);
  }
  button:active {
    transform: scale(1);
    box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3),
      0 10px 3px -3px rgba(0, 0, 0, 0.2);
  }
  button:after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    border: 2.5px solid transparent;
    background: linear-gradient(var(--neutral-1), var(--neutral-2)) padding-box,
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45)) border-box;
    z-index: 0;
    transition: all 0.4s ease;
  }
  button:hover::after {
    transform: scale(1.05, 1.1);
    box-shadow: inset 0 -1px 3px 0 rgba(255, 255, 255, 1);
  }
  button::before {
    content: "";
    inset: 7px 6px 6px 6px;
    position: absolute;
    background: linear-gradient(to top, var(--neutral-1), var(--neutral-2));
    border-radius: 30px;
    filter: blur(0.5px);
    z-index: 2;
  }
  .arrow-icon {
    position: absolute;
    right: 18px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 28px;
    display: flex;
    align-items: center;
    color: var(--primary);
    transition: transform 0.2s, color 0.2s;
    pointer-events: none;
  }
  @keyframes arrowWave {
    0% { transform: translateX(0) scale(1.1); }
    30% { transform: translateX(6px) scale(1.15) rotate(-10deg); }
    60% { transform: translateX(2px) scale(1.1) rotate(8deg); }
    100% { transform: translateX(0) scale(1.1); }
  }
  .button-with-arrow:hover .arrow-icon {
    animation: arrowWave 0.7s cubic-bezier(.4,1.6,.6,1) forwards;
    color: #ff5569;
  }
`;

function GatedHome() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/freelancers");
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6">
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          CryptoTasks
        </span>
      </h1>
      <p className="text-xl font-semibold text-cyan-300 mb-4 text-center">
        Find and hire the top freenlancers on chain
      </p>
      <StyledConnectWrapper>
        <div className="connect-btn-row">
          <div className="button-with-arrow">
            <ConnectButton
              showBalance={false}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              chainStatus="icon"
              label="Connect Wallet"
            />
            <span className="arrow-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <g style={{ filter: 'url(#shadow)' }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodOpacity="0.5" />
                  </filter>
                </defs>
              </svg>
            </span>
          </div>
          <div className="button-with-arrow" style={{ marginLeft: 24 }}>
            <ConnectButton
              showBalance={false}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              chainStatus="icon"
              label="Connect Wallet"
            />
            <span className="arrow-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <g style={{ filter: 'url(#shadow)' }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodOpacity="0.5" />
                  </filter>
                </defs>
              </svg>
            </span>
          </div>
        </div>
      </StyledConnectWrapper>
      <img
        src="/front.png"
        alt="CryptoTasks"
        className="mt-8 max-w-5xl w-full rounded-xl shadow-xl"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider>
          <GatedHome />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
