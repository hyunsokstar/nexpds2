"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

interface MenuItemButtonProps {
  icon: string;
  title: string;
  isActive: boolean;
  isRegistered: boolean;
  onClick: (e: React.MouseEvent) => void;  // 이벤트 파라미터 추가
}

export function MenuItemButton({ 
  icon, 
  title, 
  isActive,
  isRegistered,
  onClick 
}: MenuItemButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}  // 이벤트 객체가 자동으로 전달됨
      className={cn(
        "relative w-[100px] h-[80px] p-2 rounded-lg transition-all",
        "hover:bg-[#E5F3F3] hover:shadow-sm",
        "flex flex-col items-center justify-center gap-1",
        "border",
        isActive 
          ? "bg-[#5BC2C1] text-white shadow-md border-solid border-[#5BC2C1]" 
          : isRegistered
            ? "border-dashed border-gray-300 bg-[#E9ECEF]"
            : "border-dashed border-gray-300",
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
        <span className={cn(
          "text-xs font-medium whitespace-nowrap",
          isActive ? "text-white" : isRegistered ? "text-gray-700" : "text-gray-600"
        )}>
          {title}
        </span>
      </div>
    </Button>
  );
}