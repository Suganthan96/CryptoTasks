"use client";
import { useAccount, useDisconnect, WagmiConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import '@rainbow-me/rainbowkit/styles.css';
import ClientProviders from "../components/ClientProviders";


function ProfileContent() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-1100 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6">CyptoTasks Profile</h1>
        <div className="bg-gray-800 p-12 rounded-4xl shadow-xl flex flex-col items-center w-full max-w-2xl">
          <span className="text-gray-400 text-2xl mb-4">Connected Wallet Address:</span>
          <span className="text-cyan-300 font-mono break-all mb-8 text-lg">{isConnected ? address : "Wallet not connected"}</span>
          <div className="mb-6">
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
              onClick={() => disconnect()}
              className="mt-4 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow text-lg"
            >
              Disconnect Wallet
            </button>
          )}
        </div>
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