
import { useState } from 'react';
import { Rgb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ColorPicker } from './ColorPicker';
import { useMediaQuery } from '@/hooks/use-mobile';

export function ColorizeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <Rgb className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : ""}>
        <SheetHeader>
          <SheetTitle>Re-Colorize</SheetTitle>
        </SheetHeader>
        <ColorPicker />
      </SheetContent>
    </Sheet>
  );
}
