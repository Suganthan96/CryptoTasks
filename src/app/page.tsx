"use client";

import { useEffect, useState } from "react";
import { WagmiConfig, useAccount, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
      <ConnectButton
        showBalance={false}
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "full",
        }}
        chainStatus="icon"
        label="Connect Wallet"
      />
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
