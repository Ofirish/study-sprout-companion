
import React from "react";
import { motion } from "framer-motion";
import { Clipboard, Pencil } from "lucide-react";
import { useFunMode } from "@/contexts/FunModeContext";

const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    isClipboard: Math.random() > 0.5,
    style: {
      top: `-50px`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    },
  }));
};

export const FallingItems = () => {
  const items = generateItems(20);
  const { funMode } = useFunMode();

  if (!funMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-primary"
          initial={{ ...item.style, opacity: 1, y: -50 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: [0, 360],
            opacity: [1, 0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        >
          {item.isClipboard ? (
            <Clipboard className="w-6 h-6" />
          ) : (
            <Pencil className="w-6 h-6" />
          )}
        </motion.div>
      ))}
    </div>
  );
};
