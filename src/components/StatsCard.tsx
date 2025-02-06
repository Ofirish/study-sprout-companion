
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

  // Get the current filter from the URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const currentFilter = urlParams.get('filter') || 'all';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 sm:mt-8 px-2 sm:px-0" dir={language === "he" ? "rtl" : "ltr"}>
      <div className="text-center p-4 bg-gray-100 rounded-lg shadow-sm">
        <div className="text-2xl font-bold">
          {total}
        </div>
        <div className="text-sm text-gray-600">{t("total")}</div>
      </div>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("completed")}
        className={`flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-colors h-auto shadow-sm ${
          currentFilter === 'completed' ? 'border-2 border-[#0EA5E9]' : ''
        }`}
      >
        <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
          <CheckCircle className="h-6 w-6" />
          {completed}
        </div>
        <div className="text-sm text-gray-600">{t("done")}</div>
      </Button>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("in_progress")}
        className={`flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-colors h-auto shadow-sm ${
          currentFilter === 'in_progress' ? 'border-2 border-[#0EA5E9]' : ''
        }`}
      >
        <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
          <Clock className="h-6 w-6" />
          {inProgress}
        </div>
        <div className="text-sm text-gray-600">{t("active")}</div>
      </Button>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("not_started")}
        className={`flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-colors h-auto shadow-sm ${
          currentFilter === 'not_started' ? 'border-2 border-[#0EA5E9]' : ''
        }`}
      >
        <div className="text-2xl font-bold text-red-500 flex items-center gap-2">
          <XCircle className="h-6 w-6" />
          {notStarted}
        </div>
        <div className="text-sm text-gray-600">{t("new")}</div>
      </Button>
    </div>
  );
};
