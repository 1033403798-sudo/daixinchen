import { useCallback, useRef } from 'react';

export default function BorderGlow({
  children,
  className = '',
  glowColor = '42 70% 64%',
  backgroundColor = 'rgba(30, 23, 18, .68)',
  borderRadius = 22,
  glowIntensity = 1,
  coneSpread = 34,
  colors = ['rgba(190,139,66,.16)', 'rgba(111,51,45,.16)', 'rgba(239,229,210,.05)'],
}) {
  const cardRef = useRef(null);
  const onPointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const angle = (Math.atan2(y - centerY, x - centerX) * 180 / Math.PI) + 90;
    const distance = Math.min(x, y, bounds.width - x, bounds.height - y);
    const proximity = Math.max(0, Math.min(1, 1 - distance / 90));
    card.style.setProperty('--cursor-angle', `${angle}deg`);
    card.style.setProperty('--edge-proximity', proximity.toFixed(3));
  }, []);
  return <div ref={cardRef} onPointerMove={onPointerMove} className={`border-glow-card ${className}`} style={{
    '--card-bg': backgroundColor,
    '--border-radius': `${borderRadius}px`,
    '--glow-color': `hsl(${glowColor} / ${glowIntensity})`,
    '--cone-spread': `${coneSpread}deg`,
    '--gradient-one': colors[0], '--gradient-two': colors[1], '--gradient-three': colors[2],
  }}><span className="edge-light" aria-hidden="true"/><div className="border-glow-inner">{children}</div></div>;
}
