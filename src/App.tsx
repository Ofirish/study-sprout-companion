
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FunModeProvider } from "@/contexts/FunModeContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FloatingNav } from "@/components/FloatingNav";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface List {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

const App = () => {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const fetchLists = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user.id) {
        const { data } = await supabase
          .from("lists")
          .select("*")
          .eq("user_id", session.session.user.id);
        setLists(data || []);
      }
    };

    fetchLists();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchLists();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const navLists = lists.map(list => ({
    id: list.id,
    name: list.name,
    path: `/${list.slug}`
  }));

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <FunModeProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <LanguageProvider>
                <div className="relative">
                  <LanguageToggle />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/settings" element={<Settings />} />
                    {lists.map((list) => (
                      <Route
                        key={list.id}
                        path={`/${list.slug}`}
                        element={
                          <Index listId={list.id} />
                        }
                      />
                    ))}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <FloatingNav customPages={navLists} />
                </div>
              </LanguageProvider>
            </AuthProvider>
          </FunModeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
