
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AssignmentAttachments } from "@/components/assignments/AssignmentAttachments";
import { useLanguage } from "@/contexts/LanguageContext";

interface AttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string | null;
}

export const AttachmentDialog = ({ open, onOpenChange, assignmentId }: AttachmentDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">{t("attachments")}</h2>
          {assignmentId && (
            <AssignmentAttachments
              assignmentId={assignmentId}
              canEdit={true}
            />
          )}
          <Button
            className="w-full mt-4"
            onClick={() => onOpenChange(false)}
          >
            {t("done")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
