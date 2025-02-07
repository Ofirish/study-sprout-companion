
/**
 * filterUtils.ts
 * Purpose: Contains utility functions for filtering assignments
 * 
 * Used by:
 * - src/components/StatsCard.tsx (for filter styling and assignment filtering)
 * - src/pages/Index.tsx (for filtering assignments)
 */

import { Assignment } from "@/types/assignment";
import { cn } from "@/lib/utils";

export type FilterValue = "all" | "completed" | "in_progress" | "not_started";

export const getFilterFromUrl = (): FilterValue => {
  const searchParams = new URLSearchParams(window.location.search);
  return (searchParams.get('filter') as FilterValue) || 'all';
};

export const getFilterButtonStyle = (filterValue: FilterValue) => {
  const currentFilter = getFilterFromUrl();
  
  return cn(
    "relative flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded-lg transition-all h-auto",
    currentFilter === filterValue && [
      "ring-2 ring-primary ring-offset-2",
      "bg-primary/5",
      "shadow-sm",
      "transform scale-[1.02]"
    ]
  );
};

export const filterAssignmentsByStatus = (assignments: Assignment[], status: FilterValue) => {
  switch (status) {
    case "completed":
      return assignments.filter(a => a.status === "Completed");
    case "in_progress":
      return assignments.filter(a => a.status === "In Progress");
    case "not_started":
      return assignments.filter(a => a.status === "Not Started");
    default:
      return assignments;
  }
};
