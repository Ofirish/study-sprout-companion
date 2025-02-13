
import { Assignment } from "@/types/assignment";
import { AssignmentForm } from "@/components/AssignmentForm";
import { StatsCard } from "@/components/StatsCard";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AssignmentTabs } from "@/components/AssignmentTabs";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { LastActivityTimer } from "@/components/dashboard/LastActivityTimer";
import { Sparkles } from "@/components/Sparkles";

interface DashboardContentProps {
  assignments: Assignment[];
  showFlyingName: boolean;
  setShowFlyingName: (show: boolean) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  statusFilter: "all" | "completed" | "in_progress" | "not_started";
  setStatusFilter: (filter: "all" | "completed" | "in_progress" | "not_started") => void;
  viewMode: "all" | "student" | "parent";
  setViewMode: (mode: "all" | "student" | "parent") => void;
  hideCompleted: boolean;
  setHideCompleted: (hide: boolean) => void;
  hasStudents: boolean;
  funMode: boolean;
  filteredAssignments: Assignment[];
  handleAddAssignment: (assignment: Omit<Assignment, "id" | "status">) => void;
  handleStatusChange: (id: string, status: Assignment["status"]) => void;
  language: string;
}

export const DashboardContent = ({
  assignments,
  showFlyingName,
  setShowFlyingName,
  showForm,
  setShowForm,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  hideCompleted,
  setHideCompleted,
  hasStudents,
  funMode,
  filteredAssignments,
  handleAddAssignment,
  handleStatusChange,
  language,
}: DashboardContentProps) => {
  return (
    <div className="container max-w-4xl flex flex-col min-h-screen">
      <div className="flex-grow">
        <DashboardHeader 
          showFlyingName={showFlyingName}
          setShowFlyingName={setShowFlyingName}
        />

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
        <LastActivityTimer 
          assignments={assignments}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};
