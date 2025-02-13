
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

interface CustomPage {
  id: string;
  name: string;
  slug: string;
}

export const CustomPages = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [newPageName, setNewPageName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user.id) {
      fetchPages();
    }
  }, [session]);

  const fetchPages = async () => {
    if (!session?.user.id) return;

    const { data, error } = await supabase
      .from("custom_pages")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPages(data || []);
    setLoading(false);
  };

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !newPageName.trim()) return;

    const slug = newPageName.toLowerCase().trim().replace(/\s+/g, "-");

    const { error } = await supabase.from("custom_pages").insert([
      {
        user_id: session.user.id,
        name: newPageName.trim(),
        slug,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Page added successfully",
    });

    setNewPageName("");
    fetchPages();
  };

  const handleDeletePage = async (id: string) => {
    if (!session?.user.id) return;

    const { error } = await supabase
      .from("custom_pages")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Page deleted successfully",
    });

    fetchPages();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t("customPages")}</h2>
      <div className="space-y-4">
        <form onSubmit={handleAddPage} className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="newPageName">Page Name</Label>
            <Input
              id="newPageName"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="Enter page name"
            />
          </div>
          <Button type="submit" className="mt-6">
            Add Page
          </Button>
        </form>

        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium">{page.name}</p>
                <p className="text-sm text-muted-foreground">/{page.slug}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeletePage(page.id)}
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
