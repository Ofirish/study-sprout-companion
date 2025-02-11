
/**
 * useAssignments.ts
 * Purpose: Custom hook for managing assignments data.
 * Handles CRUD operations for assignments using Supabase.
 */
import { Assignment } from "@/types/assignment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface StudentAssignment extends Assignment {
  student?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export const useAssignments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch assignments
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      try {
        // First get the current user's direct assignments
        const { data: userAssignments, error: userError } = await supabase
          .from("assignments")
          .select("*")
          .order("created_at", { ascending: false });

        if (userError) throw userError;

        // Then get student IDs connected to the parent
        const { data: relationships, error: relError } = await supabase
          .from("parent_student_relationships")
          .select(`
            student_id,
            student:profiles!parent_student_relationships_student_id_fkey (
              id,
              first_name,
              last_name
            )
          `);

        if (relError) throw relError;

        // If there are connected students, get their assignments
        let studentAssignments: StudentAssignment[] = [];
        if (relationships && relationships.length > 0) {
          const studentIds = relationships.map(rel => rel.student_id);
          const { data: studentsData, error: studentsError } = await supabase
            .from("assignments")
            .select(`
              *,
              student:profiles!inner (
                id,
                first_name,
                last_name
              )
            `)
            .in("user_id", studentIds)
            .order("created_at", { ascending: false });

          if (studentsError) throw studentsError;
          studentAssignments = studentsData?.map(assignment => ({
            ...assignment,
            student: assignment.student
          })) || [];
        }

        // Combine assignments and remove duplicates based on id
        const allAssignments = [...(userAssignments || []), ...studentAssignments];
        const uniqueAssignments = allAssignments.reduce((acc: StudentAssignment[], current) => {
          const exists = acc.find(item => item.id === current.id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Sort by created_at in descending order
        return uniqueAssignments.sort((a, b) => {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }) as StudentAssignment[];
      } catch (error: any) {
        console.error("Error fetching assignments:", error);
        toast({
          title: "Error",
          description: "Failed to fetch assignments",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  // Add new assignment
  const addAssignmentMutation = useMutation({
    mutationFn: async (newAssignment: Omit<Assignment, "id" | "status">) => {
      try {
        const { data, error } = await supabase
          .from("assignments")
          .insert([{ ...newAssignment, status: "Not Started" }])
          .select()
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Failed to create assignment");
        
        return data;
      } catch (error: any) {
        console.error("Error adding assignment:", error);
        throw new Error(error.message || "Failed to add assignment");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({
        title: "Success",
        description: "Assignment added successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update assignment status
  const updateAssignmentMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Assignment["status"];
    }) => {
      try {
        const { data, error } = await supabase
          .from("assignments")
          .update({ status })
          .eq("id", id)
          .select()
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Assignment not found");
        
        return data;
      } catch (error: any) {
        console.error("Error updating assignment:", error);
        throw new Error(error.message || "Failed to update assignment");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({
        title: "Success",
        description: "Assignment updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete assignment
  const deleteAssignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from("assignments")
          .delete()
          .eq("id", id);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error deleting assignment:", error);
        throw new Error(error.message || "Failed to delete assignment");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({
        title: "Success",
        description: "Assignment deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    assignments,
    isLoading,
    addAssignmentMutation,
    updateAssignmentMutation,
    deleteAssignmentMutation,
  };
};
