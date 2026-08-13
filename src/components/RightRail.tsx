import React, { useEffect, useState, useRef } from 'react';
import '../styles/App.css';

export default function RightRail() {
  // Each user message should be its own testimonial
  const testimonials = [
    { name: 'Aisha Khan', text: 'Excellent service and quick support — I trust MD282 for my daily banking.' },
    { name: 'John Doe', text: 'Clear UI and fast transfers. The app made my life easier.' },
    { name: 'Maria Lopez', text: 'Helpful customer service and great offers on cards.' },
    { name: 'Samir Patel', text: 'Secure and fast – love the intuitive dashboard.' },
    { name: 'Grace Li', text: 'Mobile deposits are seamless. Highly recommend.' },
    { name: 'Carlos M.', text: 'Great rewards program and friendly support.' },
  ];

  const offers = [
    { title: 'Gold Card - 2% Cashback', desc: 'Apply now and get welcome bonus rewards.' },
    { title: 'Platinum Travel Card', desc: 'Free lounge access + travel insurance.' },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Use a timeout loop (safer with React strict mode) to advance testimonials
  useEffect(() => {
    if (paused) return;
    const tick = () => {
      timerRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % testimonials.length);
      }, 4000) as unknown as number;
    };
    tick();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current as unknown as number);
    };
  }, [paused, testimonials.length, index]);

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  return (
    <aside className="right-rail" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="rail-section testimonials card testimonial-rotator">
        <h3 style={{ textAlign: 'right' }}>What customers say</h3>
        <div className="testimonial-frame">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`testimonial-item ${i === index ? 'active' : ''}`}
              aria-hidden={i === index ? 'false' : 'true'}
            >
              <p className="testimonial-text" style={{ textAlign: 'right' }}>
                "{t.text}"
              </p>
              <p className="testimonial-author" style={{ textAlign: 'right' }}>
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rail-section offers">
        <h3 style={{ textAlign: 'right' }}>Credit Card Offers</h3>
        {offers.map((o, i) => (
          <div key={i} className="offer card">
            <div className="offer-title">{o.title}</div>
            <div className="offer-desc">{o.desc}</div>
            <button className="btn secondary">Learn More</button>
          </div>
        ))}
      </div>
    </aside>
  );
}
