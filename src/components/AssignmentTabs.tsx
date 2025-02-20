/**
 * AssignmentTabs.tsx
 * Purpose: Organizes assignments into different tabs.
 * Manages the display of assignments by type and status.
 */
import { Assignment } from "@/types/assignment";
import { AssignmentCard } from "@/components/AssignmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAssignments } from "@/hooks/useAssignments";
import { useState } from "react";
import { FallingItems } from "./FallingItems";
import { useFunMode } from "@/contexts/FunModeContext";

interface AssignmentTabsProps {
  assignments: Assignment[];
  onStatusChange: (id: string, status: Assignment["status"]) => void;
}

export const AssignmentTabs = ({ assignments, onStatusChange }: AssignmentTabsProps) => {
  const { t, language } = useLanguage();
  const { deleteAssignmentMutation } = useAssignments();
  const { toast } = useToast();
  const [isTestsFun, setIsTestsFun] = useState(false);
  const { funMode, toggleFunMode } = useFunMode();

  const upcomingAssignments = assignments.filter(
    (a) => new Date(a.due_date) >= new Date()
  );

  const homeworkAssignments = assignments.filter(
    (a) => a.type === "homework"
  );

  const testAssignments = assignments.filter(
    (a) => a.type === "test"
  );

  const hasUpcoming = upcomingAssignments.length > 0;
  const hasHomework = homeworkAssignments.length > 0;
  const hasTests = testAssignments.length > 0;

  const handleTestsDoubleClick = () => {
    setIsTestsFun(!isTestsFun);
    if (!funMode) {
      toggleFunMode();
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Assignment>) => {
    const { error } = await supabase
      .from("assignments")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("success"),
      description: t("assignmentUpdated"),
    });
  };

  const handleDelete = (id: string) => {
    deleteAssignmentMutation.mutate(id);
  };

  const TabDot = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return <Circle className="w-2 h-2 ml-2 fill-[#ea384c] text-[#ea384c] shrink-0" />;
  };

  return (
    <>
      {isTestsFun && <FallingItems />}
      <Tabs defaultValue="upcoming" className="mt-4" dir={language === "he" ? "rtl" : "ltr"}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center justify-center">
            {t("tabUpcoming")}
            <TabDot show={hasUpcoming} />
          </TabsTrigger>
          <TabsTrigger value="homework" className="flex items-center justify-center">
            {t("tabHomework")}
            <TabDot show={hasHomework} />
          </TabsTrigger>
          <TabsTrigger 
            value="tests" 
            className="flex items-center justify-center"
            onDoubleClick={handleTestsDoubleClick}
            onTouchStart={(e) => {
              let touches = 0;
              const timeout = setTimeout(() => touches = 0, 300);
              touches++;
              if (touches === 2) {
                handleTestsDoubleClick();
                clearTimeout(timeout);
                touches = 0;
              }
            }}
          >
            {t("tabTests")}
            <TabDot show={hasTests} />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4 space-y-4">
          {upcomingAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("noUpcoming")}
            </div>
          ) : (
            upcomingAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onStatusChange={onStatusChange}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="homework" className="mt-4 space-y-4">
          {homeworkAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("noHomework")}
            </div>
          ) : (
            homeworkAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onStatusChange={onStatusChange}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="tests" className="mt-4 space-y-4">
          {testAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("noTests")}
            </div>
          ) : (
            testAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onStatusChange={onStatusChange}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};
