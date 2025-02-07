
import { useState } from "react";
import { Assignment, Subject } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormFields } from "./assignments/FormFields";

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
      archived: false
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
        <FormFields
          title={title}
          description={description}
          subject={subject}
          dueDate={dueDate}
          type={type}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onSubjectChange={setSubject}
          onDueDateChange={setDueDate}
          onTypeChange={setType}
        />

        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("formSubmit")}
        </Button>
      </form>
    </Card>
  );
};
