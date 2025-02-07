
/**
 * useAssignments.ts
 * Purpose: Custom hook for managing assignments data.
 * Handles CRUD operations for assignments using Supabase.
 */
import { Assignment } from "@/types/assignment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
          .select("student_id");

        if (relError) throw relError;

        // If there are connected students, get their assignments
        let studentAssignments: any[] = [];
        if (relationships && relationships.length > 0) {
          const studentIds = relationships.map(rel => rel.student_id);
          const { data: studentsData, error: studentsError } = await supabase
            .from("assignments")
            .select("*")
            .in("user_id", studentIds)
            .order("created_at", { ascending: false });

          if (studentsError) throw studentsError;
          studentAssignments = studentsData || [];
        }

        // Combine and return all assignments
        return [...(userAssignments || []), ...studentAssignments] as Assignment[];
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
    mutationFn: async (newAssignment: Omit<Assignment, "id" | "status" | "archived">) => {
      try {
        const { data, error } = await supabase
          .from("assignments")
          .insert([{ ...newAssignment, status: "Not Started", archived: false }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error("Error adding assignment:", error);
        toast({
          title: "Error",
          description: "Failed to add assignment",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({
        title: "Success",
        description: "Assignment added successfully",
      });
    },
  });

  // Update assignment
  const updateAssignmentMutation = useMutation({
    mutationFn: async (updates: Partial<Assignment> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from("assignments")
          .update(updates)
          .eq("id", updates.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error("Error updating assignment:", error);
        toast({
          title: "Error",
          description: "Failed to update assignment",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({
        title: "Success",
        description: "Assignment updated successfully",
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
        toast({
          title: "Error",
          description: "Failed to delete assignment",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({
        title: "Success",
        description: "Assignment deleted successfully",
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
