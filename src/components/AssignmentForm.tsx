import { useState } from "react";
import { Assignment, Subject } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";

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
          <div className="space-y-2">
            <Label htmlFor="subject">{t("formSubject")}</Label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Math">{t("Math")}</option>
              <option value="Science">{t("Science")}</option>
              <option value="English">{t("English")}</option>
              <option value="History">{t("History")}</option>
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