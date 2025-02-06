import { useState, useEffect } from "react";
import { Assignment } from "@/types/assignment";
import { AssignmentForm } from "@/components/AssignmentForm";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AssignmentTabs } from "@/components/AssignmentTabs";
import { useAssignments } from "@/hooks/useAssignments";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { StudentSelector } from "@/components/StudentSelector";
import { FunModeControls } from "@/components/FunModeControls";

const EMOJIS = ["🐶", "🐱", "🐰", "🦊", "🐼", "🦁", "🐸", "🦉"];

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const [hideCompleted, setHideCompleted] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  const [funModeEnabled, setFunModeEnabled] = useState(false);
  const [showEmojiToggle, setShowEmojiToggle] = useState(false);
  const [enableEmojis, setEnableEmojis] = useState(false);
  const [activeEmoji, setActiveEmoji] = useState("");

  useEffect(() => {
    if (funModeEnabled) {
      const handleSparkle = (e: MouseEvent) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${e.clientX - 10}px`;
        sparkle.style.top = `${e.clientY - 10}px`;
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
          document.body.removeChild(sparkle);
        }, 600);
      };

      document.addEventListener('click', handleSparkle);
      document.addEventListener('touchstart', handleSparkle);

      return () => {
        document.removeEventListener('click', handleSparkle);
        document.removeEventListener('touchstart', handleSparkle);
      };
    }
  }, [funModeEnabled]);

  const handleHomeworkClick = () => {
    setFunModeEnabled(prev => !prev);
    if (!funModeEnabled) {
      toast({
        title: "✨ Fun Mode Activated! ✨",
        description: "Click anywhere to create sparkles!",
      });
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableEmojis) return;
    
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setActiveEmoji(emoji);
    
    const emojiEl = document.createElement("div");
    emojiEl.textContent = emoji;
    emojiEl.style.position = "fixed";
    emojiEl.style.left = `${e.clientX}px`;
    emojiEl.style.top = `${e.clientY}px`;
    emojiEl.style.pointerEvents = "none";
    emojiEl.style.zIndex = "50";
    emojiEl.className = "animate-emoji";
    
    document.body.appendChild(emojiEl);
    
    setTimeout(() => {
      document.body.removeChild(emojiEl);
    }, 1000);
  };

  const { 
    assignments = [], 
    isLoading, 
    addAssignmentMutation, 
    updateAssignmentMutation 
  } = useAssignments(selectedStudentId);

  const handleAddAssignment = (
    newAssignment: Omit<Assignment, "id" | "status">
  ) => {
    addAssignmentMutation.mutate(newAssignment);
    setShowForm(false);
  };

  const handleStatusChange = (id: string, status: Assignment["status"]) => {
    updateAssignmentMutation.mutate({ id, status });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (hideCompleted && assignment.status === "Completed") {
      return false;
    }
    
    switch (statusFilter) {
      case "completed":
        return assignment.status === "Completed";
      case "in_progress":
        return assignment.status === "In Progress";
      case "not_started":
        return assignment.status === "Not Started";
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={language === "he" ? "rtl" : "ltr"}>
      {funModeEnabled && <div className="rainbow-mode" />}
      <div className="container max-w-4xl">
        <DashboardHeader />

        <StudentSelector
          userId={session?.user?.id}
          selectedStudentId={selectedStudentId}
          onStudentSelect={setSelectedStudentId}
        />

        <StatsCard 
          assignments={assignments} 
          onFilterChange={setStatusFilter}
        />

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => setStatusFilter("all")}
              size="sm"
              className={`text-sm ${statusFilter === "all" ? "bg-primary text-white hover:bg-primary/90" : ""}`}
              onMouseEnter={handleButtonClick}
            >
              {t("showAll")}
            </Button>
            {!selectedStudentId && (
              <Button 
                onClick={() => setShowForm(!showForm)}
                size="sm"
                className="w-auto text-sm"
                onMouseEnter={handleButtonClick}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {showForm ? t("cancel") : t("addAssignment")}
              </Button>
            )}
          </div>

          {showForm && !selectedStudentId && <AssignmentForm onSubmit={handleAddAssignment} />}

          <h2 
            className="text-2xl font-bold mb-4 cursor-pointer select-none"
            onDoubleClick={handleHomeworkClick}
          >
            {selectedStudentId ? `${t("assignmentsFor")} ${assignments.find(s => s.user_id === selectedStudentId)?.first_name}` : t("tabHomework")}
          </h2>

          <AssignmentTabs
            assignments={filteredAssignments}
            onStatusChange={handleStatusChange}
          />

          <FunModeControls
            onSignOut={handleSignOut}
            showEmojiToggle={showEmojiToggle}
            setShowEmojiToggle={setShowEmojiToggle}
            enableEmojis={enableEmojis}
            setEnableEmojis={setEnableEmojis}
            activeEmoji={activeEmoji}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;