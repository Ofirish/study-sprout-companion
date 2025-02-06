
import { useState, useEffect } from "react";
import { Assignment } from "@/types/assignment";
import { AssignmentForm } from "@/components/AssignmentForm";
import { StatsCard } from "@/components/StatsCard";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AssignmentTabs } from "@/components/AssignmentTabs";
import { useAssignments } from "@/hooks/useAssignments";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFunMode } from "@/contexts/FunModeContext";
import { Sparkles } from "@/components/Sparkles";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

type ViewMode = "all" | "student" | "parent";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [hasStudents, setHasStudents] = useState(false);
  const { session } = useAuth();
  const { language } = useLanguage();
  const { funMode, toggleFunMode } = useFunMode();
  
  useEffect(() => {
    const checkForStudents = async () => {
      if (!session) return;
      
      const { data } = await supabase
        .from("parent_student_relationships")
        .select("*")
        .eq("parent_id", session.user.id);
      
      setHasStudents(data && data.length > 0);
    };
    
    checkForStudents();
  }, [session]);

  useEffect(() => {
    const handleHomeworkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.textContent?.toLowerCase() || '';
      if (text.includes('homework')) {
        toggleFunMode();
      }
    };

    document.addEventListener('dblclick', handleHomeworkClick);
    return () => document.removeEventListener('dblclick', handleHomeworkClick);
  }, [toggleFunMode]);

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

  const filteredAssignments = assignments.filter(assignment => {
    if (hideCompleted && assignment.status === "Completed") {
      return false;
    }
    
    const passesStatusFilter = statusFilter === "all" || 
      (statusFilter === "completed" && assignment.status === "Completed") ||
      (statusFilter === "in_progress" && assignment.status === "In Progress") ||
      (statusFilter === "not_started" && assignment.status === "Not Started");

    if (!passesStatusFilter) return false;

    if (viewMode === "all") return true;
    if (viewMode === "parent" && assignment.user_id === session?.user.id) return true;
    if (viewMode === "student" && assignment.user_id !== session?.user.id) return true;
    
    return false;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const containerClasses = `min-h-screen py-8 transition-all duration-500 ${
    funMode ? 'fun-mode' : 'bg-gray-50'
  }`;

  return (
    <div className={containerClasses} dir={language === "he" ? "rtl" : "ltr"}>
      {funMode && <Sparkles />}
      <div className="container max-w-4xl flex flex-col min-h-screen">
        <div className="flex-grow">
          <DashboardHeader />

          <StatsCard 
            assignments={assignments} 
            onFilterChange={setStatusFilter}
          />

          <div className="mt-8">
            <DashboardActions 
              showForm={showForm}
              setShowForm={setShowForm}
            />

            <DashboardFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
              hideCompleted={hideCompleted}
              setHideCompleted={setHideCompleted}
              hasStudents={hasStudents}
              funMode={funMode}
            />

            {showForm && <AssignmentForm onSubmit={handleAddAssignment} />}

            <AssignmentTabs
              assignments={filteredAssignments}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        <div className="mt-8 border-t pt-4">
          <DashboardFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            hideCompleted={hideCompleted}
            setHideCompleted={setHideCompleted}
            hasStudents={hasStudents}
            funMode={funMode}
            showOnlyBottomControls={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
