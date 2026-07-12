import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function BlurText({ target, text = '', delay = 90, direction = 'top', threshold = .15 }) {
  const [host, setHost] = useState(null);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const element = document.querySelector(target);
    if (!element) return undefined;
    const original = element.innerHTML;
    element.replaceChildren();
    element.classList.add('blur-text-host');
    setHost(element);
    return () => { element.classList.remove('blur-text-host'); element.innerHTML = original; };
  }, [target]);

  useEffect(() => {
    if (!rootRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [host, threshold]);

  if (!host) return null;
  const from = { filter: 'blur(12px)', opacity: 0, y: direction === 'top' ? -36 : 36 };
  return createPortal(<span ref={rootRef} className="blur-text-content" aria-label={text.replace('\n', '')}>{Array.from(text).map((character, index) => character === '\n' ? <br key={`break-${index}`} /> : <motion.span key={`${character}-${index}`} aria-hidden="true" initial={from} animate={inView ? { filter: ['blur(12px)', 'blur(4px)', 'blur(0px)'], opacity: [0, .55, 1], y: [from.y, direction === 'top' ? 4 : -4, 0] } : from} transition={{ duration: .7, delay: index * delay / 1000, ease: [0.22, 1, 0.36, 1] }}>{character}</motion.span>)}</span>, host);
}
