import { useEffect } from "react";
import { Assignment } from "@/types/assignment";
import { AssignmentCard } from "@/components/AssignmentCard";
import { AssignmentForm } from "@/components/AssignmentForm";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      setShowForm(false);
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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddAssignment = (
    newAssignment: Omit<Assignment, "id" | "status">
  ) => {
    addAssignmentMutation.mutate(newAssignment);
  };

  const handleStatusChange = (id: string, status: Assignment["status"]) => {
    updateAssignmentMutation.mutate({ id, status });
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.status === "Not Started" && b.status !== "Not Started") return -1;
    if (a.status !== "Not Started" && b.status === "Not Started") return 1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Homework Tracker
            </h1>
            <p className="text-gray-600">
              Keep track of all your assignments and tests in one place
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <StatsCard assignments={assignments} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
            <Button onClick={() => setShowForm(!showForm)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {showForm ? "Cancel" : "Add Assignment"}
            </Button>
          </div>

          {showForm && <AssignmentForm onSubmit={handleAddAssignment} />}

          <div className="mt-4 space-y-4">
            {sortedAssignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No assignments yet. Add your first one!
              </div>
            ) : (
              sortedAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
