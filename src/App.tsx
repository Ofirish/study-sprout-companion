
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FunModeProvider } from "@/contexts/FunModeContext";
import { ColorThemeProvider } from "@/contexts/ColorThemeContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FloatingNav } from "@/components/FloatingNav";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <FunModeProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <ColorThemeProvider>
                <LanguageProvider>
                  <div className="relative">
                    <LanguageToggle />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <FloatingNav />
                  </div>
                </LanguageProvider>
              </ColorThemeProvider>
            </AuthProvider>
          </FunModeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
