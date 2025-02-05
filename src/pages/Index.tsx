import { useState } from "react";
import { Assignment } from "@/types/assignment";
import { AssignmentCard } from "@/components/AssignmentCard";
import { AssignmentForm } from "@/components/AssignmentForm";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddAssignment = (
    newAssignment: Omit<Assignment, "id" | "status">
  ) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: Date.now().toString(),
      status: "Not Started",
    };
    setAssignments([...assignments, assignment]);
    setShowForm(false);
  };

  const handleStatusChange = (id: string, status: Assignment["status"]) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id ? { ...assignment, status } : assignment
      )
    );
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.status === "Not Started" && b.status !== "Not Started") return -1;
    if (a.status !== "Not Started" && b.status === "Not Started") return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Homework Tracker
          </h1>
          <p className="text-gray-600">
            Keep track of all your assignments and tests in one place
          </p>
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