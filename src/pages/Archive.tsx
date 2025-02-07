
import { useState } from "react";
import { Assignment } from "@/types/assignment";
import { AssignmentCard } from "@/components/AssignmentCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAssignments } from "@/hooks/useAssignments";
import { Home, Languages } from "lucide-react";
import { Link } from "react-router-dom";

export default function Archive() {
  const { t, language, setLanguage } = useLanguage();
  const { assignments = [], isLoading, updateAssignmentMutation } = useAssignments();
  
  const archivedAssignments = assignments.filter(a => a.archived);

  const handleUnarchive = async (id: string) => {
    updateAssignmentMutation.mutate({ id, archived: false });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 py-8"
      dir={language === "he" ? "rtl" : "ltr"}
    >
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              {t("home")}
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "he" : "en")}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === "en" ? "עברית" : "English"}
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-6">{t("archivedAssignments")}</h1>

        <div className="space-y-4">
          {archivedAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("noArchivedAssignments")}
            </div>
          ) : (
            archivedAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onArchiveToggle={() => handleUnarchive(assignment.id)}
                showArchiveToggle={true}
                isArchived={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
