import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0, 
  direction = "up",
  distance = 40
}: AnimatedSectionProps) {
  const offset = direction === "up" || direction === "down" 
    ? { y: direction === "up" ? distance : -distance }
    : { x: direction === "left" ? distance : -distance };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...offset
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ 
        once: true, 
        amount: 0.3,
        margin: "-100px"
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      {children}
    </motion.div>
  );
}