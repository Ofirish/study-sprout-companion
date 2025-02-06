
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 sm:mt-8" dir={language === "he" ? "rtl" : "ltr"}>
      <Button
        variant="ghost"
        onClick={() => onFilterChange("all")}
        className="text-center p-4 bg-gray-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="text-xl sm:text-2xl font-bold">
          {total}
        </div>
        <div className="text-sm text-gray-600 mt-1">{t("total")}</div>
      </Button>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("completed")}
        className={`relative flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-all h-auto ${
          currentFilter === 'completed' ? 'ring-2 ring-[#0EA5E9] ring-offset-2 shadow-[0_0_25px_rgba(46,204,113,0.5)]' : 'shadow hover:shadow-md'
        }`}
      >
        <div className="text-xl sm:text-2xl font-bold text-green-500 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          {completed}
        </div>
        <div className="text-sm text-gray-600 mt-1">{t("done")}</div>
      </Button>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("in_progress")}
        className={`relative flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-all h-auto ${
          currentFilter === 'in_progress' ? 'ring-2 ring-[#0EA5E9] ring-offset-2 shadow-[0_0_25px_rgba(46,204,113,0.5)]' : 'shadow hover:shadow-md'
        }`}
      >
        <div className="text-xl sm:text-2xl font-bold text-yellow-500 flex items-center gap-2">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
          {inProgress}
        </div>
        <div className="text-sm text-gray-600 mt-1">{t("active")}</div>
      </Button>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("not_started")}
        className={`relative flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-all h-auto ${
          currentFilter === 'not_started' ? 'ring-2 ring-[#0EA5E9] ring-offset-2 shadow-[0_0_25px_rgba(46,204,113,0.5)]' : 'shadow hover:shadow-md'
        }`}
      >
        <div className="text-xl sm:text-2xl font-bold text-red-500 flex items-center gap-2">
          <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          {notStarted}
        </div>
        <div className="text-sm text-gray-600 mt-1">{t("new")}</div>
      </Button>
    </div>
  );
};
