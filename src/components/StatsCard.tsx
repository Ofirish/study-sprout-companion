import { Card } from "@/components/ui/card";
import { Assignment } from "@/types/assignment";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  assignments: Assignment[];
  onFilterChange: (filter: "all" | "completed" | "in_progress" | "not_started") => void;
}

export const StatsCard = ({ assignments, onFilterChange }: StatsCardProps) => {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "Completed").length;
  const inProgress = assignments.filter((a) => a.status === "In Progress").length;
  const notStarted = assignments.filter((a) => a.status === "Not Started").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Progress Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <Button
          variant="ghost"
          onClick={() => onFilterChange("all")}
          className="text-center p-2 sm:p-4 hover:bg-gray-100 rounded-lg transition-colors h-auto"
        >
          <div className="text-xl sm:text-2xl font-bold text-primary">{total}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total</div>
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => onFilterChange("completed")}
          className="text-center p-2 sm:p-4 hover:bg-gray-100 rounded-lg transition-colors h-auto"
        >
          <div className="text-xl sm:text-2xl font-bold text-green-500 flex items-center justify-center">
            <CheckCircle className="mr-1 h-4 w-4 sm:h-6 sm:w-6" />
            {completed}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Completed</div>
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => onFilterChange("in_progress")}
          className="text-center p-2 sm:p-4 hover:bg-gray-100 rounded-lg transition-colors h-auto"
        >
          <div className="text-xl sm:text-2xl font-bold text-yellow-500 flex items-center justify-center">
            <Clock className="mr-1 h-4 w-4 sm:h-6 sm:w-6" />
            {inProgress}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">In Progress</div>
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => onFilterChange("not_started")}
          className="text-center p-2 sm:p-4 hover:bg-gray-100 rounded-lg transition-colors h-auto"
        >
          <div className="text-xl sm:text-2xl font-bold text-red-500 flex items-center justify-center">
            <XCircle className="mr-1 h-4 w-4 sm:h-6 sm:w-6" />
            {notStarted}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Not Started</div>
        </Button>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="text-center mt-2 text-xs sm:text-sm text-gray-600">
          {completionRate}% Complete
        </div>
      </div>
    </Card>
  );
};