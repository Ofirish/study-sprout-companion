
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  delay?: number;
  component?: React.ReactElement;
}

export const NavButton = ({ icon, label, onClick, delay = 0, component }: NavButtonProps) => {
  const ButtonContent = (
    <Button
      variant="outline"
      size="icon"
      className="h-12 w-12 rounded-full shadow-lg"
      onClick={onClick}
    >
      {icon}
    </Button>
  );

  const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2, delay }}
    >
      {children}
    </motion.div>
  );

  return (
    <MotionWrapper>
      <Tooltip>
        <TooltipTrigger asChild>
          {component ? component : ButtonContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </MotionWrapper>
  );
};
