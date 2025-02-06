
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
import { CustomSubjectForm } from "./CustomSubjectForm";
import { SubjectSelector } from "./SubjectSelector";

interface AssignmentFormProps {
  onSubmit: (assignment: Omit<Assignment, "id" | "status">) => void;
}

export const AssignmentForm = ({ onSubmit }: AssignmentFormProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState<Subject>("Other");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<"homework" | "test">("homework");
  const [showCustomSubject, setShowCustomSubject] = useState(true);
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
    setShowCustomSubject(value === "Other");
  };

  const handleCustomSubjectAdded = (newSubject: { name_en: string; name_he: string }) => {
    setCustomSubjects([...customSubjects, newSubject]);
    setSubject(newSubject.name_en as Subject);
    setShowCustomSubject(false);
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

    setTitle("");
    setDescription("");
    setSubject("Other");
    setDueDate("");
    setType("homework");
    setShowCustomSubject(false);

    toast({
      title: "Success",
      description: t("formSuccess"),
    });
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
          <SubjectSelector
            subject={subject}
            customSubjects={customSubjects}
            onChange={handleSubjectChange}
          />

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
          <CustomSubjectForm
            userId={session?.user.id!}
            onSubjectAdded={handleCustomSubjectAdded}
          />
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
