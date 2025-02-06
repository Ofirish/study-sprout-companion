/**
 * Index.tsx
 * Purpose: Main dashboard page displaying assignments and controls.
 * Shows assignment stats, filtering options, and assignment list.
 */
import { useState, useEffect } from "react";
import { Assignment } from "@/types/assignment";
import { AssignmentForm } from "@/components/AssignmentForm";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut, ChevronRight, Users } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AssignmentTabs } from "@/components/AssignmentTabs";
import { useAssignments } from "@/hooks/useAssignments";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

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

  // Fetch user profile to check if they're a parent
  const { data: userProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch students if user is a parent
  const { data: students = [] } = useQuery({
    queryKey: ["students", session?.user?.id],
    enabled: userProfile?.role === "parent",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_student_relationships")
        .select(`
          student:student_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq("parent_id", session?.user?.id);
      
      if (error) throw error;
      return data.map(d => d.student);
    },
  });

  const { 
    assignments = [], 
    isLoading, 
    addAssignmentMutation, 
    updateAssignmentMutation 
  } = useAssignments(selectedStudentId);

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

        {userProfile?.role === "parent" && students.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{t("viewingAssignments")}</span>
            </div>
            <Select
              value={selectedStudentId || session?.user?.id}
              onValueChange={(value) => setSelectedStudentId(value === session?.user?.id ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder={t("selectStudent")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={session?.user?.id}>{t("myAssignments")}</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
            {selectedStudentId ? `${t("assignmentsFor")} ${students.find(s => s.id === selectedStudentId)?.first_name}` : t("tabHomework")}
          </h2>

          <AssignmentTabs
            assignments={filteredAssignments}
            onStatusChange={handleStatusChange}
          />

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="hide-completed"
                checked={hideCompleted}
                onCheckedChange={setHideCompleted}
              />
              <Label htmlFor="hide-completed" className="text-sm">
                {t("hideCompleted")}
              </Label>
            </div>
            
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                size="sm"
                className="w-auto group"
                onMouseEnter={() => setShowEmojiToggle(true)}
                onMouseLeave={() => setShowEmojiToggle(false)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("signOut")}
                <ChevronRight className={cn(
                  "h-4 w-4 ml-2 transition-transform duration-200",
                  showEmojiToggle ? "rotate-90" : ""
                )} />
              </Button>
              
              <div className={cn(
                "absolute left-0 -top-12 transition-all duration-200 opacity-0 pointer-events-none",
                showEmojiToggle && "opacity-100 pointer-events-auto"
              )}>
                <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
                  <Switch
                    id="enable-emojis"
                    checked={enableEmojis}
                    onCheckedChange={setEnableEmojis}
                  />
                  <Label htmlFor="enable-emojis" className="text-sm whitespace-nowrap">
                    Fun Mode {activeEmoji}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
