import { useRef, useState } from 'react';

export default function CircularGallery({ items }) {
  const [offset, setOffset] = useState(0);
  const start = useRef(null);
  const clamp = value => Math.min(0, Math.max(value, -(items.length - 2) * 28));
  const onPointerDown = event => { start.current = { x: event.clientX, offset }; event.currentTarget.setPointerCapture(event.pointerId); };
  const onPointerMove = event => { if (!start.current) return; setOffset(clamp(start.current.offset + (event.clientX - start.current.x) * .075)); };
  const onEnd = () => { start.current = null; };
  const onWheel = event => { event.preventDefault(); setOffset(value => clamp(value - event.deltaY * .04)); };
  return <div className="circular-gallery" onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onEnd} onPointerCancel={onEnd} tabIndex={0} role="region" aria-label="舞台照片画廊">
    <div className="circular-gallery-track" style={{ transform: `translateX(${offset}%)` }}>{items.map((item, index) => <figure className="circular-gallery-item" key={item.image} style={{ '--item-order': index }}><img src={item.image} alt={item.text} loading="lazy" decoding="async"/><figcaption>{item.text}</figcaption></figure>)}</div>
  </div>;
}
