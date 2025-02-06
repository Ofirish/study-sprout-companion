/**
 * Index.tsx
 * Purpose: Main dashboard page displaying assignments and controls.
 * Shows assignment stats, filtering options, and assignment list.
 */
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const [hideCompleted, setHideCompleted] = useState(false);
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
    if (hideCompleted && assignment.status === "Completed") {
      return false;
    }
    
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
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

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="hide-completed"
                checked={hideCompleted}
                onCheckedChange={setHideCompleted}
              />
              <Label htmlFor="hide-completed" className="text-sm">
                {t("hideCompleted")}
              </Label>
            </div>
            
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