
import { Subject } from "@/types/assignment";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubjectSelectorProps {
  subject: Subject;
  customSubjects: { name_en: string; name_he: string }[];
  onChange: (value: string) => void;
}

export const SubjectSelector = ({ subject, customSubjects, onChange }: SubjectSelectorProps) => {
  const { t, language } = useLanguage();

  const getSubjectName = (subject: { name_en: string; name_he: string }) => {
    return language === 'he' ? subject.name_he : subject.name_en;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="subject">{t("formSubject")}</Label>
      <select
        id="subject"
        value={subject}
        onChange={(e) => onChange(e.target.value)}
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
  );
};
