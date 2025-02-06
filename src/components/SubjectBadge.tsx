import { Subject } from "@/types/assignment";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubjectBadgeProps {
  subject: Subject;
}

const subjectColors = {
  Math: "bg-blue-100 text-blue-800",
  Science: "bg-green-100 text-green-800",
  English: "bg-purple-100 text-purple-800",
  History: "bg-yellow-100 text-yellow-800",
  Other: "bg-gray-100 text-gray-800",
};

export const SubjectBadge = ({ subject }: SubjectBadgeProps) => {
  const { t } = useLanguage();
  
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-sm font-medium",
        subjectColors[subject]
      )}
    >
      {t(subject)}
    </span>
  );
};