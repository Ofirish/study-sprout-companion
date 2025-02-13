
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface QuickAddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickAddSubjectDialog = ({ open, onOpenChange }: QuickAddSubjectDialogProps) => {
  const [nameEn, setNameEn] = useState("");
  const [nameHe, setNameHe] = useState("");
  const { session } = useAuth();
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};
