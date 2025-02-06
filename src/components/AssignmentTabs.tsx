import { Assignment } from "@/types/assignment";
import { AssignmentCard } from "@/components/AssignmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle } from "lucide-react";

interface AssignmentTabsProps {
  assignments: Assignment[];
  onStatusChange: (id: string, status: Assignment["status"]) => void;
}

const TabDot = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return <Circle className="w-2 h-2 ml-2 fill-[#ea384c] text-[#ea384c] shrink-0" />;
};

export const AssignmentTabs = ({ assignments, onStatusChange }: AssignmentTabsProps) => {
  const upcomingAssignments = assignments.filter(
    (a) => new Date(a.due_date) >= new Date()
  );

  const homeworkAssignments = assignments.filter(
    (a) => a.type === "homework"
  );

  const testAssignments = assignments.filter((a) => a.type === "test");

  const hasUpcoming = upcomingAssignments.length > 0;
  const hasHomework = homeworkAssignments.length > 0;
  const hasTests = testAssignments.length > 0;

  return (
    <Tabs defaultValue="upcoming" className="mt-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming" className="flex items-center justify-center">
          Upcoming
          <TabDot show={hasUpcoming} />
        </TabsTrigger>
        <TabsTrigger value="homework" className="flex items-center justify-center">
          Homework
          <TabDot show={hasHomework} />
        </TabsTrigger>
        <TabsTrigger value="tests" className="flex items-center justify-center">
          Tests
          <TabDot show={hasTests} />
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="mt-4 space-y-4">
        {upcomingAssignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming assignments
          </div>
        ) : (
          upcomingAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="homework" className="mt-4 space-y-4">
        {homeworkAssignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No homework assignments
          </div>
        ) : (
          homeworkAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="tests" className="mt-4 space-y-4">
        {testAssignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tests
          </div>
        ) : (
          testAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};