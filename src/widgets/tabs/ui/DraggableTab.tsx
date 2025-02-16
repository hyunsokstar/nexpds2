// widgets/tabs/ui/DraggableTab.tsx
"use client";

import { X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TabData {
  tabId: number;
  menuId: number;
  title: string;
  icon?: string;
  position: "left" | "right";
  originalPosition: "left" | "right";
}

interface DraggableTabProps {
  tab: TabData;
  position: "left" | "right";
  isActive: boolean;
  isOtherActive: boolean;
  onClose: (tabId: number) => void;
  onClick: () => void;
}

export function DraggableTab({
  tab,
  position,
  isActive,
  isOtherActive,
  onClose,
  onClick,
}: DraggableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${position}-${tab.tabId}`,
    data: {
      type: "tab",
      tab,
      position,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // 드래그 중 탭을 약간 투명하게 하거나, 필요 없다면 1 로 두셔도 됩니다.
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : 1,
  };

  // 탭에 적용할 Tailwind 클래스
  const getTabClassName = () => {
    const baseStyle =
      "text-black flex items-center px-2 h-8 rounded-t cursor-pointer border " +
      "shrink-0 transition-all duration-200 ";

    if (isActive) {
      return `${baseStyle} bg-white border-dashed border-2 border-blue-400`;
    } else if (isOtherActive) {
      return `${baseStyle} bg-white border-dashed border border-blue-400`;
    } else {
      return `${baseStyle} border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={getTabClassName()}
      onClick={onClick}
    >
      <div className={isActive ? "font-semibold whitespace-nowrap" : "whitespace-nowrap"}>
        {tab.title}
      </div>

      <button
        className="ml-2 text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onClose(tab.tabId);
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
