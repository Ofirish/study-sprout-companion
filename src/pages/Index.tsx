
/**
 * Index.tsx
 * Main dashboard page displaying assignments and filters
 */
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
import { AssignmentAttachments } from "@/components/assignments/AssignmentAttachments";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ViewMode = "all" | "student" | "parent";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [newAssignmentId, setNewAssignmentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const [hideCompleted, setHideCompleted] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [hasStudents, setHasStudents] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const { session } = useAuth();
  const { language } = useLanguage();
  const { funMode, toggleFunMode } = useFunMode();
  const { t } = useLanguage();
  
  useEffect(() => {
    const checkForStudents = async () => {
      if (!session) return;
      
      const { data } = await supabase
        .from("parent_student_relationships")
        .select(`
          student_id,
          student:profiles!parent_student_relationships_student_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq("parent_id", session.user.id);
      
      const studentsData = data?.map(rel => ({
        id: rel.student.id,
        first_name: rel.student.first_name,
        last_name: rel.student.last_name,
      })) || [];
      
      setStudents(studentsData);
      setHasStudents(studentsData.length > 0);
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
    // Filter by completion status
    if (hideCompleted && assignment.status === "Completed") {
      return false;
    }
    
    // Filter by status
    const passesStatusFilter = statusFilter === "all" || 
      (statusFilter === "completed" && assignment.status === "Completed") ||
      (statusFilter === "in_progress" && assignment.status === "In Progress") ||
      (statusFilter === "not_started" && assignment.status === "Not Started");

    if (!passesStatusFilter) return false;

    // Filter by view mode and student
    if (viewMode === "all") return true;
    if (viewMode === "parent") {
      if (selectedStudentId) {
        return assignment.user_id === selectedStudentId;
      }
      return assignment.user_id === session?.user.id;
    }
    if (viewMode === "student") {
      return assignment.user_id !== session?.user.id;
    }
    
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
            viewMode={viewMode}
            statusFilter={statusFilter}
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
              students={students}
              selectedStudentId={selectedStudentId}
              setSelectedStudentId={setSelectedStudentId}
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

      <Dialog open={showAttachmentDialog} onOpenChange={setShowAttachmentDialog}>
        <DialogContent>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">{t("attachments")}</h2>
            {newAssignmentId && (
              <AssignmentAttachments
                assignmentId={newAssignmentId}
                canEdit={true}
              />
            )}
            <Button
              className="w-full mt-4"
              onClick={() => setShowAttachmentDialog(false)}
            >
              {t("done")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
