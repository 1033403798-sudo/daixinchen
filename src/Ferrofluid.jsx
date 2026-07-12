import { useEffect, useRef } from 'react';

export default function Ferrofluid({
  colors = ['#983b3b', '#bd6161', '#8c7070'],
  speed = 0.7,
  scale = 1.3,
  turbulence = 1.3,
  fluidity = 0.1,
  rimWidth = 0.2,
  sharpness = 2.5,
  shimmer = 1.5,
  glow = 2,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 1,
  mouseRadius = 0.35,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const pointer = { x: 0.76, y: 0.5, active: false };
    let frame = 0;
    let visible = false;
    let started = performance.now();

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, width * ratio);
      canvas.height = Math.max(1, height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawBlob = (x, y, radius, color, alpha) => {
      const gradient = context.createRadialGradient(x, y, radius * 0.04, x, y, radius);
      gradient.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.42, `${color}${Math.round(alpha * 145).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const render = (now) => {
      if (!visible) { frame = 0; return; }
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const time = (now - started) * 0.00045 * speed;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'screen';
      context.filter = `blur(${Math.max(8, 32 / sharpness)}px)`;

      for (let index = 0; index < 13; index += 1) {
        const phase = index * 1.71;
        const verticalFlow = ((time * (0.28 + fluidity) + index * 0.11) % 1.35) - 0.18;
        const x = width * (0.54 + Math.sin(time * turbulence + phase) * 0.21 + Math.cos(time * 1.6 + phase) * 0.04);
        const y = height * verticalFlow;
        const radius = width * (0.072 + (Math.sin(time * 2 + phase) + 1) * 0.024) * scale;
        drawBlob(x, y, radius, colors[index % colors.length], 0.42 + (index % 3) * 0.08);
      }

      if (mouseInteraction && pointer.active) {
        drawBlob(pointer.x * width, pointer.y * height, width * mouseRadius * .55 * mouseStrength, colors[1], .55 * glow / 2);
        drawBlob(pointer.x * width + 18, pointer.y * height - 10, width * mouseRadius * .21, colors[0], .85);
      }

      context.filter = 'none';
      context.globalCompositeOperation = 'source-over';
      const sheen = context.createLinearGradient(0, 0, width, height);
      sheen.addColorStop(0, 'rgba(255,234,204,.10)');
      sheen.addColorStop(.4, 'rgba(255,255,255,0)');
      sheen.addColorStop(.72, `rgba(255,205,173,${.06 * shimmer})`);
      sheen.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = sheen;
      context.fillRect(0, 0, width, height);
      frame = requestAnimationFrame(render);
    };

    const onMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width;
      pointer.y = (event.clientY - bounds.top) / bounds.height;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const start = () => { if (visible && !frame) frame = requestAnimationFrame(render); };
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && document.visibilityState === 'visible'; if (visible) start(); else stop(); }, { threshold: 0 });
    const onVisibility = () => { visible = document.visibilityState === 'visible' && canvas.getBoundingClientRect().bottom > 0; if (visible) start(); else stop(); };
    visibilityObserver.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    resize();
    return () => { stop(); observer.disconnect(); visibilityObserver.disconnect(); document.removeEventListener('visibilitychange', onVisibility); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); };
  }, [colors, speed, scale, turbulence, fluidity, rimWidth, sharpness, shimmer, glow, mouseInteraction, mouseStrength, mouseRadius]);

  return <canvas ref={canvasRef} className="ferrofluid" style={{ opacity }} aria-hidden="true" />;
}
