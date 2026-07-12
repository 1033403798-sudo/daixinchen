import { useEffect } from 'react';

const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

export default function TextPressure({ target, text = 'LET’S MAKE IT RESONATE.', minFontSize = 36, textColor = '#f2e5cf' }) {
  useEffect(() => {
    const element = document.querySelector(target);
    if (!element) return undefined;
    const original = element.innerHTML;
    const chars = Array.from(text);
    const title = document.createElement('span');
    title.className = 'text-pressure-title';
    title.setAttribute('aria-label', text);
    const spans = chars.map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00a0' : char;
      span.setAttribute('aria-hidden', 'true');
      title.appendChild(span);
      return span;
    });
    element.replaceChildren(title);
    element.classList.add('text-pressure-anchor');
    element.style.setProperty('--pressure-color', textColor);
    let pointer = { x: 0, y: 0 };
    let smooth = { x: 0, y: 0 };
    let raf = 0;
    let visible = false;
    let centers = [];
    let maxDistance = 1;
    const updateMetrics = () => {
      const titleBox = title.getBoundingClientRect();
      maxDistance = Math.max(titleBox.width / 2, 1);
      centers = spans.map(span => { const box = span.getBoundingClientRect(); return { x: box.left + box.width / 2, y: box.top + box.height / 2 }; });
    };
    const resize = () => {
      const width = element.getBoundingClientRect().width;
      title.style.fontSize = `${Math.max(minFontSize, Math.min(width / Math.max(chars.length * .52, 1), 118))}px`;
      requestAnimationFrame(updateMetrics);
    };
    const move = event => { pointer = { x: event.clientX, y: event.clientY }; };
    const animate = () => {
      if (!visible) { raf = 0; return; }
      smooth.x += (pointer.x - smooth.x) / 13;
      smooth.y += (pointer.y - smooth.y) / 13;
      spans.forEach((span, index) => {
        const ratio = Math.max(0, 1 - distance(smooth, centers[index] || smooth) / maxDistance);
        span.style.fontVariationSettings = `'wght' ${360 + ratio * 590}, 'wdth' ${72 + ratio * 52}`;
        span.style.transform = `scaleX(${.9 + ratio * .22}) skewX(${ratio * -7}deg)`;
        span.style.opacity = String(.68 + ratio * .32);
      });
      raf = requestAnimationFrame(animate);
    };
    resize();
    const rect = element.getBoundingClientRect();
    pointer = smooth = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const start = () => { if (visible && !raf) raf = requestAnimationFrame(animate); };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && document.visibilityState === 'visible'; if (visible) { updateMetrics(); start(); } else stop(); }, { rootMargin: '100px 0px' });
    const onEnter = () => updateMetrics();
    observer.observe(element);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerenter', onEnter);
    window.addEventListener('resize', resize);
    return () => { stop(); observer.disconnect(); element.removeEventListener('pointermove', move); element.removeEventListener('pointerenter', onEnter); window.removeEventListener('resize', resize); element.classList.remove('text-pressure-anchor'); element.innerHTML = original; };
  }, [target, text, minFontSize, textColor]);
  return null;
}
