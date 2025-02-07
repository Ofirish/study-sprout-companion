import { Assignment } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { FormFields } from "./assignments/FormFields";

interface EditAssignmentDialogProps {
  assignment: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedAssignment: Partial<Assignment>) => void;
}

export const EditAssignmentDialog = ({
  assignment,
  open,
  onOpenChange,
  onSave,
}: EditAssignmentDialogProps) => {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description || "");
  const [subject, setSubject] = useState(assignment.subject);
  const [dueDate, setDueDate] = useState(
    new Date(assignment.due_date).toISOString().split("T")[0]
  );
  const [type, setType] = useState(assignment.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      subject,
      due_date: new Date(dueDate).toISOString(),
      type,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir={language === "he" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>{t("editAssignment")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {t("save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};