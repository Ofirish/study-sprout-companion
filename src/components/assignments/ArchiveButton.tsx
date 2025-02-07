
/**
 * ArchiveButton.tsx
 * Purpose: Displays archive/unarchive button for assignments
 * Used by: src/components/AssignmentCard.tsx
 */
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ArchiveButtonProps {
  onArchiveToggle: () => void;
  isArchived: boolean;
  showArchiveToggle: boolean;
}

export const ArchiveButton = ({ 
  onArchiveToggle, 
  isArchived, 
  showArchiveToggle 
}: ArchiveButtonProps) => {
  const { t } = useLanguage();

  if (!showArchiveToggle) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onArchiveToggle}
      className="gap-2"
    >
      {isArchived ? (
        <>
          <ArchiveRestore className="h-4 w-4" />
          {t("unarchive")}
        </>
      ) : (
        <>
          <Archive className="h-4 w-4" />
          {t("moveToArchive")}
        </>
      )}
    </Button>
  );
};
