
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FlyingNameProps {
  name: string;
  onClose: () => void;
}

export const FlyingName = ({ name, onClose }: FlyingNameProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const glowStyle = {
    textShadow: `
      0 0 10px currentColor,
      0 0 20px currentColor,
      0 0 30px currentColor
    `
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-auto z-50 cursor-pointer"
      animate={{
        x: position.x,
        y: position.y,
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
      onClick={onClose}
    >
      <div 
        className="text-4xl font-bold text-primary animate-pulse"
        style={glowStyle}
      >
        {name}
      </div>
    </motion.div>
  );
};
