
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, Menu, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg"
                >
                  <HomeIcon className="h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Link to="/settings">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg"
                >
                  <Settings className="h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
};
