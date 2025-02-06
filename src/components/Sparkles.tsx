import React from "react";
import { motion } from "framer-motion";

const generateSparkles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    },
  }));
};

export const Sparkles = () => {
  const sparkles = generateSparkles(50);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={sparkle.style}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};