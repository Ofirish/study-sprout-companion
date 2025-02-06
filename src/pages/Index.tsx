import { useEffect } from "react";
import { Assignment } from "@/types/assignment";
import { AssignmentCard } from "@/components/AssignmentCard";
import { AssignmentForm } from "@/components/AssignmentForm";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut, Circle } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
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

  const filteredAssignments = sortedAssignments.filter(assignment => {
    switch (statusFilter) {
      case "completed":
        return assignment.status === "Completed";
      case "in_progress":
        return assignment.status === "In Progress";
      case "not_started":
        return assignment.status === "Not Started";
      default:
        return true;
    }
  });

  const upcomingAssignments = filteredAssignments.filter(
    (a) => new Date(a.due_date) >= new Date()
  );

  const homeworkAssignments = filteredAssignments.filter(
    (a) => a.type === "homework"
  );

  const testAssignments = filteredAssignments.filter((a) => a.type === "test");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const TabDot = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return (
      <Circle className="w-2 h-2 ml-2 fill-[#ea384c] text-[#ea384c]" />
    );
  };

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

        <StatsCard 
          assignments={assignments} 
          onFilterChange={(filter) => setStatusFilter(filter)}
        />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {statusFilter === "all" 
                ? "All Assignments" 
                : `${statusFilter.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Assignments`}
            </h2>
            <Button onClick={() => setShowForm(!showForm)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {showForm ? "Cancel" : "Add Assignment"}
            </Button>
          </div>

          {showForm && <AssignmentForm onSubmit={handleAddAssignment} />}

          <Tabs defaultValue="upcoming" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming" className="flex items-center">
                Upcoming
                <TabDot show={upcomingAssignments.length > 0} />
              </TabsTrigger>
              <TabsTrigger value="homework" className="flex items-center">
                Homework
                <TabDot show={homeworkAssignments.length > 0} />
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center">
                Tests
                <TabDot show={testAssignments.length > 0} />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-4 space-y-4">
              {upcomingAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No upcoming assignments
                </div>
              ) : (
                upcomingAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="homework" className="mt-4 space-y-4">
              {homeworkAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No homework assignments
                </div>
              ) : (
                homeworkAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="tests" className="mt-4 space-y-4">
              {testAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tests
                </div>
              ) : (
                testAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
