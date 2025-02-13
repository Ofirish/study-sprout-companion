
import { Assignment } from "@/types/assignment";
import { useAssignments } from "@/hooks/useAssignments";

interface AssignmentManagerResult {
  assignments: Assignment[];
  isLoading: boolean;
  handleAddAssignment: (newAssignment: Omit<Assignment, "id" | "status">) => Promise<string | undefined>;
  handleStatusChange: (id: string, status: Assignment["status"]) => void;
}

export const useAssignmentManager = (): AssignmentManagerResult => {
  const { 
    assignments = [], 
    isLoading, 
    addAssignmentMutation, 
    updateAssignmentMutation 
  } = useAssignments();

  const handleAddAssignment = async (
    newAssignment: Omit<Assignment, "id" | "status">
  ): Promise<string | undefined> => {
    try {
      const result = await addAssignmentMutation.mutateAsync(newAssignment);
      return result?.id;
    } catch (error) {
      console.error("Error adding assignment:", error);
      return undefined;
    }
  };

  const handleStatusChange = (id: string, status: Assignment["status"]) => {
    updateAssignmentMutation.mutate({ id, status });
  };

  return {
    assignments,
    isLoading,
    handleAddAssignment,
    handleStatusChange,
  };
};
