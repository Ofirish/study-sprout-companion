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
import { PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AssignmentTabs } from "@/components/AssignmentTabs";
import { useAssignments } from "@/hooks/useAssignments";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFunMode } from "@/contexts/FunModeContext";
import { Sparkles } from "@/components/Sparkles";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { funMode, toggleFunMode } = useFunMode();
  
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

  const { 
    assignments = [], 
    isLoading, 
    addAssignmentMutation, 
    updateAssignmentMutation 
  } = useAssignments();

  const filteredAssignments = assignments.filter(assignment => {
    if (selectedUserId && assignment.user_id !== selectedUserId) {
      return false;
    }
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

  // Group assignments by user for the selector
  const userGroups = assignments.reduce((acc, assignment) => {
    const userId = assignment.user_id;
    if (!acc[userId]) {
      acc[userId] = {
        id: userId,
        name: assignment.profiles ? 
          `${assignment.profiles.first_name} ${assignment.profiles.last_name}` : 
          'Unknown User'
      };
    }
    return acc;
  }, {} as Record<string, { id: string; name: string }>);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const containerClasses = `min-h-screen py-8 transition-all duration-500 ${
    funMode ? 'fun-mode' : 'bg-gray-50'
  }`;

  return (
    <div className={containerClasses} dir={language === "he" ? "rtl" : "ltr"}>
      {funMode && <Sparkles />}
      <div className="container max-w-4xl">
        <DashboardHeader />

        <div className="mt-4 mb-6">
          <Select
            value={selectedUserId || "current"}
            onValueChange={(value) => setSelectedUserId(value === "current" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder={t("selectStudent")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">
                {t("myAssignments")}
              </SelectItem>
              {Object.values(userGroups)
                .filter(user => user.id !== session?.user?.id)
                .map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <StatsCard 
          assignments={filteredAssignments} 
          onFilterChange={setStatusFilter}
        />

        <div className="mt-8">
          {!selectedUserId && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <Button 
                variant="outline" 
                onClick={() => setStatusFilter("all")}
                size="sm"
                className={`text-sm ${statusFilter === "all" ? "bg-primary text-white hover:bg-primary/90" : ""} ${
                  funMode ? "rainbow-text" : ""
                }`}
              >
                {t("showAll")}
              </Button>
              <Button 
                onClick={() => setShowForm(!showForm)}
                size="sm"
                className={`w-auto text-sm ${funMode ? "rainbow-text" : ""}`}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {showForm ? t("cancel") : t("addAssignment")}
              </Button>
            </div>
          )}

          {showForm && !selectedUserId && <AssignmentForm onSubmit={handleAddAssignment} />}

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
            
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              size="sm"
              className={`w-auto ${funMode ? "rainbow-text" : ""}`}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("signOut")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
