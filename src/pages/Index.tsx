
/**
 * Index.tsx
 * Main dashboard page displaying assignments and filters
 */
import { useState, useEffect } from "react";
import { Assignment } from "@/types/assignment";
import { useAuth } from "@/components/AuthProvider";
import { useAssignments } from "@/hooks/useAssignments";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFunMode } from "@/contexts/FunModeContext";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { AttachmentDialog } from "@/components/dashboard/AttachmentDialog";
import { Sparkles } from "@/components/Sparkles";

type ViewMode = "all" | "student" | "parent";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [newAssignmentId, setNewAssignmentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const [hideCompleted, setHideCompleted] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [hasStudents, setHasStudents] = useState(false);
  const [showFlyingName, setShowFlyingName] = useState(false);
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

  useEffect(() => {
    const handleStopAllEffects = () => {
      setShowForm(false);
      setShowFlyingName(false);
      if (funMode) {
        toggleFunMode();
      }
    };

    window.addEventListener("stopAllEffects", handleStopAllEffects);
    return () => window.removeEventListener("stopAllEffects", handleStopAllEffects);
  }, [funMode, toggleFunMode]);

  const { 
    assignments = [], 
    isLoading, 
    addAssignmentMutation, 
    updateAssignmentMutation 
  } = useAssignments();

  const handleAddAssignment = async (
    newAssignment: Omit<Assignment, "id" | "status">
  ) => {
    try {
      const result = await addAssignmentMutation.mutateAsync(newAssignment);
      if (result?.id) {
        setNewAssignmentId(result.id);
        setShowAttachmentDialog(true);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
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
    return <DashboardLoading />;
  }

  const containerClasses = `min-h-screen py-8 transition-all duration-500 bg-background ${
    funMode ? 'fun-mode' : ''
  }`;

  return (
    <div className={containerClasses} dir={language === "he" ? "rtl" : "ltr"}>
      {funMode && <Sparkles />}
      <DashboardContent
        assignments={assignments}
        showFlyingName={showFlyingName}
        setShowFlyingName={setShowFlyingName}
        showForm={showForm}
        setShowForm={setShowForm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        hideCompleted={hideCompleted}
        setHideCompleted={setHideCompleted}
        hasStudents={hasStudents}
        funMode={funMode}
        filteredAssignments={filteredAssignments}
        handleAddAssignment={handleAddAssignment}
        handleStatusChange={handleStatusChange}
        language={language}
      />

      <AttachmentDialog
        open={showAttachmentDialog}
        onOpenChange={setShowAttachmentDialog}
        assignmentId={newAssignmentId}
      />
    </div>
  );
};

export default Index;
