
import { Assignment } from "@/types/assignment";
import { useAuth } from "@/components/AuthProvider";

type ViewMode = "all" | "student" | "parent";
type StatusFilter = "all" | "completed" | "in_progress" | "not_started";

interface FilterOptions {
  hideCompleted: boolean;
  statusFilter: StatusFilter;
  viewMode: ViewMode;
}

export const useFilteredAssignments = (assignments: Assignment[], options: FilterOptions) => {
  const { session } = useAuth();
  const { hideCompleted, statusFilter, viewMode } = options;

  return assignments.filter(assignment => {
    if (hideCompleted && assignment.status === "Completed") {
      return false;
    }
    
    const passesStatusFilter = statusFilter === "all" || 
      (statusFilter === "completed" && assignment.status === "Completed") ||
      (statusFilter === "in_progress" && assignment.status === "In Progress") ||
      (statusFilter === "not_started" && assignment.status === "Not Started");

    if (!passesStatusFilter) return false;

    if (viewMode === "all") return true;
    if (viewMode === "parent" && assignment.user_id === session?.user.id) return true;
    if (viewMode === "student" && assignment.user_id !== session?.user.id) return true;
    
    return false;
  });
};
