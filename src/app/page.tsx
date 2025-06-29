"use client";
import { useEffect, useState } from "react";
import { WagmiConfig, useAccount, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { RabbyWalletConnector } from "@rabby-wallet/rabbykit"; // Uncomment if you have this package

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

// If you want to add RabbyWalletConnector, do it like this:
// const wagmiConnectors = [
//   ...connectors,
//   new RabbyWalletConnector({ chains }),
// ];

function GatedHome() {
  const { isConnected, address } = useAccount();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(isConnected);
  }, [isConnected]);

  if (!showContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <h1 className="text-2xl font-bold text-cyan-400 mb-4">Connect your wallet to continue</h1>
          <ConnectButton
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
            chainStatus="icon"
            label="Connect Wallet"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 relative">
      {/* Top right wallet switcher */}
      <div className="absolute top-6 right-8 z-10">
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
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center mb-8 mt-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">Welcome to CryptoTasks!</h1>
        <p className="text-gray-200 text-center mb-2 max-w-xl">
          CryptoTasks is a decentralized platform for finding, hiring, and collaborating with top blockchain and web3 freelancers. Connect your wallet to get started and manage your projects securely on-chain.
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl shadow flex flex-col items-center">
        <span className="text-gray-400 text-sm mb-1">Connected Wallet Address:</span>
        <span className="text-cyan-300 font-mono break-all">{address}</span>
      </div>
    </div>
  );
}

export default function Home() {
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
