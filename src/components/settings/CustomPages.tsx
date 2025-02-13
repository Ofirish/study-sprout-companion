
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

interface List {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export const Lists = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user.id) {
      fetchLists();
    }
  }, [session]);

  const fetchLists = async () => {
    if (!session?.user.id) return;

    const { data, error } = await supabase
      .from("lists")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setLists(data || []);
    setLoading(false);
  };

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !newListName.trim()) return;

    const slug = newListName.toLowerCase().trim().replace(/\s+/g, "-");

    const { error } = await supabase.from("lists").insert([
      {
        user_id: session.user.id,
        name: newListName.trim(),
        description: newListDescription.trim(),
        slug,
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
      description: "List added successfully",
    });

    setNewListName("");
    setNewListDescription("");
    fetchLists();
  };

  const handleDeleteList = async (id: string) => {
    if (!session?.user.id) return;

    const { error } = await supabase
      .from("lists")
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
      description: "List deleted successfully",
    });

    fetchLists();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t("lists")}</h2>
      <div className="space-y-4">
        <form onSubmit={handleAddList} className="space-y-4">
          <div>
            <Label htmlFor="newListName">{t("listName")}</Label>
            <Input
              id="newListName"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder={t("listName")}
            />
          </div>
          <div>
            <Label htmlFor="newListDescription">{t("description")}</Label>
            <Textarea
              id="newListDescription"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              placeholder={t("listDescription")}
              rows={3}
            />
          </div>
          <Button type="submit">
            {t("addList")}
          </Button>
        </form>

        <div className="space-y-2">
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium">{list.name}</p>
                <p className="text-sm text-muted-foreground">/{list.slug}</p>
                {list.description && (
                  <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteList(list.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
