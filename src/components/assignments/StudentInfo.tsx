
/**
 * StudentInfo.tsx
 * Purpose: Displays student information for assignments
 * Used by: src/components/AssignmentCard.tsx
 */
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  first_name: string;
  last_name: string;
}

interface StudentInfoProps {
  userId: string;
  currentUserId: string;
}

export const StudentInfo = ({ userId, currentUserId }: StudentInfoProps) => {
  const [studentProfile, setStudentProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!currentUserId || userId === currentUserId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setStudentProfile(data);
      }
    };

    fetchStudentProfile();
  }, [userId, currentUserId]);

  if (!studentProfile) return null;

  return (
    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
      <User className="h-3 w-3" />
      <span>{studentProfile.first_name} {studentProfile.last_name}</span>
    </div>
  );
};
