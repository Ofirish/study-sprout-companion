
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserPlus, Trash2 } from "lucide-react";

interface RelatedUser {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

export const UserRelationships = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [userEmail, setUserEmail] = useState("");
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRelatedUsers = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("user_relationships")
      .select(`
        related_user_id,
        related_user:profiles!user_relationships_related_user_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq("user_id", session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const formattedUsers = data.map((item: any) => ({
      id: item.related_user.id,
      first_name: item.related_user.first_name,
      last_name: item.related_user.last_name,
      email: item.related_user.email,
    }));

    setRelatedUsers(formattedUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchRelatedUsers();
  }, [session]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !userEmail) return;

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", userEmail)
      .maybeSingle();

    if (userError) {
      toast({
        title: "Error",
        description: "Error finding user",
        variant: "destructive",
      });
      return;
    }

    if (!userData) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    if (userData.id === session.user.id) {
      toast({
        title: "Error",
        description: "You cannot add yourself as a connection",
        variant: "destructive",
      });
      return;
    }

    const { data: existingRelationship } = await supabase
      .from("user_relationships")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("related_user_id", userData.id)
      .maybeSingle();

    if (existingRelationship) {
      toast({
        title: "Error",
        description: "This user is already connected to your account",
        variant: "destructive",
      });
      return;
    }

    const { error: relationshipError } = await supabase
      .from("user_relationships")
      .insert({
        user_id: session.user.id,
        related_user_id: userData.id,
        relationship_type: "connection",
      });

    if (relationshipError) {
      toast({
        title: "Error",
        description: relationshipError.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User connection added successfully",
    });
    setUserEmail("");
    fetchRelatedUsers();
  };

  const handleRemoveUser = async (userId: string) => {
    if (!session) return;

    const { error } = await supabase
      .from("user_relationships")
      .delete()
      .eq("user_id", session.user.id)
      .eq("related_user_id", userId);

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
      description: "User connection removed successfully",
    });
    fetchRelatedUsers();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {language === "en" ? "User Connections" : "קשרי משתמשים"}
      </h2>
      
      <form onSubmit={handleAddUser} className="space-y-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="userEmail">
              {language === "en" ? "User Email" : "אימייל משתמש"}
            </Label>
            <Input
              id="userEmail"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <Button type="submit" className="mt-8">
            <UserPlus className="mr-2 h-4 w-4" />
            {language === "en" ? "Add Connection" : "הוסף קשר"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="font-medium">
          {language === "en" ? "Connected Users" : "משתמשים מקושרים"}
        </h3>
        {relatedUsers.length === 0 ? (
          <p className="text-muted-foreground">
            {language === "en" ? "No connections yet" : "אין קשרים עדיין"}
          </p>
        ) : (
          <div className="space-y-2">
            {relatedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span>
                  {user.first_name} {user.last_name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
