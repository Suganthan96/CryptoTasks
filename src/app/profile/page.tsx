"use client";
import { useAccount, useDisconnect, WagmiConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import '@rainbow-me/rainbowkit/styles.css';

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

function ProfileContent() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-1100 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6">Profile</h1>
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center w-full max-w-md">
          <span className="text-gray-400 text-lg mb-2">Connected Wallet Address:</span>
          <span className="text-cyan-300 font-mono break-all mb-6">{isConnected ? address :"connected"}</span>
          <div className="mb-4">
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
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow"
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
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider>
          <ProfileContent />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
} 