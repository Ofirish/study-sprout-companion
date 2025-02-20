
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

interface StatsCardProps {
  assignments: Assignment[];
  onFilterChange: (filter: "all" | "completed" | "in_progress" | "not_started") => void;
  viewMode: "all" | "student" | "parent";
  statusFilter: "all" | "completed" | "in_progress" | "not_started";
}

export const StatsCard = ({ assignments, onFilterChange, viewMode, statusFilter }: StatsCardProps) => {
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

  // Handle click on total button to stop all effects
  const handleTotalClick = () => {
    // First trigger the filter change
    onFilterChange("all");
    
    // Then dispatch a custom event to stop all effects
    const event = new CustomEvent("stopAllEffects");
    window.dispatchEvent(event);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 sm:mt-8" dir={language === "he" ? "rtl" : "ltr"}>
      <Button
        variant="ghost"
        onClick={handleTotalClick}
        className={`relative flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-all h-auto ${
          statusFilter === 'all' ? 'ring-2 ring-[#0EA5E9] ring-offset-2 shadow-[0_0_25px_rgba(46,204,113,0.5)]' : 'shadow hover:shadow-md'
        }`}
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
        className={`relative flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-all h-auto ${
          statusFilter === 'completed' ? 'ring-2 ring-[#0EA5E9] ring-offset-2 shadow-[0_0_25px_rgba(46,204,113,0.5)]' : 'shadow hover:shadow-md'
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
          statusFilter === 'in_progress' ? 'ring-2 ring-[#0EA5E9] ring-offset-2 shadow-[0_0_25px_rgba(46,204,113,0.5)]' : 'shadow hover:shadow-md'
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
          statusFilter === 'not_started' ? 'ring-2 ring-[#0EA5E9] ring-offset-2 shadow-[0_0_25px_rgba(46,204,113,0.5)]' : 'shadow hover:shadow-md'
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
