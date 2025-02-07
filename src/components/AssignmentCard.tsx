
/**
 * AssignmentCard.tsx
 * Purpose: Displays an individual assignment with its details and actions
 */
import { Assignment } from "@/types/assignment";
import { Card } from "@/components/ui/card";
import { User, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { EditAssignmentDialog } from "./EditAssignmentDialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { AssignmentHeader } from "./assignments/AssignmentHeader";
import { AssignmentStatus } from "./assignments/AssignmentStatus";
import { AssignmentDueDate } from "./assignments/AssignmentDueDate";
import { AssignmentAttachments } from "./assignments/AssignmentAttachments";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Profile {
  first_name: string;
  last_name: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onStatusChange: (id: string, status: Assignment["status"]) => void;
  onUpdate?: (id: string, updates: Partial<Assignment>) => void;
  onDelete?: (id: string) => void;
}

export const AssignmentCard = ({
  assignment,
  onStatusChange,
  onUpdate,
  onDelete,
}: AssignmentCardProps) => {
  const { t, language } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  const [studentProfile, setStudentProfile] = useState<Profile | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!session || assignment.user_id === session.user.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", assignment.user_id)
        .single();

      if (!error && data) {
        setStudentProfile(data);
      }
    };

    fetchStudentProfile();
  }, [assignment.user_id, session]);

  const handleEdit = async (updates: Partial<Assignment>) => {
    if (!session || assignment.user_id !== session.user.id) {
      toast({
        title: t("error"),
        description: t("notAuthorized"),
        variant: "destructive",
      });
      return;
    }

    if (onUpdate) {
      onUpdate(assignment.id, updates);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(assignment.id);
    }
  };

  const canEdit = session?.user.id === assignment.user_id;

  const DeleteButton = () => (
    canEdit && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );

  return (
    <>
      <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
        <div dir={language === "he" ? "rtl" : "ltr"}>
          <AssignmentHeader
            assignment={assignment}
            canEdit={canEdit}
            onEditClick={() => setShowEditDialog(true)}
          />
          
          <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2">
            {assignment.description}
          </p>
          
          {studentProfile && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>{studentProfile.first_name} {studentProfile.last_name}</span>
            </div>
          )}
          
          <AssignmentAttachments
            assignmentId={assignment.id}
            canEdit={canEdit}
          />
          
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              {language === "he" ? (
                <>
                  <AssignmentDueDate dueDate={assignment.due_date} />
                  <DeleteButton />
                </>
              ) : (
                <>
                  <DeleteButton />
                  <AssignmentDueDate dueDate={assignment.due_date} />
                </>
              )}
            </div>
            <AssignmentStatus
              status={assignment.status}
              onStatusChange={(status) => onStatusChange(assignment.id, status)}
            />
          </div>
        </div>
      </Card>

      <EditAssignmentDialog
        assignment={assignment}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleEdit}
      />
    </>
  );
};
