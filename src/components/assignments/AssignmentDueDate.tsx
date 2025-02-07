import { Clock } from "lucide-react";
import { format } from "date-fns";

interface AssignmentDueDateProps {
  dueDate: string | Date;
}

export const AssignmentDueDate = ({ dueDate }: AssignmentDueDateProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-4 w-4 text-gray-400" />
      <span className="text-xs sm:text-sm text-gray-600">
        Due {format(new Date(dueDate), "MMM d, yyyy")}
      </span>
    </div>
  );
};