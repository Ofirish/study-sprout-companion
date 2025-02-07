import { Assignment } from "@/types/assignment";
import { useLanguage } from "@/contexts/LanguageContext";

interface AssignmentStatusProps {
  status: Assignment["status"];
  onStatusChange: (status: Assignment["status"]) => void;
}

export const AssignmentStatus = ({ status, onStatusChange }: AssignmentStatusProps) => {
  const { t, language } = useLanguage();
  
  const statusColors = {
    "Not Started": "text-red-500",
    "In Progress": "text-yellow-500",
    Completed: "text-green-500",
  };

  return (
    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value as Assignment["status"])}
      className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
        statusColors[status]
      } border-2 border-current w-full sm:w-auto`}
      dir={language === "he" ? "rtl" : "ltr"}
    >
      <option value="Not Started">{t("notStarted")}</option>
      <option value="In Progress">{t("inProgress")}</option>
      <option value="Completed">{t("completed")}</option>
    </select>
  );
};