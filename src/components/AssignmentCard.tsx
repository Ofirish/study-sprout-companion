/**
 * AssignmentCard.tsx
 * Purpose: Displays individual assignment information.
 * Shows assignment details and allows status updates.
 */
import { Assignment } from "@/types/assignment";
import { SubjectBadge } from "./SubjectBadge";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, GraduationCap, User } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface AssignmentCardProps {
  assignment: Assignment;
  onStatusChange: (id: string, status: Assignment["status"]) => void;
}

interface Profile {
  first_name: string;
  last_name: string;
}

export const AssignmentCard = ({
  assignment,
  onStatusChange,
}: AssignmentCardProps) => {
  const { t, language } = useLanguage();
  const { session } = useAuth();
  const [studentProfile, setStudentProfile] = useState<Profile | null>(null);
  
  const statusColors = {
    "Not Started": "text-red-500",
    "In Progress": "text-yellow-500",
    Completed: "text-green-500",
  };

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!session || assignment.user_id === session.user.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", assignment.user_id)
        .single();

      if (!error && data) {
        setStudentProfile(data);
      }
    };

    fetchStudentProfile();
  }, [assignment.user_id, session]);

  return (
    <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0" dir={language === "he" ? "rtl" : "ltr"}>
        <div className="flex items-center space-x-2">
          {assignment.type === "homework" ? (
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
          ) : (
            <GraduationCap className="h-5 w-5 text-accent flex-shrink-0" />
          )}
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{assignment.title}</h3>
        </div>
        <SubjectBadge subject={assignment.subject} />
      </div>
      
      <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
      
      {studentProfile && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <User className="h-3 w-3" />
          <span>{studentProfile.first_name} {studentProfile.last_name}</span>
        </div>
      )}
      
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-600">
            Due {format(new Date(assignment.due_date), "MMM d, yyyy")}
          </span>
        </div>
        
        <select
          value={assignment.status}
          onChange={(e) => onStatusChange(assignment.id, e.target.value as Assignment["status"])}
          className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
            statusColors[assignment.status]
          } border-2 border-current w-full sm:w-auto`}
          dir={language === "he" ? "rtl" : "ltr"}
        >
          <option value="Not Started">{t("notStarted")}</option>
          <option value="In Progress">{t("inProgress")}</option>
          <option value="Completed">{t("completed")}</option>
        </select>
      </div>
    </Card>
  );
};