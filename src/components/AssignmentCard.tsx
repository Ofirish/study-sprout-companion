
/**
 * AssignmentCard.tsx
 * Purpose: Displays an individual assignment with its details and actions
 * 
 * References:
 * - Used by: src/components/AssignmentTabs.tsx
 * - Uses:
 *   - src/components/assignments/DeleteButton.tsx
 *   - src/components/assignments/ArchiveButton.tsx
 *   - src/components/assignments/StudentInfo.tsx
 *   - src/components/assignments/AssignmentHeader.tsx
 *   - src/components/assignments/AssignmentStatus.tsx
 *   - src/components/assignments/AssignmentDueDate.tsx
 *   - src/components/assignments/AssignmentAttachments.tsx
 */
import { Assignment } from "@/types/assignment";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { EditAssignmentDialog } from "./EditAssignmentDialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { AssignmentHeader } from "./assignments/AssignmentHeader";
import { AssignmentStatus } from "./assignments/AssignmentStatus";
import { AssignmentDueDate } from "./assignments/AssignmentDueDate";
import { AssignmentAttachments } from "./assignments/AssignmentAttachments";
import { DeleteButton } from "./assignments/DeleteButton";
import { ArchiveButton } from "./assignments/ArchiveButton";
import { StudentInfo } from "./assignments/StudentInfo";

interface AssignmentCardProps {
  assignment: Assignment;
  onStatusChange?: (id: string, status: Assignment["status"]) => void;
  onUpdate?: (id: string, updates: Partial<Assignment>) => void;
  onDelete?: (id: string) => void;
  onArchiveToggle?: () => void;
  showArchiveToggle?: boolean;
  isArchived?: boolean;
}

export const AssignmentCard = ({
  assignment,
  onStatusChange,
  onUpdate,
  onDelete,
  onArchiveToggle,
  showArchiveToggle = false,
  isArchived = false,
}: AssignmentCardProps) => {
  const { t, language } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);

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
          
          <StudentInfo 
            userId={assignment.user_id}
            currentUserId={session?.user.id}
          />
          
          <AssignmentAttachments
            assignmentId={assignment.id}
            canEdit={canEdit}
          />
          
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              {language === "he" ? (
                <>
                  <AssignmentDueDate dueDate={assignment.due_date} />
                  {canEdit && <DeleteButton onDelete={handleDelete} />}
                  <ArchiveButton
                    onArchiveToggle={onArchiveToggle}
                    showArchiveToggle={showArchiveToggle}
                    isArchived={isArchived}
                  />
                </>
              ) : (
                <>
                  {canEdit && <DeleteButton onDelete={handleDelete} />}
                  <ArchiveButton
                    onArchiveToggle={onArchiveToggle}
                    showArchiveToggle={showArchiveToggle}
                    isArchived={isArchived}
                  />
                  <AssignmentDueDate dueDate={assignment.due_date} />
                </>
              )}
            </div>
            {onStatusChange && (
              <AssignmentStatus
                status={assignment.status}
                onStatusChange={(status) => onStatusChange(assignment.id, status)}
              />
            )}
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
