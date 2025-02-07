
/**
 * StatsCard.tsx
 * Purpose: Displays assignment statistics and filtering options.
 * Shows counts of assignments by status and provides filtering functionality.
 */
import { Assignment } from "@/types/assignment";
import { CheckCircle, Clock, XCircle, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  assignments: Assignment[];
  onFilterChange: (filter: "all" | "completed" | "in_progress" | "not_started") => void;
  viewMode: "all" | "student" | "parent";
}

export const StatsCard = ({ assignments, onFilterChange, viewMode }: StatsCardProps) => {
  const { t, language } = useLanguage();
  const { session } = useAuth();

  // Filter assignments based on viewMode
  const filteredAssignments = assignments.filter(assignment => {
    if (viewMode === "all") return true;
    if (viewMode === "parent" && assignment.user_id === session?.user.id) return true;
    if (viewMode === "student" && assignment.user_id !== session?.user.id) return true;
    return false;
  });

  const total = filteredAssignments.length;
  const completed = filteredAssignments.filter((a) => a.status === "Completed").length;
  const inProgress = filteredAssignments.filter((a) => a.status === "In Progress").length;
  const notStarted = filteredAssignments.filter((a) => a.status === "Not Started").length;

  const getButtonStyle = (filterValue: "all" | "completed" | "in_progress" | "not_started") => {
    // Get the current filter from the Index component's state
    const searchParams = new URLSearchParams(window.location.search);
    const currentFilter = searchParams.get('filter') || 'all';
    
    return cn(
      "relative flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-all h-auto",
      currentFilter === filterValue && "ring-2 ring-primary ring-offset-2 bg-gray-50"
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 sm:mt-8" dir={language === "he" ? "rtl" : "ltr"}>
      <Button
        variant="ghost"
        onClick={() => onFilterChange("all")}
        className={getButtonStyle("all")}
      >
        <div className="text-xl sm:text-2xl font-bold text-blue-500 flex items-center gap-2">
          <ListFilter className="h-5 w-5 sm:h-6 sm:w-6" />
          {total}
        </div>
        <div className="text-sm text-gray-600 mt-1">{t("total")}</div>
      </Button>

      <Button
        variant="ghost"
        onClick={() => onFilterChange("completed")}
        className={getButtonStyle("completed")}
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
        className={getButtonStyle("in_progress")}
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
        className={getButtonStyle("not_started")}
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
