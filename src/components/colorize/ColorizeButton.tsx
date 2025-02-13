
import { useState, useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ColorPicker } from './ColorPicker';
import { useIsMobile } from '@/hooks/use-mobile';

interface ColorizeButtonProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export function ColorizeButton({ onOpenChange }: ColorizeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <Palette className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : ""}>
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Re-Colorize</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <ColorPicker />
      </SheetContent>
    </Sheet>
  );
}
