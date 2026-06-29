'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function GrandOpeningPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  
  const starsRef = useRef<HTMLDivElement>(null)
  const balloonsRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if already shown
    if (!localStorage.getItem('grandOpeningPopupShown')) {
      setIsOpen(true)
    }

    // Generate Stars
    if (starsRef.current) {
      starsRef.current.innerHTML = ''
      for (let i = 0; i < 70; i++) {
        const s = document.createElement('div')
        s.className = 'poster-star'
        s.style.left = Math.random() * 100 + '%'
        s.style.top = Math.random() * 100 + '%'
        s.style.animationDelay = Math.random() * 3 + 's'
        s.style.animationDuration = (1.5 + Math.random() * 2.5) + 's'
        const sz = (1 + Math.random() * 2.5) + 'px'
        s.style.width = sz
        s.style.height = sz
        starsRef.current.appendChild(s)
      }
    }

    // Generate Balloons
    const balloonColors = ['#FF6B6B','#FFD700','#4ECDC4','#FF69B4','#7B68EE','#FF8C00','#00CED1','#FF4500']
    let balloonInterval: NodeJS.Timeout
    
    const spawnBalloon = () => {
      if (!balloonsRef.current) return
      const el = document.createElement('div')
      el.className = 'poster-balloon'
      const c = balloonColors[Math.floor(Math.random() * balloonColors.length)]
      const sz = 26 + Math.random() * 22
      el.style.left = (3 + Math.random() * 94) + '%'
      el.style.animationDuration = (6 + Math.random() * 8) + 's'
      el.style.animationDelay = Math.random() * 3 + 's'
      el.innerHTML = `<svg width="${sz}" height="${sz*1.4}" viewBox="0 0 40 56">
        <ellipse cx="20" cy="20" rx="18" ry="20" fill="${c}" opacity="0.88"/>
        <ellipse cx="13" cy="12" rx="5" ry="6" fill="rgba(255,255,255,0.3)"/>
        <polygon points="18,40 22,40 20,45" fill="${c}"/>
        <line x1="20" y1="45" x2="19" y2="56" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
      </svg>`
      balloonsRef.current.appendChild(el)
      setTimeout(() => el.remove(), 17000)
    }

    for (let i = 0; i < 10; i++) setTimeout(spawnBalloon, i * 500)
    balloonInterval = setInterval(spawnBalloon, 1600)

    // Generate Confetti
    const confettiColors = ['#FFD700','#FF6B6B','#4ECDC4','#FF69B4','#7B68EE','#FF8C00','#fff','#00CED1']
    let confettiInterval: NodeJS.Timeout
    
    const spawnConfetti = () => {
      if (!confettiRef.current) return
      const el = document.createElement('div')
      el.className = 'poster-confetti-piece'
      el.style.left = Math.random() * 100 + '%'
      el.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)]
      el.style.animationDuration = (3 + Math.random() * 4) + 's'
      el.style.animationDelay = Math.random() * 2 + 's'
      el.style.width = (4 + Math.random() * 7) + 'px'
      el.style.height = (4 + Math.random() * 7) + 'px'
      el.style.opacity = (0.6 + Math.random() * 0.4).toString()
      confettiRef.current.appendChild(el)
      setTimeout(() => el.remove(), 8000)
    }

    for (let i = 0; i < 25; i++) setTimeout(spawnConfetti, i * 150)
    confettiInterval = setInterval(spawnConfetti, 350)

    // Countdown Timer
    const target = new Date('2026-07-09T10:00:00')
    const updateCountdown = () => {
      const now = new Date()
      let diff = Math.max(0, target.getTime() - now.getTime())
      const d = Math.floor(diff / 86400000); diff %= 86400000;
      const h = Math.floor(diff / 3600000); diff %= 3600000;
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s })
    }
    
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => {
      clearInterval(balloonInterval)
      clearInterval(confettiInterval)
      clearInterval(timer)
    }
  }, [])

  const closePopup = () => {
    setIsOpen(false)
    localStorage.setItem('grandOpeningPopupShown', 'true')
  }

  if (!isOpen) return null

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={closePopup}
    >
      <button 
        onClick={closePopup} 
        className="fixed top-4 right-4 md:top-8 md:right-8 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-white text-2xl z-[100000] transition-all cursor-pointer"
        aria-label="Close"
      >
        ×
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@500;700&family=Oswald:wght@400;700&display=swap');
        
        .grand-opening-poster {
          background: #07070f;
          min-height: 980px;
          width: 100%;
          max-width: 500px;
          position: relative;
          overflow: hidden;
          font-family: 'Rajdhani', sans-serif;
          border-radius: 14px;
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
          margin: auto;
          margin-top: 40px;
          margin-bottom: 40px;
        }
        .grand-opening-poster * {
          box-sizing: border-box;
        }

        .poster-stars { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .poster-star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: posterTwinkle 2s infinite alternate;
        }
        @keyframes posterTwinkle { from { opacity: 0.15; } to { opacity: 0.9; } }
        
        .poster-balloon {
          position: absolute;
          bottom: -30px;
          animation: posterFloatUp linear infinite;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes posterFloatUp {
          0% { transform: translateY(0) rotate(-4deg); opacity: 0; }
          8% { opacity: 0.85; }
          92% { opacity: 0.85; }
          100% { transform: translateY(-1050px) rotate(4deg); opacity: 0; }
        }
        
        .poster-confetti-piece {
          position: absolute;
          border-radius: 1px;
          animation: posterConfettiFall linear infinite;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes posterConfettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(1050px) rotate(800deg); opacity: 0; }
        }
        
        .poster-glow-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FFD700, #FF6B00, #FFD700, transparent);
          z-index: 20;
          animation: posterShimmer 2.5s infinite;
        }
        @keyframes posterShimmer { 0%,100%{opacity:0.5;} 50%{opacity:1;} }

        /* BANNER */
        .poster-banner-top {
          background: linear-gradient(90deg, #1a0800, #3a1a00, #1a0800);
          padding: 9px 16px;
          text-align: center;
          border-bottom: 1px solid #FF6B00;
          position: relative; z-index: 10;
        }
        .poster-banner-top span { color: #FFD700; font-family: 'Oswald', sans-serif; font-size: 12px; letter-spacing: 3px; font-weight: 700; }
        .poster-zap { animation: posterZapFlash 0.9s infinite; display: inline-block; }
        @keyframes posterZapFlash { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

        /* LOGO SECTION */
        .poster-logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 20px 6px;
          position: relative; z-index: 10;
        }
        .poster-gym-logo-img {
          width: 110px; height: 110px;
          border-radius: 50%;
          border: 2px solid #FFD700;
          box-shadow: 0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(74,144,217,0.2);
          object-fit: cover;
        }
        .poster-logo-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 38px;
          letter-spacing: 6px;
          color: #4A90D9;
          text-shadow: 0 0 18px rgba(74,144,217,0.7), 0 0 36px rgba(74,144,217,0.3);
          line-height: 1;
          margin-top: 8px;
        }
        .poster-logo-sub {
          color: #777;
          font-size: 11px;
          letter-spacing: 7px;
          margin-top: 1px;
        }

        /* GRAND OPENING BIG */
        .poster-grand-section {
          margin: 14px 16px 0;
          background: linear-gradient(135deg, #1a0a00, #2e1600, #1a0a00);
          border: 1.5px solid #FFD700;
          border-radius: 12px;
          padding: 18px 10px;
          text-align: center;
          position: relative; z-index: 10;
          overflow: hidden;
        }
        .poster-grand-section::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.12) 0%, transparent 70%);
        }
        .poster-grand-emoji { font-size: 28px; display: block; margin-bottom: 4px; }
        .poster-grand-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 52px;
          color: #FFD700;
          text-shadow: 0 0 25px rgba(255,215,0,0.9), 0 0 50px rgba(255,107,0,0.6), 3px 3px 0 #5a3d00;
          letter-spacing: 3px;
          line-height: 1;
        }
        .poster-grand-date {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 38px;
          color: #fff;
          letter-spacing: 3px;
          text-shadow: 0 0 12px rgba(255,255,255,0.3);
          margin-top: 2px;
        }
        .poster-grand-date span { color: #FF6B00; text-shadow: 0 0 15px rgba(255,107,0,0.8); }
        .poster-grand-shine {
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: posterGrandShine 3s infinite;
        }
        @keyframes posterGrandShine { 0%{left:-100%;} 60%,100%{left:150%;} }

        /* HERO */
        .poster-hero {
          padding: 12px 20px 0;
          position: relative; z-index: 10;
          text-align: center;
        }
        .poster-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 68px;
          line-height: 1;
          color: #fff;
          text-shadow: 2px 2px 0 #000, 0 0 25px rgba(255,255,255,0.15);
          letter-spacing: 2px;
        }
        .poster-hero-title .poster-open {
          color: #FFD700;
          text-shadow: 0 0 20px rgba(255,215,0,0.9), 0 0 45px rgba(255,107,0,0.5), 2px 2px 0 #8B6000;
        }
        .poster-tagline { color: #999; font-size: 13px; letter-spacing: 2.5px; margin-top: 4px; }

        .poster-divider {
          margin: 14px 20px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #FF6B00, #FFD700, #FF6B00, transparent);
          position: relative; z-index: 10;
        }

        /* OFFER */
        .poster-offer-card {
          margin: 0 16px;
          background: linear-gradient(135deg, #0d1a2e, #0a1525, #0d1a2e);
          border: 1px solid rgba(74,144,217,0.4);
          border-radius: 12px;
          padding: 18px;
          text-align: center;
          position: relative; overflow: hidden; z-index: 10;
        }
        .poster-offer-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.07) 0%, transparent 70%);
        }
        .poster-offer-label { color: #777; font-size: 10px; letter-spacing: 3px; font-weight: 700; margin-bottom: 4px; }
        .poster-offer-percent {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 82px; line-height: 1;
          color: #FFD700;
          text-shadow: 0 0 25px rgba(255,215,0,0.7), 0 0 50px rgba(255,107,0,0.4), 3px 3px 0 #5a3d00;
        }
        .poster-offer-desc { color: #aaa; font-size: 12px; letter-spacing: 1px; margin-top: 2px; }

        /* INFO */
        .poster-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin: 14px 16px;
          position: relative; z-index: 10;
        }
        .poster-info-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 12px 8px;
          text-align: center;
        }
        .poster-info-icon { font-size: 20px; display: block; margin-bottom: 3px; }
        .poster-info-label { color: #555; font-size: 9px; letter-spacing: 2px; display: block; }
        .poster-info-val { color: #fff; font-size: 13px; font-weight: 700; margin-top: 2px; }

        /* COUNTDOWN */
        .poster-countdown {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 0 16px 14px;
          position: relative; z-index: 10;
        }
        .poster-count-box {
          background: rgba(74,144,217,0.1);
          border: 1px solid rgba(74,144,217,0.3);
          border-radius: 8px;
          padding: 10px 14px;
          text-align: center;
          flex: 1;
        }
        .poster-count-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          color: #4A90D9;
          text-shadow: 0 0 12px rgba(74,144,217,0.6);
          line-height: 1;
          display: block;
        }
        .poster-count-lbl { color: #555; font-size: 9px; letter-spacing: 2px; margin-top: 1px; }

        /* CTAs */
        .poster-cta-primary {
          margin: 0 16px 10px;
          background: linear-gradient(135deg, #1a4a8a, #2060b0, #1a4a8a);
          border: none; border-radius: 8px;
          padding: 16px; text-align: center;
          cursor: pointer; display: block;
          position: relative; z-index: 10; overflow: hidden;
          text-decoration: none;
        }
        .poster-cta-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transform: translateX(-100%);
          animation: posterShine 2.5s infinite;
        }
        @keyframes posterShine { 0%{transform:translateX(-100%);} 60%,100%{transform:translateX(110%);} }
        .poster-cta-primary span { color: #fff; font-family: 'Oswald', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 3px; }
        
        .poster-cta-secondary {
          margin: 0 16px 14px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 8px; padding: 13px; text-align: center;
          cursor: pointer; display: block;
          position: relative; z-index: 10;
          text-decoration: none;
        }
        .poster-cta-secondary span { color: #ccc; font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 2px; }

        /* FOOTER */
        .poster-footer-address {
          padding: 10px 16px 18px;
          text-align: center;
          position: relative; z-index: 10;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .poster-footer-address p { color: #444; font-size: 10.5px; letter-spacing: 0.3px; line-height: 1.7; }
      `}} />

      <div className="grand-opening-poster" onClick={(e) => e.stopPropagation()}>
        
        <div className="poster-glow-top"></div>
        <div className="poster-stars" ref={starsRef}></div>
        <div ref={balloonsRef}></div>
        <div ref={confettiRef}></div>

        <div className="poster-banner-top">
          <span className="poster-zap">⚡</span>
          <span> &nbsp;GRAND OPENING SPECIAL — LIMITED OFFER&nbsp; </span>
          <span className="poster-zap">⚡</span>
        </div>

        {/* LOGO + NAME */}
        <div className="poster-logo-section">
          <Image 
            className="poster-gym-logo-img" 
            src="/logo.jpg" 
            alt="Milestone Energym Logo" 
            width={110} 
            height={110} 
            unoptimized
          />
          <div className="poster-logo-name">MILESTONE</div>
          <div className="poster-logo-sub">— E N E R G Y M —</div>
        </div>

        {/* GRAND OPENING BIG SECTION */}
        <div className="poster-grand-section">
          <div className="poster-grand-shine"></div>
          <span className="poster-grand-emoji">🎉🎊🎉</span>
          <div className="poster-grand-title">GRAND OPENING</div>
          <div className="poster-grand-date"><span>9TH JULY</span> 2026</div>
        </div>

        {/* WE ARE OPEN */}
        <div className="poster-hero">
          <div className="poster-hero-title">WE ARE <span className="poster-open">OPEN!</span></div>
          <div className="poster-tagline">TRAIN HARD. STAY STRONG. TRANSFORM NOW.</div>
        </div>

        <div className="poster-divider"></div>

        {/* OFFER */}
        <div className="poster-offer-card">
          <div className="poster-offer-label">✨ OPENING DAY EXCLUSIVE ✨</div>
          <div className="poster-offer-percent">20% OFF</div>
          <div className="poster-offer-desc">On All Membership Joining — 9th July Only</div>
        </div>

        {/* INFO */}
        <div className="poster-info-grid">
          <div className="poster-info-box">
            <span className="poster-info-icon">📅</span>
            <span className="poster-info-label">DATE</span>
            <div className="poster-info-val">9th July 2026</div>
          </div>
          <div className="poster-info-box">
            <span className="poster-info-icon">⏰</span>
            <span className="poster-info-label">OPENS AT</span>
            <div className="poster-info-val">10:00 AM</div>
          </div>
          <div className="poster-info-box">
            <span className="poster-info-icon">📍</span>
            <span className="poster-info-label">LOCATION</span>
            <div className="poster-info-val">Barmer, Raj.</div>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className="poster-countdown">
          <div className="poster-count-box"><span className="poster-count-num">{pad(timeLeft.d)}</span><div className="poster-count-lbl">DAYS</div></div>
          <div className="poster-count-box"><span className="poster-count-num">{pad(timeLeft.h)}</span><div className="poster-count-lbl">HOURS</div></div>
          <div className="poster-count-box"><span className="poster-count-num">{pad(timeLeft.m)}</span><div className="poster-count-lbl">MINS</div></div>
          <div className="poster-count-box"><span className="poster-count-num">{pad(timeLeft.s)}</span><div className="poster-count-lbl">SECS</div></div>
        </div>

        <a href="#register" onClick={closePopup} className="poster-cta-primary"><span>⚡ CLAIM 20% OFF — JOIN NOW</span></a>
        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="poster-cta-secondary"><span>💬 WHATSAPP US TO BOOK</span></a>

        <div className="poster-footer-address">
          <p>नवलराम की चक्की, Near Crown Plaza NH68, Barmer, Rajasthan — 344001</p>
          <p style={{ color: '#888', marginTop: '3px' }}>Offer valid on 9th July 2026 only. Limited memberships at this price.</p>
        </div>
      </div>
    </div>
  )
}
