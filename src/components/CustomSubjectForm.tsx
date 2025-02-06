
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface CustomSubjectFormProps {
  userId: string;
  onSubjectAdded: (newSubject: { name_en: string; name_he: string }) => void;
}

export const CustomSubjectForm = ({ userId, onSubjectAdded }: CustomSubjectFormProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [customSubjectEn, setCustomSubjectEn] = useState("");
  const [customSubjectHe, setCustomSubjectHe] = useState("");

  const handleAddCustomSubject = async () => {
    if (!customSubjectEn || !customSubjectHe) {
      toast({
        title: "Error",
        description: t("formCustomSubjectRequired"),
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_subjects')
        .insert([{
          name_en: customSubjectEn,
          name_he: customSubjectHe,
          user_id: userId
        }]);

      if (error) throw error;

      onSubjectAdded({ name_en: customSubjectEn, name_he: customSubjectHe });
      setCustomSubjectEn("");
      setCustomSubjectHe("");

      toast({
        title: "Success",
        description: t("formCustomSubjectAdded"),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customSubjectEn">{t("formCustomSubjectEn")}</Label>
        <Input
          id="customSubjectEn"
          value={customSubjectEn}
          onChange={(e) => setCustomSubjectEn(e.target.value)}
          placeholder={t("formCustomSubjectEnPlaceholder")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customSubjectHe">{t("formCustomSubjectHe")}</Label>
        <Input
          id="customSubjectHe"
          value={customSubjectHe}
          onChange={(e) => setCustomSubjectHe(e.target.value)}
          placeholder={t("formCustomSubjectHePlaceholder")}
        />
      </div>
      <Button
        type="button"
        onClick={handleAddCustomSubject}
        variant="secondary"
        className="w-full"
      >
        {t("formAddCustomSubject")}
      </Button>
    </div>
  );
};
