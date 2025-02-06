import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StudentRelationships } from "@/components/student/StudentRelationships";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home } from "lucide-react";

const Settings = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (profile) {
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setRole(profile.role || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session, navigate, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", session.user.id);

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
      description: "Profile updated successfully",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("settings")}</h1>
        <Link to="/">
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            {t("home")}
          </Button>
        </Link>
      </div>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t("profileSettings")}</h2>
        <ProfileForm
          firstName={firstName}
          lastName={lastName}
          role={role}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onSubmit={handleUpdateProfile}
        />
      </Card>

      {role === "parent" && (
        <>
          <Separator className="my-6" />
          <StudentRelationships />
        </>
      )}
    </div>
  );
};

export default Settings;