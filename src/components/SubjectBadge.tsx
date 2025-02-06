
import { Subject } from "@/types/assignment";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { subjectTranslations } from "@/translations/subjects";

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
  const { t, language } = useLanguage();
  
  // Check if the subject is one of the predefined ones
  const isPredefinedSubject = subject in subjectTranslations;
  
  // For predefined subjects, use the translation system
  // For custom subjects, display the subject name directly
  const displayText = isPredefinedSubject ? t(subject as keyof typeof subjectTranslations) : subject;

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-sm font-medium",
        subjectColors[subject as keyof typeof subjectColors] || "bg-gray-100 text-gray-800"
      )}
    >
      {displayText}
    </span>
  );
};
