import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const spring = { damping: 30, stiffness: 100, mass: 2 };

export default function TiltedCard({ imageSrc, altText, mediaContent, containerHeight = '590px', imageHeight = '590px', scaleOnHover = 1.045, rotateAmplitude = 7, overlayContent }) {
  const ref = useRef(null);
  const [lastY, setLastY] = useState(0);
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const scale = useSpring(1, spring);
  const overlayOpacity = useSpring(0, { damping: 28, stiffness: 160 });
  const captionTilt = useSpring(0, { damping: 30, stiffness: 350 });
  const onMove = event => {
    const box = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - box.left - box.width / 2;
    const offsetY = event.clientY - box.top - box.height / 2;
    rotateX.set((offsetY / (box.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (box.width / 2)) * rotateAmplitude);
    captionTilt.set(-(offsetY - lastY) * .12); setLastY(offsetY);
  };
  const enter = () => { scale.set(scaleOnHover); overlayOpacity.set(1); };
  const leave = () => { scale.set(1); rotateX.set(0); rotateY.set(0); overlayOpacity.set(0); captionTilt.set(0); };
  return <figure ref={ref} className="tilted-card-figure" style={{ height: containerHeight }} onPointerMove={onMove} onPointerEnter={enter} onPointerLeave={leave}>
    <motion.div className="tilted-card-inner" style={{ height: imageHeight, rotateX, rotateY, scale }}>{mediaContent || <img className="tilted-card-img" src={imageSrc} alt={altText}/>}<motion.div className="tilted-card-overlay" style={{ opacity: overlayOpacity, rotate: captionTilt }}>{overlayContent}</motion.div></motion.div>
  </figure>;
}
