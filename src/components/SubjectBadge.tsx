
import { Subject } from "@/types/assignment";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { hasTranslation } from "@/translations";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SubjectBadgeProps {
  subject: Subject;
}

const subjectColors = {
  Math: "bg-blue-100 text-blue-800",
  Science: "bg-green-100 text-green-800",
  English: "bg-purple-100 text-purple-800",
  History: "bg-yellow-100 text-yellow-800",
};

interface CustomSubject {
  id: string;
  name_en: string;
  name_he: string;
}

export const SubjectBadge = ({ subject }: SubjectBadgeProps) => {
  const { t, language } = useLanguage();
  const [customSubjects, setCustomSubjects] = useState<CustomSubject[]>([]);
  
  useEffect(() => {
    fetchCustomSubjects();
  }, []);

  const fetchCustomSubjects = async () => {
    const { data } = await supabase
      .from("custom_subjects")
      .select("*");
    
    if (data) {
      setCustomSubjects(data);
    }
  };

  // Check if the subject is one of the predefined ones
  const isDefaultSubject = subject in subjectColors;

  // Find matching custom subject
  const customSubject = customSubjects.find(
    cs => cs.name_en === subject || cs.name_he === subject
  );

  // Get the display text
  const getDisplayText = () => {
    if (isDefaultSubject && hasTranslation(subject)) {
      return t(subject);
    }
    if (customSubject) {
      return language === "he" ? customSubject.name_he : customSubject.name_en;
    }
    return subject;
  };
  
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-sm font-medium",
        isDefaultSubject ? subjectColors[subject as keyof typeof subjectColors] : "bg-gray-100 text-gray-800"
      )}
    >
      {getDisplayText()}
    </span>
  );
};
