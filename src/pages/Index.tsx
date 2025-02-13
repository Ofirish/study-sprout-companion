
/**
 * Index.tsx
 * Main dashboard page displaying assignments and filters
 */
import { useState } from "react";
import { Assignment } from "@/types/assignment";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFunMode } from "@/contexts/FunModeContext";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { AttachmentDialog } from "@/components/dashboard/AttachmentDialog";
import { Sparkles } from "@/components/Sparkles";
import { useFilteredAssignments } from "@/hooks/useFilteredAssignments";
import { useDashboardEffects } from "@/hooks/useDashboardEffects";
import { useAssignmentManager } from "@/hooks/useAssignmentManager";

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
  const { funMode } = useFunMode();

  const {
    assignments,
    isLoading,
    handleAddAssignment,
    handleStatusChange,
  } = useAssignmentManager();

  useDashboardEffects({
    session,
    setShowForm,
    setShowFlyingName,
    setHasStudents,
  });

  const filteredAssignments = useFilteredAssignments(assignments, {
    hideCompleted,
    statusFilter,
    viewMode,
  });

  const handleAssignmentSubmit = async (
    newAssignment: Omit<Assignment, "id" | "status">
  ) => {
    const assignmentId = await handleAddAssignment(newAssignment);
    if (assignmentId) {
      setNewAssignmentId(assignmentId);
      setShowAttachmentDialog(true);
    }
    setShowForm(false);
  };

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
        handleAddAssignment={handleAssignmentSubmit}
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
