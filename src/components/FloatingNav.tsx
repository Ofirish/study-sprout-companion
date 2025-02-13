
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Menu, Home, Settings, X } from "lucide-react";

interface NavItem {
  id: string;
  name: string;
  path: string;
}

interface FloatingNavProps {
  customPages: NavItem[];
}

export const FloatingNav = ({ customPages }: FloatingNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const defaultPages = [
    { id: "home", name: t("home"), path: "/" },
    { id: "settings", name: t("settings"), path: "/settings" },
  ];

  const allPages = [...defaultPages, ...customPages];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg p-4 min-w-[200px] border">
            <nav className="space-y-2">
              {allPages.map((page) => (
                <Link
                  key={page.id}
                  to={page.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    "w-full text-left"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {page.path === "/" ? (
                    <Home className="h-4 w-4" />
                  ) : page.path === "/settings" ? (
                    <Settings className="h-4 w-4" />
                  ) : null}
                  {page.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
        <Button
          size="icon"
          className="rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
