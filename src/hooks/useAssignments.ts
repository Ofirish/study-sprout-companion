import { Assignment } from "@/types/assignment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const useAssignments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  // Fetch assignments for user and related students
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data: relationships, error: relationshipsError } = await supabase
        .from("parent_student_relationships")
        .select("student_id")
        .eq("parent_id", session.user.id);

      if (relationshipsError) throw relationshipsError;

      const studentIds = relationships?.map(r => r.student_id) || [];
      const userIds = [session.user.id, ...studentIds];

      const { data, error } = await supabase
        .from("assignments")
        .select("*, profiles!assignments_user_id_fkey (first_name, last_name)")
        .in("user_id", userIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map(assignment => ({
        ...assignment,
        profiles: assignment.profiles || { first_name: "", last_name: "" }
      })) as (Assignment & { profiles: { first_name: string; last_name: string } })[];
    },
  });

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
