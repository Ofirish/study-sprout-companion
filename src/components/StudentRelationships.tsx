import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserPlus, Trash2 } from "lucide-react";

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
  const [studentEmail, setStudentEmail] = useState("");
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
          last_name
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
    }));

    setStudents(formattedStudents);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [session]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !studentEmail) return;

    // First, get the student's profile using their email
    const { data: studentData, error: studentError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", session.user.id)
      .single();

    if (studentError || !studentData) {
      toast({
        title: "Error",
        description: "Student not found",
        variant: "destructive",
      });
      return;
    }

    if (studentData.role !== "student") {
      toast({
        title: "Error",
        description: "User is not a student",
        variant: "destructive",
      });
      return;
    }

    // Create the relationship
    const { error: relationshipError } = await supabase
      .from("parent_student_relationships")
      .insert({
        parent_id: session.user.id,
        student_id: studentData.id,
      });

    if (relationshipError) {
      toast({
        title: "Error",
        description: relationshipError.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Student added successfully",
    });
    setStudentEmail("");
    fetchStudents();
  };

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
      
      <form onSubmit={handleAddStudent} className="space-y-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="studentEmail">{t("studentEmail")}</Label>
            <Input
              id="studentEmail"
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="student@example.com"
            />
          </div>
          <Button type="submit" className="mt-8">
            <UserPlus className="mr-2 h-4 w-4" />
            {t("addStudent")}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="font-medium">{t("connectedStudents")}</h3>
        {students.length === 0 ? (
          <p className="text-muted-foreground">{t("noStudentsYet")}</p>
        ) : (
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
                  onClick={() => handleRemoveStudent(student.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};