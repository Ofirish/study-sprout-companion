import { Assignment } from "@/types/assignment";
import { SubjectBadge } from "../SubjectBadge";
import { FileText, GraduationCap, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssignmentHeaderProps {
  assignment: Assignment;
  canEdit: boolean;
  onEditClick: () => void;
}

export const AssignmentHeader = ({ assignment, canEdit, onEditClick }: AssignmentHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
      <div className="flex items-center space-x-2">
        {assignment.type === "homework" ? (
          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
        ) : (
          <GraduationCap className="h-5 w-5 text-accent flex-shrink-0" />
        )}
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{assignment.title}</h3>
      </div>
      <div className="flex items-center gap-2">
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditClick}
            className="p-1"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <SubjectBadge subject={assignment.subject} />
      </div>
    </div>
  );
};