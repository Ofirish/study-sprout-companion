/**
 * StatsCard.tsx
 * Purpose: Displays assignment statistics and filtering options.
 * Shows counts of assignments by status and provides filtering functionality.
 */
import { Assignment } from "@/types/assignment";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatsCardProps {
  assignments: Assignment[];
  onFilterChange: (filter: "all" | "completed" | "in_progress" | "not_started") => void;
}

export const StatsCard = ({ assignments, onFilterChange }: StatsCardProps) => {
  const { t, language } = useLanguage();
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "Completed").length;
  const inProgress = assignments.filter((a) => a.status === "In Progress").length;
  const notStarted = assignments.filter((a) => a.status === "Not Started").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-8" dir={language === "he" ? "rtl" : "ltr"}>
      <div className="text-center p-2 sm:p-4 bg-gray-100 rounded-lg">
        <div className="text-lg sm:text-2xl font-bold">
          {total}
        </div>
        <div className="text-xs sm:text-sm text-gray-600">{t("total")}</div>
      </div>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("completed")}
        className="text-center p-2 sm:p-4 hover:bg-[#D3E4FD] rounded-lg transition-colors h-auto group data-[state=active]:bg-[#D3E4FD] data-[state=active]:border-2 data-[state=active]:border-[#1EAEDB]"
        data-state="completed"
      >
        <div className="text-lg sm:text-2xl font-bold text-green-500 flex items-center justify-center">
          <CheckCircle className="mr-1 h-4 w-4 sm:h-6 sm:w-6" />
          {completed}
        </div>
        <div className="text-xs sm:text-sm text-gray-600">{t("done")}</div>
      </Button>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("in_progress")}
        className="text-center p-2 sm:p-4 hover:bg-[#D3E4FD] rounded-lg transition-colors h-auto group data-[state=active]:bg-[#D3E4FD] data-[state=active]:border-2 data-[state=active]:border-[#1EAEDB]"
        data-state="in_progress"
      >
        <div className="text-lg sm:text-2xl font-bold text-yellow-500 flex items-center justify-center">
          <Clock className="mr-1 h-4 w-4 sm:h-6 sm:w-6" />
          {inProgress}
        </div>
        <div className="text-xs sm:text-sm text-gray-600">{t("active")}</div>
      </Button>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("not_started")}
        className="text-center p-2 sm:p-4 hover:bg-[#D3E4FD] rounded-lg transition-colors h-auto group data-[state=active]:bg-[#D3E4FD] data-[state=active]:border-2 data-[state=active]:border-[#1EAEDB]"
        data-state="not_started"
      >
        <div className="text-lg sm:text-2xl font-bold text-red-500 flex items-center justify-center">
          <XCircle className="mr-1 h-4 w-4 sm:h-6 sm:w-6" />
          {notStarted}
        </div>
        <div className="text-xs sm:text-sm text-gray-600">{t("new")}</div>
      </Button>
    </div>
  );
};