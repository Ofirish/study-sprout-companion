import { Assignment } from "@/types/assignment";
import { SubjectBadge } from "./SubjectBadge";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface AssignmentCardProps {
  assignment: Assignment;
  onStatusChange: (id: string, status: Assignment["status"]) => void;
}

export const AssignmentCard = ({
  assignment,
  onStatusChange,
}: AssignmentCardProps) => {
  const { t, language } = useLanguage();
  
  const statusColors = {
    "Not Started": "text-red-500",
    "In Progress": "text-yellow-500",
    Completed: "text-green-500",
  };

  const getStatusTranslationKey = (status: Assignment["status"]) => {
    const statusMap = {
      "Not Started": "notStarted",
      "In Progress": "inProgress",
      Completed: "completed",
    };
    return statusMap[status];
  };

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