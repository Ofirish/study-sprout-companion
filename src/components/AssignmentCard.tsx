import { Assignment } from "@/types/assignment";
import { SubjectBadge } from "./SubjectBadge";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, GraduationCap } from "lucide-react";
import { format } from "date-fns";

interface AssignmentCardProps {
  assignment: Assignment;
  onStatusChange: (id: string, status: Assignment["status"]) => void;
}

export const AssignmentCard = ({
  assignment,
  onStatusChange,
}: AssignmentCardProps) => {
  const statusColors = {
    "Not Started": "text-red-500",
    "In Progress": "text-yellow-500",
    Completed: "text-green-500",
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {assignment.type === "homework" ? (
            <FileText className="h-5 w-5 text-primary" />
          ) : (
            <GraduationCap className="h-5 w-5 text-accent" />
          )}
          <h3 className="font-semibold">{assignment.title}</h3>
        </div>
        <SubjectBadge subject={assignment.subject} />
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{assignment.description}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Due {format(assignment.dueDate, "MMM d, yyyy")}
          </span>
        </div>
        
        <select
          value={assignment.status}
          onChange={(e) => onStatusChange(assignment.id, e.target.value as Assignment["status"])}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            statusColors[assignment.status]
          } border-2 border-current`}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </Card>
  );
};