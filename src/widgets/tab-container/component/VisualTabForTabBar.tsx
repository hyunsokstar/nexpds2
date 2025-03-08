'use client'

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisualTabProps {
  id: string;
  name: string;
  icon: React.ElementType;
  isActive: boolean;
  closable?: boolean;
  onClick: () => void;
  onClose?: (id: string) => void;
}

const VisualTabForTabBar = ({
  id,
  name,
  icon: Icon,
  isActive,
  closable,
  onClick,
  onClose
}: VisualTabProps) => {
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose && onClose(id);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 mx-1 my-1 min-w-fit cursor-pointer rounded-sm text-sm transition-all",
        "border border-dashed",
        isActive 
          ? "bg-teal-50 border-teal-300 text-teal-700" 
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
      )}
      onClick={onClick}
    >
      {Icon && (
        <Icon className={cn(
          "h-4 w-4",
          isActive ? "text-teal-600" : "text-gray-500"
        )} />
      )}
      <span className={isActive ? "font-medium" : ""}>{name}</span>
      {closable && (
        <button
          className="ml-1 rounded-full p-0.5 hover:bg-gray-200 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};
    
export default VisualTabForTabBar;