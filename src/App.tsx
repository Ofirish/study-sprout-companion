
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
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

interface CustomPage {
  id: string;
  slug: string;
  name: string;
}

const App = () => {
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);

  useEffect(() => {
    const fetchCustomPages = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user.id) {
        const { data } = await supabase
          .from("custom_pages")
          .select("*")
          .eq("user_id", session.session.user.id);
        setCustomPages(data || []);
      }
    };

    fetchCustomPages();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchCustomPages();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const navCustomPages = customPages.map(page => ({
    id: page.id,
    name: page.name,
    path: `/${page.slug}`
  }));

  return (
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
                  {customPages.map((page) => (
                    <Route
                      key={page.id}
                      path={`/${page.slug}`}
                      element={
                        <div className="container py-8">
                          <h1 className="text-2xl font-bold mb-4">{page.name}</h1>
                          <p className="text-muted-foreground">
                            This is a custom page. Add your content here.
                          </p>
                        </div>
                      }
                    />
                  ))}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingNav customPages={navCustomPages} />
              </div>
            </LanguageProvider>
          </AuthProvider>
        </FunModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
