import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Masonry({ items, stagger = .07, hoverScale = .96 }) {
  const root = useRef(null);
  useEffect(() => {
    const cards = root.current?.querySelectorAll('.masonry-card');
    if (!cards?.length) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(cards, { opacity: 0, y: 42, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .72, ease: 'power3.out', stagger });
    }, root);
    return () => context.revert();
  }, [stagger]);
  return <div ref={root} className="masters-masonry-grid">{items.map(item => <figure className="masonry-card" key={item.id} onPointerEnter={event => gsap.to(event.currentTarget, { scale: hoverScale, duration: .28, ease: 'power2.out' })} onPointerLeave={event => gsap.to(event.currentTarget, { scale: 1, duration: .28, ease: 'power2.out' })}><img src={item.img} alt={item.alt} loading="lazy" decoding="async"/><figcaption>{item.caption}</figcaption></figure>)}</div>;
}
