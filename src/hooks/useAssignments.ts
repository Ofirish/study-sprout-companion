/**
 * useAssignments.ts
 * Purpose: Custom hook for managing assignments data.
 * Handles CRUD operations for assignments using Supabase.
 */
import { Assignment } from "@/types/assignment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAssignments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch assignments
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Assignment[];
    },
  });

  // Add new assignment
  const addAssignmentMutation = useMutation({
    mutationFn: async (newAssignment: Omit<Assignment, "id" | "status">) => {
      const { data, error } = await supabase
        .from("assignments")
        .insert([{ ...newAssignment, status: "Not Started" }])
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from("assignments")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
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
  };
};