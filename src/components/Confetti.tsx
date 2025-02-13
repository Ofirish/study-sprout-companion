
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  rotation: number;
  color: string;
}

export const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPieces(newPieces);

    // Clean up after animation
    const timer = setTimeout(() => {
      setPieces([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            top: -20,
            left: piece.x,
            rotate: piece.rotation,
            scale: 1,
          }}
          animate={{
            top: window.innerHeight + 20,
            rotate: piece.rotation + 360,
            scale: 0,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            delay: Math.random() * 0.5,
          }}
          className="absolute w-4 h-4"
          style={{
            backgroundColor: piece.color,
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        />
      ))}
    </div>
  );
};
