import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const Shuffle = ({
  text,
  className = '',
  shuffleDirection = 'right',
  duration = .35,
  ease = 'power3.out',
  threshold = .1,
  tag = 'span',
  shuffleTimes = 1,
  animationMode = 'evenodd',
  loop = false,
  loopDelay = 0,
  stagger = .03,
  scrambleCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true,
}) => {
  const ref = useRef(null);
  const splitRef = useRef(null);
  const timelineRef = useRef(null);
  const playedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (!document.fonts) { setFontsLoaded(true); return; }
    if (document.fonts.status === 'loaded') setFontsLoaded(true);
    else document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  useGSAP(() => {
    if (!ref.current || !fontsLoaded) return undefined;
    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const element = ref.current;
    const split = new GSAPSplitText(element, { type: 'chars', charsClass: 'shuffle-char' });
    splitRef.current = split;
    const chars = split.chars;
    const original = chars.map(char => char.textContent);
    const direction = shuffleDirection === 'left' ? 120 : shuffleDirection === 'up' ? 0 : shuffleDirection === 'down' ? 0 : -120;
    const vertical = shuffleDirection === 'up' ? 120 : shuffleDirection === 'down' ? -120 : 0;

    const random = () => scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)] || '';
    const restore = () => chars.forEach((char, index) => { char.textContent = original[index]; });
    const scramble = () => chars.forEach((char, index) => { if (original[index].trim()) char.textContent = random(); });
    const play = () => {
      timelineRef.current?.kill();
      scramble();
      const odd = chars.filter((_, index) => index % 2);
      const even = chars.filter((_, index) => !(index % 2));
      const animateGroup = (group, at = 0) => {
        if (!group.length) return;
        const tween = { xPercent: 0, yPercent: 0, duration, ease, stagger, color: colorTo, onStart: restore };
        gsap.set(group, { display: 'inline-block', xPercent: direction, yPercent: vertical, color: colorFrom, willChange: 'transform' });
        timelineRef.current.to(group, tween, at);
      };
      timelineRef.current = gsap.timeline({ repeat: loop ? -1 : 0, repeatDelay: loop ? loopDelay : 0, onRepeat: scramble, onComplete: restore });
      if (animationMode === 'evenodd') {
        animateGroup(odd, 0);
        animateGroup(even, duration * .7);
      } else animateGroup(chars, 0);
    };
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: `top ${(1 - threshold) * 100}%`,
      once: triggerOnce,
      onEnter: () => { playedRef.current = true; play(); },
    });
    const onHover = () => { if (triggerOnHover && (playedRef.current || !triggerOnce)) play(); };
    element.addEventListener('mouseenter', onHover);
    return () => { trigger.kill(); element.removeEventListener('mouseenter', onHover); timelineRef.current?.kill(); splitRef.current?.revert(); };
  }, { dependencies: [text, fontsLoaded, shuffleDirection, duration, ease, threshold, shuffleTimes, animationMode, loop, loopDelay, stagger, scrambleCharset, colorFrom, colorTo, triggerOnce, respectReducedMotion, triggerOnHover], scope: ref });

  const Tag = tag;
  const classes = useMemo(() => `shuffle-parent ${className}`, [className]);
  return React.createElement(Tag, { ref, className: classes }, text);
};

export default Shuffle;
