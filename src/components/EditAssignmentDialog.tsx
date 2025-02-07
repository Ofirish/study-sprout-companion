import { Assignment, Subject } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

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
  const [subject, setSubject] = useState<Subject>(assignment.subject);
  const [dueDate, setDueDate] = useState(
    new Date(assignment.due_date).toISOString().split("T")[0]
  );
  const [type, setType] = useState<"homework" | "test">(assignment.type);

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
            {t("save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};