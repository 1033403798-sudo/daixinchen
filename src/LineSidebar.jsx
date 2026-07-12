import { useRef, useState } from 'react';

export default function LineSidebar({ items, accentColor = '#d9ae66', textColor = '#d9cbbb', markerColor = '#826d55', defaultActive = 0, onItemHover }) {
  const [active, setActive] = useState(defaultActive);
  const refs = useRef([]);
  const onMove = event => refs.current.forEach(element => {
    if (!element) return;
    const box = element.getBoundingClientRect();
    const proximity = Math.max(0, 1 - Math.abs(event.clientY - (box.top + box.height / 2)) / 92);
    element.style.setProperty('--effect', proximity.toFixed(3));
  });
  return <nav className="line-sidebar" style={{ '--accent-color': accentColor, '--text-color': textColor, '--marker-color': markerColor }} onPointerMove={onMove} onPointerLeave={() => refs.current.forEach(el => el?.style.setProperty('--effect', '0'))}>
    <ul>{items.map((label, index) => <li ref={el => { refs.current[index] = el; }} key={label} className={active === index ? 'is-active' : ''} onPointerEnter={() => { setActive(index); onItemHover?.(index); }}><span className="line-sidebar-marker"/><span><b>{String(index + 1).padStart(2, '0')}</b>{label}</span></li>)}</ul>
  </nav>;
}
