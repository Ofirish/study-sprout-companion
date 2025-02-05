import { Card } from "@/components/ui/card";
import { Assignment } from "@/types/assignment";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface StatsCardProps {
  assignments: Assignment[];
}

export const StatsCard = ({ assignments }: StatsCardProps) => {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "Completed").length;
  const inProgress = assignments.filter((a) => a.status === "In Progress").length;
  const notStarted = assignments.filter((a) => a.status === "Not Started").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Progress Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500 flex items-center justify-center">
            <CheckCircle className="mr-1 h-6 w-6" />
            {completed}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center">
            <Clock className="mr-1 h-6 w-6" />
            {inProgress}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500 flex items-center justify-center">
            <XCircle className="mr-1 h-6 w-6" />
            {notStarted}
          </div>
          <div className="text-sm text-gray-600">Not Started</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {completionRate}% Complete
        </div>
      </div>
    </Card>
  );
};