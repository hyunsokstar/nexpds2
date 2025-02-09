// widgets/sidebar/ui/TreeItem.tsx
"use client";

import { FolderIcon, FileIcon, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface TreeItemProps {
  label: string;
  level: number;
  type: 'folder' | 'file';
  isOpen?: boolean;
  variant?: 'default' | 'blue' | 'red' | 'green';
  onToggle?: () => void;
}

export function TreeItem({ 
  label, 
  level, 
  type, 
  isOpen = false, 
  variant = 'default',
  onToggle 
}: TreeItemProps) {
  const padding = level * 20;
  
  const getIcon = () => {
    if (type === 'folder') return <FolderIcon className="w-4 h-4 text-yellow-500" />;
    return <FileIcon className={cn(
      "w-4 h-4",
      variant === 'blue' && "text-blue-500",
      variant === 'red' && "text-red-500",
      variant === 'green' && "text-green-500"
    )} />;
  };

  return (
    <div
      className={cn(
        "flex items-center py-1.5 hover:bg-gray-100 cursor-pointer text-sm relative",
        level > 0 && "ml-3"  // 내부 점선 제거, 들여쓰기만 유지
      )}
      style={{ paddingLeft: `${padding}px` }}
      onClick={onToggle}
    >
      {type === 'folder' && (
        <div className="w-4 h-4 mr-1">
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      )}
      {getIcon()}
      <span className={cn(
        "ml-2",
        type === 'folder' && "font-medium"
      )}>
        {label}
      </span>
    </div>
  );
}