
import { Assignment } from "@/types/assignment";
import { useAssignments } from "@/hooks/useAssignments";
import { useState } from "react";

interface AssignmentManagerResult {
  assignments: Assignment[];
  isLoading: boolean;
  handleAddAssignment: (newAssignment: Omit<Assignment, "id" | "status">) => Promise<string | undefined>;
  handleStatusChange: (id: string, status: Assignment["status"]) => void;
  showConfetti: boolean;
  setShowConfetti: (show: boolean) => void;
}

export const useAssignmentManager = (): AssignmentManagerResult => {
  const { 
    assignments = [], 
    isLoading, 
    addAssignmentMutation, 
    updateAssignmentMutation 
  } = useAssignments();
  const [showConfetti, setShowConfetti] = useState(false);

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
    if (status === "Completed") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return {
    assignments,
    isLoading,
    handleAddAssignment,
    handleStatusChange,
    showConfetti,
    setShowConfetti,
  };
};
