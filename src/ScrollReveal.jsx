import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ children, enableBlur = true, baseOpacity = .12, baseRotation = 3, blurStrength = 7, containerClassName = '', textClassName = '' }) {
  const ref = useRef(null);
  const words = useMemo(() => String(children).split(/(\s+)/).map((word, index) => word.trim() ? <span className="reveal-word" key={index}>{word}</span> : word), [children]);
  useEffect(() => {
    const element = ref.current;
    const context = gsap.context(() => {
      const targets = element.querySelectorAll('.reveal-word');
      gsap.fromTo(element, { rotate: baseRotation }, { rotate: 0, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom bottom', scrub: true } });
      gsap.fromTo(targets, { opacity: baseOpacity, filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)' }, { opacity: 1, filter: 'blur(0px)', stagger: .05, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom-=20%', end: 'bottom bottom', scrub: true } });
    }, element);
    return () => context.revert();
  }, [enableBlur, baseOpacity, baseRotation, blurStrength]);
  return <div ref={ref} className={`scroll-reveal ${containerClassName}`}><p className={`scroll-reveal-text ${textClassName}`}>{words}</p></div>;
}
