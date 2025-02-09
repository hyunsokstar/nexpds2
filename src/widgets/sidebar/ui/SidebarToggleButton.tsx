// widgets/sidebar/ui/SidebarToggleButton.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function SidebarToggleButton({ isOpen, onClick }: SidebarToggleButtonProps) {
  return (
    <div className="absolute right-0 top-0 h-full">
      {/* 점선 구분선 */}
      <div className="absolute right-0 top-0 h-full border-r border-dashed border-gray-300" />
      
      {/* 토글 버튼 */}
      <button
        onClick={onClick}
        className={cn(
          "absolute top-3",
          "flex items-center justify-center",
          "w-4 h-16 bg-white",
          "border border-gray-200 rounded-r",
          "hover:bg-gray-50 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-gray-200",
          isOpen ? "-right-4" : "right-0"
        )}
      >
        {isOpen ? (
          <ChevronLeft className="w-3 h-3 text-gray-400" />
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-400" />
        )}
      </button>
    </div>
  );
}