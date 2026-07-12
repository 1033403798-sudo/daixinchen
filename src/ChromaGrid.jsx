import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ChromaGrid({ items, className = '', radius = 260, damping = .45, fadeOut = .6, ease = 'power3.out' }) {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const position = useRef({ x: 0, y: 0 });
  const setters = useRef({});
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setters.current.x = gsap.quickSetter(root, '--x', 'px');
    setters.current.y = gsap.quickSetter(root, '--y', 'px');
    const box = root.getBoundingClientRect();
    position.current = { x: box.width / 2, y: box.height / 2 };
    setters.current.x(position.current.x); setters.current.y(position.current.y);
  }, []);
  const move = event => {
    const box = rootRef.current.getBoundingClientRect();
    gsap.to(position.current, { x: event.clientX - box.left, y: event.clientY - box.top, duration: damping, ease, overwrite: true, onUpdate: () => { setters.current.x?.(position.current.x); setters.current.y?.(position.current.y); } });
    gsap.to(fadeRef.current, { opacity: 0, duration: .25, overwrite: true });
  };
  const leave = () => gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
  return <div ref={rootRef} className={`chroma-grid ${className}`} style={{ '--r': `${radius}px` }} onPointerMove={move} onPointerLeave={leave}>
    {items.map((item, index) => <article key={index} className="chroma-card" style={{ '--card-border': item.borderColor, '--card-gradient': item.gradient }} onPointerMove={event => { const r = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--mouse-x', `${event.clientX - r.left}px`); event.currentTarget.style.setProperty('--mouse-y', `${event.clientY - r.top}px`); }}>
      <div className="chroma-img-wrapper"><img src={item.image} alt={item.title} loading="lazy" decoding="async"/></div><footer className="chroma-info"><h3>{item.title}</h3><span>{item.handle}</span><p>{item.subtitle}</p></footer>
    </article>)}<div className="chroma-overlay"/><div className="chroma-fade" ref={fadeRef}/>
  </div>;
}
