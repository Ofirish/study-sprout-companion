
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface LastActivityTimerProps {
  assignments: any[];
  viewMode: "all" | "student" | "parent";
}

export const LastActivityTimer = ({ assignments, viewMode }: LastActivityTimerProps) => {
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  const { session } = useAuth();
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    // Find the most recent assignment update
    const lastUpdated = assignments
      .map(a => new Date(a.updated_at || a.created_at))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    if (lastUpdated) {
      setLastActivity(lastUpdated);
    }
  }, [assignments]);

  useEffect(() => {
    // Get student name for parent view
    const fetchStudentName = async () => {
      if (viewMode === "parent" && assignments.length > 0) {
        const studentId = assignments.find(a => a.user_id !== session?.user?.id)?.user_id;
        
        if (studentId) {
          const { data } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', studentId)
            .single();

          if (data) {
            setStudentName(`${data.first_name} ${data.last_name}`.trim());
          }
        }
      }
    };

    fetchStudentName();
  }, [viewMode, assignments, session?.user?.id]);

  useEffect(() => {
    const updateTimer = () => {
      if (lastActivity) {
        setTimeAgo(formatDistanceToNow(lastActivity, { addSuffix: true }));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lastActivity]);

  if (!lastActivity || !timeAgo) return null;

  return (
    <div className="text-sm text-muted-foreground text-center pb-4">
      {viewMode === "parent" && studentName && (
        <span className="font-medium">{studentName}'s </span>
      )}
      Last activity: {timeAgo}
    </div>
  );
};
