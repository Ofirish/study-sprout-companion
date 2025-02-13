
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { HomeIcon, Menu, Settings, X, PlusCircle, LogOut, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { QuickAddSubjectDialog } from "./nav/QuickAddSubjectDialog";
import { NavButton } from "./nav/NavButton";
import { ColorizeButton } from './colorize/ColorizeButton';

export const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { signOut } = useAuth();

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isOpen) {
      timer = setTimeout(closeMenu, 4000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, closeMenu]);

  return (
    <>
      <QuickAddSubjectDialog open={showDialog} onOpenChange={setShowDialog} />

      <div 
        className="fixed bottom-4 right-4 flex flex-col items-end gap-2"
        onMouseEnter={() => {
          if (isOpen) {
            clearTimeout();
          }
        }}
        onMouseLeave={() => {
          if (isOpen) {
            setTimeout(closeMenu, 4000);
          }
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: -68 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0"
              >
                <NavButton
                  icon={<LogOut className="h-6 w-6" />}
                  label="Sign Out"
                  onClick={signOut}
                />
              </motion.div>

              <NavButton
                icon={<HomeIcon className="h-6 w-6" />}
                label="Home"
                component={
                  <Link to="/">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full shadow-lg"
                    >
                      <HomeIcon className="h-6 w-6" />
                    </Button>
                  </Link>
                }
              />

              <NavButton
                icon={<HelpCircle className="h-6 w-6" />}
                label="Help"
                delay={0.1}
                component={
                  <Link to="/help">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full shadow-lg"
                    >
                      <HelpCircle className="h-6 w-6" />
                    </Button>
                  </Link>
                }
              />

              <NavButton
                icon={<Settings className="h-6 w-6" />}
                label="Settings"
                delay={0.2}
                component={
                  <Link to="/settings">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full shadow-lg"
                    >
                      <Settings className="h-6 w-6" />
                    </Button>
                  </Link>
                }
              />

              <NavButton
                icon={<PlusCircle className="h-6 w-6" />}
                label="Quick Add Subject"
                delay={0.3}
                onClick={() => setShowDialog(true)}
              />

              <NavButton
                icon={<></>}
                label="Re-Colorize"
                delay={0.4}
                component={<ColorizeButton />}
              />
            </>
          )}
        </AnimatePresence>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isOpen ? "Close menu" : "Open menu"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};
