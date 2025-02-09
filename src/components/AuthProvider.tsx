import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const refreshToken = async () => {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to refresh token. Please sign in again.",
        variant: "destructive",
      });
      await signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, signOut, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);