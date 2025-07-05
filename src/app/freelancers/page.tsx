"use client";
import React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { freelancers } from "./data";

interface CardProps {
  name: string;
  role: string;
  desc: string;
  projects: number;
  stars: number;
  perfection: number;
}

const Card = ({ name, role, desc, projects, stars, perfection }: CardProps) => {
  return (
    <StyledWrapper>
      <div className="parent">
        <div className="card">
          <div className="logo">
            <span className="circle circle1" />
            <span className="circle circle2" />
            <span className="circle circle3" />
            <span className="circle circle4" />
            <span className="circle circle5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.667 31.69" className="svg">
                <path id="Path_6" data-name="Path 6" d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" transform="translate(0 0)" />
                <path id="Path_7" data-name="Path 7" d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" transform="translate(-45.91 0)" />
                <path id="Path_8" data-name="Path 8" d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" transform="translate(0 -51.963)" />
              </svg>
            </span>
          </div>
          <div className="glass" />
          <div className="content">
            <span className="title">{name}</span>
            <span className="text">{desc}</span>
          </div>
          <div className="card-meta">
            <div><strong>Role:</strong> {role}</div>
            <div><strong>Projects:</strong> {projects}</div>
            <div><strong>Stars:</strong> {stars}</div>
            <div><strong>Perfection:</strong> {perfection}%</div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .parent {
    width: 300px;
    height: 320px;
    perspective: 1200px;
  }

  .card {
    height: 100%;
    border-radius: 40px;
    background: linear-gradient(
      135deg,
      rgb(106, 90, 205) 0%,
      rgb(147, 112, 219) 100%
    );
    transition: all 0.6s ease-in-out;
    transform-style: preserve-3d;
    box-shadow:
      rgba(30, 30, 60, 0) 40px 50px 25px -40px,
      rgba(30, 30, 60, 0.2) 0px 25px 25px -5px;
  }

  .glass {
    transform-style: preserve-3d;
    position: absolute;
    inset: 10px;
    border-radius: 45px;
    border-top-left-radius: 100%;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.7) 100%
    );
    transform: translate3d(0px, 0px, 30px);
    border-right: 1px solid rgba(255, 255, 255, 0.5);
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 0.6s ease-in-out;
  }

  .content {
    padding: 32px 25px 0px 25px;
    transform: translate3d(0, 0, 31px);
  }

  .content .title {
    display: block;
    color: #3c2f80;
    font-weight: 900;
    font-size: 22px;
    text-align: right;
    padding-right: 0px;
    margin-bottom: 10px;
  }

  .content .text {
    display: block;
    color: rgba(60, 47, 128, 0.8);
    font-size: 14px;
    margin-top: 50px;
    margin-bottom: 10px;
    text-align: right;
    padding-right: 0px;
    padding-left: 60px;
  }

  .bottom {
    padding: 12px 15px;
    transform-style: preserve-3d;
    position: absolute;
    bottom: 25px;
    left: 25px;
    right: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translate3d(0, 0, 31px);
  }

  .bottom .view-more {
    display: flex;
    align-items: center;
    width: 40%;
    justify-content: flex-end;
    transition: all 0.3s ease-in-out;
  }

  .bottom .view-more:hover {
    transform: translate3d(0, 0, 15px);
  }

  .bottom .view-more .view-more-button {
    background: none;
    border: none;
    color: #6a5acd;
    font-weight: bold;
    font-size: 13px;
  }

  .bottom .view-more .svg {
    fill: none;
    stroke: #6a5acd;
    stroke-width: 2.5px;
    max-height: 14px;
  }

  .logo {
    position: absolute;
    left: 0;
    top: 0;
    transform-style: preserve-3d;
  }

  .logo .circle {
    display: block;
    position: absolute;
    aspect-ratio: 1;
    border-radius: 50%;
    top: 0;
    left: 0;
    box-shadow: rgba(100, 100, 111, 0.2) 10px 10px 20px 0px;
    background: rgba(147, 112, 219, 0.3);
    transition: all 0.6s ease-in-out;
  }

  .logo .circle1 {
    width: 160px;
    transform: translate3d(0, 0, 25px);
    top: 10px;
    left: 10px;
  }

  .logo .circle2 {
    width: 130px;
    transform: translate3d(0, 0, 45px);
    top: 12px;
    left: 12px;
    transition-delay: 0.3s;
  }

  .logo .circle3 {
    width: 100px;
    transform: translate3d(0, 0, 65px);
    top: 15px;
    left: 15px;
    transition-delay: 0.6s;
  }

  .logo .circle4 {
    width: 70px;
    transform: translate3d(0, 0, 85px);
    top: 20px;
    left: 20px;
    transition-delay: 0.9s;
  }

  .logo .circle5 {
    width: 40px;
    transform: translate3d(0, 0, 105px);
    top: 25px;
    left: 25px;
    display: grid;
    place-content: center;
    transition-delay: 1.2s;
  }

  .logo .circle5 .svg {
    width: 18px;
    fill: #ffffff;
  }

  .parent:hover .card {
    transform: rotate3d(1, -1, 0, 25deg);
    box-shadow:
      rgba(30, 30, 60, 0.3) 30px 50px 25px -40px,
      rgba(30, 30, 60, 0.15) 0px 25px 30px 0px;
  }

  .parent:hover .card .logo .circle2 {
    transform: translate3d(0, 0, 65px);
  }

  .parent:hover .card .logo .circle3 {
    transform: translate3d(0, 0, 85px);
  }

  .parent:hover .card .logo .circle4 {
    transform: translate3d(0, 0, 105px);
  }

  .parent:hover .card .logo .circle5 {
    transform: translate3d(0, 0, 125px);
  }

  .card-meta {
    margin: 8px 18px 0 18px;
    padding: 10px 18px 6px 0;
    text-align: right;
    color: #3c2f80;
    font-weight: 600;
    font-size: 15px;
    background: rgba(255,255,255,0.18);
    border-radius: 14px;
    box-shadow: 0 2px 12px 0 rgba(60,47,128,0.08);
    backdrop-filter: blur(2px);
  }
`

export default function Freelancers() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-wrap gap-8 justify-center items-start p-8">
        {freelancers.map((f, i) => (
          <Card key={i} {...f} />
        ))}
      </div>
    </>
  );
}