
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HomeIcon, Menu, Settings } from "lucide-react";

interface CustomPage {
  id: string;
  name: string;
  path: string;
}

interface FloatingNavProps {
  customPages?: CustomPage[];
}

export const FloatingNav = ({ customPages = [] }: FloatingNavProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="flex flex-col gap-2">
          <Link to="/" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          
          {customPages.map((page) => (
            <Link key={page.id} to={page.path} onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                {page.name}
              </Button>
            </Link>
          ))}

          <Link to="/settings" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
