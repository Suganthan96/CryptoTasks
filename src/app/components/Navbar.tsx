"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleChatClick = () => {
    router.push('/chat');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: '/freelancers', label: 'Freelancers', icon: '👥', color: 'from-blue-400 to-cyan-400' },
    { href: '/agent', label: 'Agent', icon: '🤖', color: 'from-purple-400 to-pink-400' },
    { href: '/profile', label: 'Profile', icon: '👤', color: 'from-green-400 to-emerald-400' },
    { href: '/chat', label: 'Chat', icon: '💬', onClick: handleChatClick, color: 'from-orange-400 to-red-400' }
  ];

  const isActive = (href: string) => pathname === href;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <style jsx global>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-glass {
          background: linear-gradient(135deg, 
            rgba(0, 0, 0, 0.95) 0%, 
            rgba(15, 15, 35, 0.9) 30%,
            rgba(30, 30, 60, 0.85) 70%,
            rgba(45, 45, 85, 0.8) 100%);
          backdrop-filter: blur(25px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .navbar-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 50%);
          opacity: 0.3;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .navbar-scrolled {
          background: linear-gradient(135deg, 
            rgba(0, 0, 0, 0.98) 0%, 
            rgba(15, 15, 35, 0.95) 30%,
            rgba(30, 30, 60, 0.92) 70%,
            rgba(45, 45, 85, 0.88) 100%);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .logo-container {
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logo-container:hover {
          transform: scale(1.05);
        }

        .logo-gradient {
          background: linear-gradient(135deg, 
            #00f5ff 0%, 
            #4a90e2 15%, 
            #8b45ff 35%, 
            #ff0080 60%,
            #ff4500 85%,
            #00f5ff 100%);
          background-size: 300% 300%;
          animation: gradientShift 8s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
          font-size: 1.875rem;
          letter-spacing: -0.025em;
          position: relative;
          text-shadow: 0 0 30px rgba(0, 245, 255, 0.5);
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          animation: pulse 3s ease-in-out infinite;
          z-index: -1;
        }

        .logo-container:hover .logo-glow {
          opacity: 1;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
        }

        .nav-item {
          position: relative;
          padding: 0.875rem 1.75rem;
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(15px);
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.15), 
            transparent);
          transition: left 0.6s ease;
        }

        .nav-item:hover::before {
          left: 100%;
        }

        .nav-item::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 16px;
        }

        .nav-item:hover::after {
          opacity: 1;
        }

        .nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 
            0 12px 30px rgba(0, 0, 0, 0.4),
            0 0 25px rgba(255, 255, 255, 0.1);
        }

        .nav-item.active {
          background: linear-gradient(135deg, 
            rgba(0, 245, 255, 0.25) 0%, 
            rgba(139, 69, 255, 0.2) 50%,
            rgba(255, 0, 128, 0.15) 100%);
          border-color: rgba(0, 245, 255, 0.5);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 
            0 0 30px rgba(0, 245, 255, 0.4),
            0 8px 25px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
          height: 3px;
          background: linear-gradient(90deg, 
            #00f5ff 0%, 
            #8b45ff 50%, 
            #ff0080 100%);
          border-radius: 3px;
          animation: activeGlow 2s ease-in-out infinite;
        }

        @keyframes activeGlow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
            transform: translateX(-50%) scaleX(1);
          }
          50% { 
            box-shadow: 0 0 20px rgba(139, 69, 255, 0.6);
            transform: translateX(-50%) scaleX(1.05);
          }
        }

        .nav-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          transition: transform 0.3s ease;
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .mobile-menu-button {
          display: none;
          padding: 0.75rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .mobile-menu-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            rgba(0, 245, 255, 0.2), 
            rgba(139, 69, 255, 0.2));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mobile-menu-button:hover::before {
          opacity: 1;
        }

        .mobile-menu-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05) rotate(180deg);
          box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(0, 0, 0, 0.98) 0%, 
            rgba(15, 15, 35, 0.95) 50%,
            rgba(30, 30, 60, 0.92) 100%);
          backdrop-filter: blur(25px);
          border-radius: 0 0 24px 24px;
          padding: 1.5rem;
          gap: 0.75rem;
          flex-direction: column;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          transform: translateY(-20px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-menu.open {
          display: flex;
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(0, 245, 255, 0.5), 
            rgba(139, 69, 255, 0.5),
            transparent);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: flex-end;
          flex: 1;
          margin-left: 2rem;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          
          .mobile-menu-button {
            display: block;
          }
          
          .nav-item {
            width: 100%;
            justify-content: flex-start;
            padding: 1.25rem 1.5rem;
            margin: 0.25rem 0;
          }
        }

        .navbar-spacer {
          height: 92px;
          background: transparent;
        }

        /* Notification dot for active items */
        .nav-item.active .nav-icon::after {
          content: '';
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: linear-gradient(45deg, #00f5ff, #ff0080);
          border-radius: 50%;
          animation: notificationPulse 2s ease-in-out infinite;
        }

        @keyframes notificationPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        /* Smooth transitions for all elements */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      
      <div className="navbar-container">
        <nav className={`navbar-glass ${isScrolled ? 'navbar-scrolled' : ''}`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between w-full">
              {/* Enhanced Logo */}
              <div className="logo-container" onClick={() => router.push('/')}>
                <div className="logo-glow"></div>
                <span className="logo-gradient">
                  CryptoLance
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="desktop-nav">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={item.onClick}
                    className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <span className="nav-icon" style={{ position: 'relative' }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Enhanced Mobile Menu Button */}
              <button 
                className="mobile-menu-button"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <svg 
                  width="24" 
                  height="24" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  style={{ 
                    transform: isMobileMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            {/* Enhanced Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={item.onClick}
                  className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: isMobileMenuOpen ? `slideInLeft 0.4s ease forwards` : 'none'
                  }}
                >
                  <span className="nav-icon" style={{ position: 'relative' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
      
      {/* Spacer */}
      <div className="navbar-spacer"></div>
      
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}