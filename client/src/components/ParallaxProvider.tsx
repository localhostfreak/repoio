import { useScroll, motion, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
}

export const ParallaxSection = ({ 
  children, 
  offset = 50, 
  className,
  direction = 'up',
  scale = 1
}: ParallaxProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yOffset = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    direction === 'up' ? [offset, 0, -offset] : [-offset, 0, offset]
  );

  const xOffset = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    direction === 'left' ? [offset, 0, -offset] : [-offset, 0, offset]
  );

  const scaleValue = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [0.95, scale, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.6, 1, 1, 0.6]
  );

  return (
    <motion.div 
      ref={ref} 
      style={{ 
        y: direction === 'up' || direction === 'down' ? yOffset : 0,
        x: direction === 'left' || direction === 'right' ? xOffset : 0,
        scale: scaleValue,
        opacity
      }} 
      className={`${className} section-layer mobile-optimize`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20%" }}
    >
      {children}
    </motion.div>
  );
};
