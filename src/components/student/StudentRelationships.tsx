import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { AddStudentForm } from "./AddStudentForm";
import { StudentList } from "./StudentList";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

export const StudentRelationships = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("parent_student_relationships")
      .select(`
        student_id,
        student:profiles!parent_student_relationships_student_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq("parent_id", session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const formattedStudents = data.map((item: any) => ({
      id: item.student.id,
      first_name: item.student.first_name,
      last_name: item.student.last_name,
      email: item.student.email,
    }));

    setStudents(formattedStudents);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [session]);

  const handleRemoveStudent = async (studentId: string) => {
    if (!session) return;

    const { error } = await supabase
      .from("parent_student_relationships")
      .delete()
      .eq("parent_id", session.user.id)
      .eq("student_id", studentId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Student removed successfully",
    });
    fetchStudents();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t("studentRelationships")}</h2>
      <AddStudentForm onSuccess={fetchStudents} />
      <div className="space-y-4">
        <h3 className="font-medium">{t("connectedStudents")}</h3>
        <StudentList students={students} onRemoveStudent={handleRemoveStudent} />
      </div>
    </Card>
  );
};