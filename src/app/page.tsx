"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter, usePathname } from "next/navigation";
import styled from 'styled-components';
import React from 'react';

const GlowingButton = styled.button`
  --glow-color: #fff;
  --glow-spread-color: rgba(255,255,255,0.7);
  --enhanced-glow-color: #fff;
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

const LogoContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 0;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover {
    transform: translateY(-8px) scale(1.08);
  }
  
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140%;
    height: 140%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.08) 30%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(1);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: none;
    z-index: -1;
  }
  
  &:hover::before {
    transform: translate(-50%, -50%) scale(1.3);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.12) 40%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: none;
    z-index: -1;
    opacity: 0.7;
  }
  
  &:hover::after {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
`;

const LogoImage = styled.img`
  width: 380px;
  height: 380px;
  object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))
          drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  margin-bottom: 0;
  ${LogoContainer}:hover & {
    filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.7)) 
            drop-shadow(0 0 50px rgba(255, 255, 255, 0.5))
            drop-shadow(0 0 75px rgba(255, 255, 255, 0.3));
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
      <div className="min-h-screen bg-transparent flex flex-col items-start px-4 ml-40" style={{ color: '#fff', marginTop: '8rem' }}>
        {/* Logo */}
        <LogoContainer>
          <LogoImage 
            src="/logo.png" 
            alt="Cryptolance Logo" 
            onError={(e) => {
              console.error('Logo not found. Make sure logo.png is in your public folder');
              e.currentTarget.style.display = 'none';
            }}
          />
        </LogoContainer>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-left mb-8" style={{ color: '#fff', marginTop: '-6.5rem' }}>
          <span style={{ color: '#fff' }}>
            Cryptolance
          </span>
        </h1>
        <p className="text-xl font-semibold mb-8 text-left" style={{ color: '#fff' }}>
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