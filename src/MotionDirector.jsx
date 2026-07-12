import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MotionDirector() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const hero = document.querySelector('.hero');
    if (!hero) return undefined;

    const opening = document.createElement('div');
    opening.className = 'opening-sequence';
    opening.innerHTML = '<div class="opening-panel opening-panel-a"></div><div class="opening-panel opening-panel-b"></div><div class="opening-mark"><b>代欣辰</b><span>VOICE · IMAGE · IDENTITY</span></div>';
    hero.appendChild(opening);
    document.body.classList.add('is-opening');

    const context = gsap.context(() => {
      const openingTimeline = gsap.timeline({
        defaults: { ease: 'power4.inOut' },
        onComplete: () => { document.body.classList.remove('is-opening'); opening.remove(); }
      });
      openingTimeline
        .fromTo('.opening-mark b', { yPercent: 120, opacity: 0, scaleX: .72 }, { yPercent: 0, opacity: 1, scaleX: 1, duration: .7, ease: 'power4.out' }, .08)
        .fromTo('.opening-mark span', { y: 18, opacity: 0, letterSpacing: '.38em' }, { y: 0, opacity: 1, letterSpacing: '.17em', duration: .55, ease: 'power3.out' }, .3)
        .to('.opening-mark', { opacity: 0, y: -18, duration: .35, ease: 'power2.in' }, .78)
        .to('.opening-panel-a', { yPercent: -102, duration: 1 }, .92)
        .to('.opening-panel-b', { yPercent: 102, duration: 1 }, .98)
        .fromTo('.hero-portrait', { scale: 1.16, filter: 'sepia(.38) saturate(.55) brightness(.55) blur(8px)' }, { scale: 1, filter: 'sepia(.18) saturate(.82) contrast(1.04) blur(0px)', duration: 1.2, ease: 'power3.out' }, .95)
        .fromTo('.hero nav', { y: -70, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'power4.out' }, 1.1)
        .fromTo('.hero .eyebrow', { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: .65, ease: 'power3.out' }, 1.25)
        .fromTo('.hero-content h1', { y: 125, scaleX: .72, scaleY: .66, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, scaleX: 1, scaleY: 1, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.05, ease: 'expo.out' }, 1.28)
        .fromTo('.hero-note', { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' }, 1.62)
        .fromTo('.hero-bottom', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' }, 1.75);

      const titleSelectors = ['.about-copy h2', '.work-head h2', '.strength-intro h2', '.education-head h2', '.masters-section h2'];
      titleSelectors.forEach((selector, index) => {
        document.querySelectorAll(selector).forEach(title => {
          gsap.fromTo(title,
            { y: 110, x: index % 2 ? 75 : -75, scaleX: .68, opacity: 0, clipPath: 'inset(0 0 100% 0)', transformOrigin: 'left bottom' },
            { y: 0, x: 0, scaleX: 1, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.35, ease: 'expo.out', scrollTrigger: { trigger: title, start: 'top 88%', once: true } }
          );
        });
      });

      const staggerGroups = [
        ['.about', '.profile-glow, .stat-glow'],
        ['.work', '.project-list > *'],
        ['.strength', '.skill-grid article'],
        ['.education', '.timeline article']
      ];
      staggerGroups.forEach(([triggerSelector, itemSelector]) => {
        const trigger = document.querySelector(triggerSelector);
        const items = document.querySelectorAll(itemSelector);
        if (!trigger || !items.length) return;
        gsap.fromTo(items,
          { y: 90, opacity: 0, scale: .94, rotateX: 7, clipPath: 'inset(12% 0 0 0)' },
          { y: 0, opacity: 1, scale: 1, rotateX: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.15, ease: 'power4.out', stagger: .16, scrollTrigger: { trigger, start: 'top 76%', once: true } }
        );
      });

      const revealImages = document.querySelectorAll('.profile-chroma img, .concert-triptych img, .stage-gallery-project img');
      revealImages.forEach((image, index) => {
        gsap.fromTo(image,
          { clipPath: index % 2 ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)', scale: 1.13 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4, ease: 'power4.inOut', scrollTrigger: { trigger: image, start: 'top 90%', once: true } }
        );
        gsap.to(image, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
      });

      gsap.fromTo('footer .footer-center',
        { y: 120, scaleX: .74, opacity: 0, clipPath: 'inset(0 0 100% 0)', transformOrigin: 'left bottom' },
        { y: 0, scaleX: 1, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: 'footer', start: 'top 68%', once: true } }
      );
    }, document.body);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
    return () => { window.clearTimeout(refreshTimer); document.body.classList.remove('is-opening'); opening.remove(); context.revert(); };
  }, []);
  return null;
}
