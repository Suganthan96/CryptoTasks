
"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter, usePathname } from "next/navigation";
import styled from 'styled-components';
import React from 'react';

const GlowingButton = styled.button`
  --glow-color: #ed008b;
  --glow-spread-color: rgba(237, 0, 139, 0.7);
  --enhanced-glow-color: #ff4fcf;
  --btn-color: #1a0020;
  border: .25em solid var(--glow-color);
  padding: 1em 3em;
  color: var(--glow-color);
  font-size: 15px;
  font-weight: bold;
  background-color: var(--btn-color);
  border-radius: 1em;
  outline: none;
  box-shadow: 0 0 1em .25em var(--glow-color),
         0 0 4em 1em var(--glow-spread-color),
         inset 0 0 .75em .25em var(--glow-color);
  text-shadow: 0 0 .5em var(--glow-color);
  position: relative;
  transition: all 0.3s;

  &::after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 120%;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--glow-spread-color);
    filter: blur(2em);
    opacity: .7;
    transform: perspective(1.5em) rotateX(35deg) scale(1, .6);
  }

  &:hover {
    color: var(--btn-color);
    background-color: var(--glow-color);
    box-shadow: 0 0 1em .25em var(--glow-color),
           0 0 4em 2em var(--glow-spread-color),
           inset 0 0 .75em .25em var(--glow-color);
  }

  &:active {
    box-shadow: 0 0 0.6em .25em var(--glow-color),
           0 0 2.5em 2em var(--glow-spread-color),
           inset 0 0 .5em .25em var(--glow-color);
  }
`;

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
`;

// Add this to ensure styles are rendered on server
if (typeof window === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

function GatedHome() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const hasNavigated = useRef(false);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConnected && pathname !== "/freelancers" && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/freelancers");
    }
  }, [isConnected, pathname, router]);

  // Vanta Birds background animation
  useEffect(() => {
    let vantaEffect: any = null;
    let threeScript: HTMLScriptElement | null = null;
    let vantaScript: HTMLScriptElement | null = null;
    const loadVanta = async () => {
      if (typeof window !== "undefined" && vantaRef.current) {
        // Load three.js
        if (!(window as any).THREE) {
          threeScript = document.createElement("script");
          threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
          threeScript.async = true;
          document.body.appendChild(threeScript);
          await new Promise(res => { threeScript!.onload = res; });
        }
        // Load vanta.birds
        vantaScript = document.createElement("script");
        vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js";
        vantaScript.async = true;
        document.body.appendChild(vantaScript);
        await new Promise(res => { vantaScript!.onload = res; });
        // Initialize VANTA Birds
        if ((window as any).VANTA && (window as any).VANTA.BIRDS) {
          vantaEffect = (window as any).VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            birdSize: 2.5
          });
        }
      }
    };
    loadVanta();
    return () => {
      if (vantaEffect && typeof vantaEffect.destroy === "function") vantaEffect.destroy();
      if (threeScript) document.body.removeChild(threeScript);
      if (vantaScript) document.body.removeChild(vantaScript);
    };
  }, []);

  return (
    <>
      <div ref={vantaRef} id="vanta-bg" style={{ position: "fixed", inset: 0, zIndex: -1 }} />
      <div className="min-h-screen bg-transparent flex flex-col items-start justify-center px-4 ml-40">
        <h1 className="text-5xl md:text-6xl font-extrabold text-left mb-8 text-white">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-800 to-red-600 bg-clip-text text-transparent">
            Cryptolance
          </span>
        </h1>
        <p className="text-xl font-semibold mb-8 text-left" style={{ color: '#ff4fcf' }}>
          Fully Autonomous Freelancers Hiring Platform
        </p>
        <StyledConnectWrapper>
          <div className="connect-btn-row gap-8">
            <div className="button-with-arrow">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === "authenticated");
                  return (
                    <GlowingButton
                      onClick={connected ? openAccountModal : openConnectModal}
                      type="button"
                      disabled={!ready}
                    >
                      Freelancer
                    </GlowingButton>
                  );
                }}
              </ConnectButton.Custom>
            </div>
            <div className="button-with-arrow">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === "authenticated");
                  return (
                    <GlowingButton
                      onClick={connected ? openAccountModal : openConnectModal}
                      type="button"
                      disabled={!ready}
                    >
                      Client
                    </GlowingButton>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </StyledConnectWrapper>
      </div>
    </>
  );
}

export default function HomePage() {
  return <GatedHome />;
}
