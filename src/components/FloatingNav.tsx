
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, Menu, Settings, X, PlusCircle, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameHe, setNameHe] = useState("");
  const { session, signOut } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleQuickAddSubject = async () => {
    if (!session) {
      toast({
        title: t("error"),
        description: t("loginRequired"),
        variant: "destructive",
      });
      return;
    }

    if (!nameEn || !nameHe) {
      toast({
        title: t("error"),
        description: t("subjectsRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    const newSubject = {
      name_en: nameEn,
      name_he: nameHe,
      user_id: session.user.id,
    };

    const { error } = await supabase
      .from("custom_subjects")
      .insert([newSubject]);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("success"),
      description: t("subjectAdded"),
    });

    // Reset form and close dialog
    setNameEn("");
    setNameHe("");
    setShowDialog(false);
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addSubject")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name-en">{t("subjectNameEn")}</Label>
              <Input
                id="name-en"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="English name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-he">{t("subjectNameHe")}</Label>
              <Input
                id="name-he"
                value={nameHe}
                onChange={(e) => setNameHe(e.target.value)}
                placeholder="שם בעברית"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleQuickAddSubject}>{t("addSubject")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2">
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full shadow-lg"
                      onClick={signOut}
                    >
                      <LogOut className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign Out</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-lg"
                      >
                        <HomeIcon className="h-6 w-6" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/settings">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-lg"
                      >
                        <Settings className="h-6 w-6" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full shadow-lg"
                      onClick={() => setShowDialog(true)}
                    >
                      <PlusCircle className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quick Add Subject</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
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
