import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentSelectorProps {
  userId: string | undefined;
  selectedStudentId: string | null;
  onStudentSelect: (studentId: string | null) => void;
}

export const StudentSelector = ({
  userId,
  selectedStudentId,
  onStudentSelect,
}: StudentSelectorProps) => {
  const { t, language } = useLanguage();

  const { data: userProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: students = [] } = useQuery({
    queryKey: ["students", userId],
    enabled: !!userId && userProfile?.role === "parent",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_student_relationships")
        .select(`
          student:profiles!parent_student_relationships_student_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq("parent_id", userId);
      
      if (error) throw error;
      return data.map(d => d.student);
    },
  });

  if (!userProfile?.role === "parent" || students.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4" />
        <span className="text-sm font-medium">{t("viewingAssignments")}</span>
      </div>
      <Select
        value={selectedStudentId || userId}
        onValueChange={(value) => onStudentSelect(value === userId ? null : value)}
      >
        <SelectTrigger className="w-full sm:w-[300px]">
          <SelectValue placeholder={t("selectStudent")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={userId}>{t("myAssignments")}</SelectItem>
          {students.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.first_name} {student.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};