import React, { useMemo, useRef, useState, useEffect } from 'react';

type MarqueeMessage = { text: string; type?: 'error' | 'info' };

const defaultMessages: MarqueeMessage[] = [
  { text: 'Your KYC is pending!! Please complete by August 14th.', type: 'error' },
  { text: 'Scheduled maintenance on Sunday August 17 from 2:00 AM to 4:00 AM IST.', type: 'info' },
  { text: 'Never share your OTP, PIN, Password, or CVV with anyone.', type: 'info' },
  { text: 'Beware of phishing emails, SMS and fraudulent calls.', type: 'info' },
  { text: 'You are eligible for a new Gold Card. Click here for offers.', type: 'info' },
  { text: 'Download our banking app for a seamless experience.', type: 'info' },
  { text: 'For assistance, contact our 24x7 customer support.', type: 'info' },
];

// Continuous marquee: concatenates all messages and scrolls them in a loop.
export default function Marquee({ messages = defaultMessages, speed = 220 }: { messages?: MarqueeMessage[]; speed?: number }) {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const text = useMemo(() => messages.map((m) => m.text.trim()).join('   •   '), [messages]);

  // Measure content width and set CSS variables to ensure a seamless loop
  useEffect(() => {
    let attempts = 0;
    const measure = () => {
      attempts += 1;
      const track = trackRef.current;
      const inner = innerRef.current;
      if (!track || !inner) {
        if (attempts < 5) requestAnimationFrame(measure);
        return;
      }
      const w = inner.clientWidth;
      if (!w) {
        if (attempts < 5) {
          requestAnimationFrame(measure);
          return;
        }
        // fallback: ensure track has at least double width so animation runs
        track.style.width = '200%';
        track.style.setProperty('--marquee-speed', `${speed}s`);
        return;
      }
      // set track width to double the inner content so translateX(-50%) scrolls one copy
      track.style.width = `${w * 2}px`;
      // choose a base speed (seconds) proportional to content length, with a minimum
      const secs = Math.max(10, Math.round(w / 60));
      track.style.setProperty('--marquee-speed', `${secs}s`);
    };
    // measure on next frame to allow layout/fonts to settle
    requestAnimationFrame(measure);
  }, [text]);

  // We render the content twice for a seamless loop
  return (
    <div
      className="marquee"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
      ref={containerRef}
    >
      <div
        className="marquee-track"
        ref={trackRef}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        <div className="marquee-inner" ref={innerRef}>
          <span className="marquee-item info">{text}</span>
        </div>
        <div className="marquee-inner" aria-hidden="true">
          <span className="marquee-item info">{text}</span>
        </div>
      </div>
    </div>
  );
}
