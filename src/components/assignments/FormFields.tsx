
import { Subject } from "@/types/assignment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

interface CustomSubject {
  id: string;
  name_en: string;
  name_he: string;
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
  const [customSubject, setCustomSubject] = useState("");
  const [customSubjects, setCustomSubjects] = useState<CustomSubject[]>([]);

  useEffect(() => {
    fetchCustomSubjects();
  }, []);

  const fetchCustomSubjects = async () => {
    const { data } = await supabase
      .from("custom_subjects")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) {
      setCustomSubjects(data);
    }
  };

  useEffect(() => {
    if (subject === "Other" && customSubject) {
      onSubjectChange(customSubject);
    }
  }, [customSubject, onSubjectChange]);

  useEffect(() => {
    if (subject !== "Math" && subject !== "Science" && subject !== "English" && subject !== "History" && subject !== "Other") {
      setCustomSubject(subject);
    }
  }, []);

  const isDefaultSubject = (subj: string) => {
    return ["Math", "Science", "English", "History", "Other"].includes(subj);
  };

  const getSubjectDisplay = (subj: string) => {
    const customSubject = customSubjects.find(
      cs => cs.name_en === subj || cs.name_he === subj
    );
    if (customSubject) {
      return language === "he" ? customSubject.name_he : customSubject.name_en;
    }
    return subj;
  };

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
            value={isDefaultSubject(subject) ? subject : "Other"}
            onChange={(e) => {
              const value = e.target.value;
              if (value !== "Other") {
                onSubjectChange(value as Subject);
                setCustomSubject("");
              } else {
                setCustomSubject("");
                onSubjectChange("Other");
              }
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="Math">{t("Math")}</option>
            <option value="Science">{t("Science")}</option>
            <option value="English">{t("English")}</option>
            <option value="History">{t("History")}</option>
            {customSubjects.map((cs) => (
              <option key={cs.id} value={language === "he" ? cs.name_he : cs.name_en}>
                {language === "he" ? cs.name_he : cs.name_en}
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
            onChange={(e) => onTypeChange(e.target.value as "homework" | "test")}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="homework">{t("formHomework")}</option>
            <option value="test">{t("formTest")}</option>
          </select>
        </div>
      </div>

      {subject === "Other" && (
        <div className="space-y-2">
          <Label>{t("formCustomSubject")}</Label>
          <Input
            value={customSubject}
            onChange={(e) => {
              const value = e.target.value;
              setCustomSubject(value);
              if (value) {
                onSubjectChange(value);
              } else {
                onSubjectChange("Other");
              }
            }}
            placeholder={t("formCustomSubject")}
            required
          />
        </div>
      )}

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
