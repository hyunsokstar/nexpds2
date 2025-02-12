// widgets/tabs/SortableTab.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { TabInfo } from '@/store/tabStore';

interface SortableTabProps {
  tab: TabInfo;
  position: 'left' | 'right';
  isActive: boolean;
  onClose: () => void;
  onActivate: () => void;
}

export function SortableTab({ 
  tab, 
  position, 
  isActive, 
  onClose, 
  onActivate 
}: SortableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: tab.id,
    data: {
      position
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center px-2 h-8 rounded-t cursor-pointer 
        ${isActive ? "bg-white border-x border-t border-b-0" : ""}
        ${isDragging ? "z-50" : ""}
      `}
      onClick={onActivate}
    >
      <div>{tab.title}</div>
      <button
        className="ml-2 text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}