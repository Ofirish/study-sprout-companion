import { Subject } from "@/types/assignment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormFieldsProps {
  title: string;
  description: string;
  subject: Subject;
  dueDate: string;
  type: "homework" | "test";
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubjectChange: (value: Subject) => void;
  onDueDateChange: (value: string) => void;
  onTypeChange: (value: "homework" | "test") => void;
}

export const FormFields = ({
  title,
  description,
  subject,
  dueDate,
  type,
  onTitleChange,
  onDescriptionChange,
  onSubjectChange,
  onDueDateChange,
  onTypeChange,
}: FormFieldsProps) => {
  const { t, language } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">{t("formTitle")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t("formTitle")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("formDescription")}</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={t("formDescription")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">{t("formSubject")}</Label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value as Subject)}
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
            onChange={(e) => onTypeChange(e.target.value as "homework" | "test")}
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
          onChange={(e) => onDueDateChange(e.target.value)}
        />
      </div>
    </>
  );
};