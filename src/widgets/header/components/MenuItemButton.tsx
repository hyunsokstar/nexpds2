// widgets/header/ui/menu-item.tsx
"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  icon: string;
  title: string;
  isActive: boolean;
  isOpened: boolean;
  count?: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MenuItemButton({ 
  icon, 
  title, 
  isActive, 
  isOpened, 
  count, 
  onClick 
}: MenuItemProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "relative w-[100px] h-[80px] p-2 rounded-lg transition-all",
        "hover:bg-[#E5F3F3] hover:shadow-sm",
        "flex flex-col items-center justify-center gap-1",
        isActive && "bg-[#5BC2C1] text-white shadow-md",
        isOpened && !isActive && "bg-[#E5F3F3]"
      )}
    >
      {isActive && (
        <div className="absolute top-1.5 right-1.5">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="relative w-8 h-8">
        <Image
          src={icon}
          alt={title}
          fill
          className="object-contain"
          sizes="32px"
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium whitespace-nowrap">
          {title}
        </span>
        {count && count > 1 && (
          <span className="px-1.5 py-0.5 text-[10px] leading-none bg-[#E5F3F3] text-[#5BC2C1] rounded-full min-w-[16px] text-center">
            {count}
          </span>
        )}
      </div>
    </Button>
  );
}