import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trash2 } from "lucide-react";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

interface StudentListProps {
  students: Student[];
  onRemoveStudent: (id: string) => void;
}

export const StudentList = ({ students, onRemoveStudent }: StudentListProps) => {
  const { t } = useLanguage();

  if (students.length === 0) {
    return <p className="text-muted-foreground">{t("noStudentsYet")}</p>;
  }

  return (
    <div className="space-y-2">
      {students.map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between p-3 bg-muted rounded-lg"
        >
          <span>
            {student.first_name} {student.last_name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveStudent(student.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
};