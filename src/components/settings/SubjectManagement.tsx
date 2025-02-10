
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash, Save } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CustomSubject {
  id: string;
  name_en: string;
  name_he: string;
}

export const SubjectManagement = () => {
  const { t, language } = useLanguage();
  const { session } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<CustomSubject[]>([]);
  const [newSubject, setNewSubject] = useState({ name_en: "", name_he: "" });
  const [editingSubject, setEditingSubject] = useState<CustomSubject | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("custom_subjects")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSubjects(data || []);
  };

  const handleAddSubject = async () => {
    if (!newSubject.name_en || !newSubject.name_he) {
      toast({
        title: t("error"),
        description: t("subjectsRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("custom_subjects").insert([
      {
        name_en: newSubject.name_en,
        name_he: newSubject.name_he,
        user_id: session?.user.id,
      },
    ]);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("success"),
      description: t("subjectAdded"),
    });

    setNewSubject({ name_en: "", name_he: "" });
    fetchSubjects();
  };

  const handleUpdateSubject = async (subject: CustomSubject) => {
    const { error } = await supabase
      .from("custom_subjects")
      .update({
        name_en: subject.name_en,
        name_he: subject.name_he,
      })
      .eq("id", subject.id);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("success"),
      description: t("subjectUpdated"),
    });

    setEditingSubject(null);
    fetchSubjects();
  };

  const handleDeleteSubject = async (id: string) => {
    const { error } = await supabase
      .from("custom_subjects")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("success"),
      description: t("subjectDeleted"),
    });

    fetchSubjects();
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t("manageSubjects")}</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder={t("subjectNameEn")}
            value={newSubject.name_en}
            onChange={(e) => setNewSubject({ ...newSubject, name_en: e.target.value })}
          />
          <Input
            placeholder={t("subjectNameHe")}
            value={newSubject.name_he}
            onChange={(e) => setNewSubject({ ...newSubject, name_he: e.target.value })}
          />
        </div>
        <Button onClick={handleAddSubject} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {t("addSubject")}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="flex items-center space-x-4">
            {editingSubject?.id === subject.id ? (
              <>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <Input
                    value={editingSubject.name_en}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, name_en: e.target.value })
                    }
                  />
                  <Input
                    value={editingSubject.name_he}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, name_he: e.target.value })
                    }
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateSubject(editingSubject)}
                >
                  <Save className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <span>{subject.name_en}</span>
                  <span>{subject.name_he}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setEditingSubject(subject)}
                >
                  {t("edit")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteSubject(subject.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
