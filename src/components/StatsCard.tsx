
/**
 * StatsCard.tsx
 * Purpose: Displays assignment statistics and filtering options
 * 
 * References:
 * - Used by: src/pages/Index.tsx
 * - Uses: 
 *   - src/components/stats/StatButton.tsx
 *   - src/utils/filterUtils.ts
 *   - src/contexts/LanguageContext.tsx
 *   - src/components/AuthProvider.tsx
 */

import { Assignment } from "@/types/assignment";
import { CheckCircle, Clock, XCircle, ListFilter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/AuthProvider";
import { StatButton } from "@/components/stats/StatButton";
import { FilterValue } from "@/utils/filterUtils";

interface StatsCardProps {
  assignments: Assignment[];
  onFilterChange: (filter: FilterValue) => void;
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 sm:mt-8" dir={language === "he" ? "rtl" : "ltr"}>
      <StatButton
        icon={ListFilter}
        count={total}
        label={t("total")}
        filterValue="all"
        onClick={onFilterChange}
        iconColor="text-blue-500"
      />
      
      <StatButton
        icon={CheckCircle}
        count={completed}
        label={t("done")}
        filterValue="completed"
        onClick={onFilterChange}
        iconColor="text-green-500"
      />
      
      <StatButton
        icon={Clock}
        count={inProgress}
        label={t("active")}
        filterValue="in_progress"
        onClick={onFilterChange}
        iconColor="text-yellow-500"
      />
      
      <StatButton
        icon={XCircle}
        count={notStarted}
        label={t("new")}
        filterValue="not_started"
        onClick={onFilterChange}
        iconColor="text-red-500"
      />
    </div>
  );
};
