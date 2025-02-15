"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleButtonProps {
  isOpen: boolean;
  className?: string;
  onClick: () => void;
}

export function SidebarToggleButton({ isOpen, onClick, className }: SidebarToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-16 right-[-8px]", // 📌 버튼을 경계선 오른쪽으로 이동
        "w-7 h-9 flex items-center justify-center", // 📌 클릭 영역 확대
        "bg-white border border-gray-300 rounded-lg shadow-sm",
        "hover:bg-gray-100 hover:border-gray-400",
        "transition-all duration-300 ease-in-out",
        "z-30", // 📌 다른 요소보다 우선 배치
        className
      )}
    >
      {!isOpen ? (
        <ChevronRight className="w-5 h-5 text-gray-600" />
      ) : (
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}
