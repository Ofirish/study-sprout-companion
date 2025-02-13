
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useFunMode } from "@/contexts/FunModeContext";

interface DashboardEffectsProps {
  session: Session | null;
  setShowForm: (show: boolean) => void;
  setShowFlyingName: (show: boolean) => void;
  setHasStudents: (hasStudents: boolean) => void;
}

export const useDashboardEffects = ({
  session,
  setShowForm,
  setShowFlyingName,
  setHasStudents,
}: DashboardEffectsProps) => {
  const { funMode, toggleFunMode } = useFunMode();

  useEffect(() => {
    const checkForStudents = async () => {
      if (!session) return;
      
      const { data } = await supabase
        .from("parent_student_relationships")
        .select("*")
        .eq("parent_id", session.user.id);
      
      setHasStudents(data && data.length > 0);
    };
    
    checkForStudents();
  }, [session, setHasStudents]);

  useEffect(() => {
    const handleHomeworkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.textContent?.toLowerCase() || '';
      if (text.includes('homework')) {
        toggleFunMode();
      }
    };

    document.addEventListener('dblclick', handleHomeworkClick);
    return () => document.removeEventListener('dblclick', handleHomeworkClick);
  }, [toggleFunMode]);

  useEffect(() => {
    const handleStopAllEffects = () => {
      setShowForm(false);
      setShowFlyingName(false);
      if (funMode) {
        toggleFunMode();
      }
    };

    window.addEventListener("stopAllEffects", handleStopAllEffects);
    return () => window.removeEventListener("stopAllEffects", handleStopAllEffects);
  }, [funMode, toggleFunMode, setShowForm, setShowFlyingName]);
};
