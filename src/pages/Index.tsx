import { useState } from "react";
import { Assignment } from "@/types/assignment";
import { AssignmentForm } from "@/components/AssignmentForm";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AssignmentTabs } from "@/components/AssignmentTabs";
import { useAssignments } from "@/hooks/useAssignments";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const { session } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const { 
    assignments = [], 
    isLoading, 
    addAssignmentMutation, 
    updateAssignmentMutation 
  } = useAssignments();

  const handleAddAssignment = (
    newAssignment: Omit<Assignment, "id" | "status">
  ) => {
    addAssignmentMutation.mutate(newAssignment);
    setShowForm(false);
  };

  const handleStatusChange = (id: string, status: Assignment["status"]) => {
    updateAssignmentMutation.mutate({ id, status });
  };

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

  const filteredAssignments = assignments.filter(assignment => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={language === "he" ? "rtl" : "ltr"}>
      <div className="container max-w-4xl">
        <DashboardHeader />

        <StatsCard 
          assignments={assignments} 
          onFilterChange={setStatusFilter}
        />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              onClick={() => setStatusFilter("all")}
              size="sm"
              className={`text-sm ${statusFilter === "all" ? "bg-primary text-white hover:bg-primary/90" : ""}`}
            >
              {t("showAll")}
            </Button>
            <Button 
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className="w-auto text-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {showForm ? t("cancel") : t("addAssignment")}
            </Button>
          </div>

          {showForm && <AssignmentForm onSubmit={handleAddAssignment} />}

          <AssignmentTabs
            assignments={filteredAssignments}
            onStatusChange={handleStatusChange}
          />

          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              size="sm"
              className="w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("signOut")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;