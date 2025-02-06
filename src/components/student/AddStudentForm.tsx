import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserPlus } from "lucide-react";

export const AddStudentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [studentEmail, setStudentEmail] = useState("");

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !studentEmail) return;

    const { data: studentData, error: studentError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("email", studentEmail)
      .maybeSingle();

    if (studentError) {
      toast({
        title: "Error",
        description: "Error finding student",
        variant: "destructive",
      });
      return;
    }

    if (!studentData) {
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

    const { data: existingRelationship } = await supabase
      .from("parent_student_relationships")
      .select("id")
      .eq("parent_id", session.user.id)
      .eq("student_id", studentData.id)
      .maybeSingle();

    if (existingRelationship) {
      toast({
        title: "Error",
        description: "This student is already connected to your account",
        variant: "destructive",
      });
      return;
    }

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
    onSuccess();
  };

  return (
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
  );
};