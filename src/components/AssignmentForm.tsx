
/**
 * AssignmentForm.tsx
 * Purpose: Form component for creating new assignments.
 * Handles user input and submission of new assignments.
 */
import { useState, useEffect } from "react";
import { Assignment, Subject } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface AssignmentFormProps {
  onSubmit: (assignment: Omit<Assignment, "id" | "status">) => void;
}

export const AssignmentForm = ({ onSubmit }: AssignmentFormProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState<Subject>("Other");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<"homework" | "test">("homework");
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [customSubjectEn, setCustomSubjectEn] = useState("");
  const [customSubjectHe, setCustomSubjectHe] = useState("");
  const [customSubjects, setCustomSubjects] = useState<{ name_en: string; name_he: string; }[]>([]);

  useEffect(() => {
    const fetchCustomSubjects = async () => {
      const { data, error } = await supabase
        .from('custom_subjects')
        .select('name_en, name_he')
        .eq('user_id', session?.user.id);

      if (error) {
        console.error('Error fetching custom subjects:', error);
        return;
      }

      setCustomSubjects(data || []);
    };

    if (session?.user.id) {
      fetchCustomSubjects();
    }
  }, [session?.user.id]);

  const handleSubjectChange = (value: string) => {
    setSubject(value as Subject);
    if (value === "Other") {
      setShowCustomSubject(true);
    } else {
      setShowCustomSubject(false);
    }
  };

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
          user_id: session?.user.id
        }]);

      if (error) throw error;

      setCustomSubjects([...customSubjects, { name_en: customSubjectEn, name_he: customSubjectHe }]);
      setSubject(customSubjectEn as Subject);
      setShowCustomSubject(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !dueDate) {
      toast({
        title: "Error",
        description: t("formRequired"),
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title,
      description,
      subject,
      due_date: new Date(dueDate).toISOString(),
      type,
      user_id: session?.user.id!,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setSubject("Other");
    setDueDate("");
    setType("homework");
    setShowCustomSubject(false);
    setCustomSubjectEn("");
    setCustomSubjectHe("");

    toast({
      title: "Success",
      description: t("formSuccess"),
    });
  };

  const getSubjectName = (subject: { name_en: string; name_he: string }) => {
    return language === 'he' ? subject.name_he : subject.name_en;
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4" dir={language === "he" ? "rtl" : "ltr"}>
        <div className="space-y-2">
          <Label htmlFor="title">{t("formTitle")}</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("formTitle")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("formDescription")}</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("formDescription")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">{t("formSubject")}</Label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Math">{t("Math")}</option>
              <option value="Science">{t("Science")}</option>
              <option value="English">{t("English")}</option>
              <option value="History">{t("History")}</option>
              {customSubjects.map((customSubject, index) => (
                <option key={index} value={customSubject.name_en}>
                  {getSubjectName(customSubject)}
                </option>
              ))}
              <option value="Other">{t("Other")}</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">{t("formType")}</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as "homework" | "test")}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="homework">{t("formHomework")}</option>
              <option value="test">{t("formTest")}</option>
            </select>
          </div>
        </div>

        {showCustomSubject && (
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
        )}

        <div className="space-y-2">
          <Label htmlFor="dueDate">{t("formDueDate")}</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("formSubmit")}
        </Button>
      </form>
    </Card>
  );
};
