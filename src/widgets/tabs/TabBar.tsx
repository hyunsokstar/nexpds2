import { X, ArrowLeftRight, ChevronLeft, ChevronRight, MoveLeft, MoveRight } from "lucide-react";
import { useMenuStore } from "@/store/tabStore";
import { useRef, useState, useEffect } from "react";
import {
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableTabProps {
  tab: {
    id: number;
    title: string;
  };
  position: 'left' | 'right';
  isActive: boolean;
  isOtherActive: boolean;
  onClose: (id: number) => void;
  onClick: () => void;
}

function DraggableTab({ tab, position, isActive, isOtherActive, onClose, onClick }: DraggableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${position}-${tab.id}`,
    data: {
      type: 'tab',
      tab,
      position,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 50 : 1,
  };

  const getTabClassName = () => {
    const baseStyle = "flex items-center px-2 h-8 rounded-t cursor-pointer border shrink-0 transition-colors duration-200 ";
    
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
      <div className={isActive ? 'font-semibold whitespace-nowrap' : 'whitespace-nowrap'}>
        {tab.title}
      </div>
      <button
        className="ml-2 text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onClose(tab.id);
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface TabBarContainerProps {
  position: 'left' | 'right';
  children: React.ReactNode;
  isDraggingOver: boolean;
}

function TabBarContainer({ position, children, isDraggingOver }: TabBarContainerProps) {
  const { setNodeRef } = useDroppable({
    id: `${position}-droppable`,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`h-full w-full transition-colors duration-200 ${
        isDraggingOver ? 'bg-blue-50' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface TabBarProps {
  position: 'left' | 'right';
}

export function TabBar({ position }: TabBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const { 
    leftTabs, 
    rightTabs, 
    activeLeftTabId, 
    activeRightTabId, 
    setActiveTab,
    closeTab,
    moveTabToOtherSide,
    reorderTabs,
    toggleSplit,
    isSplit,
  } = useMenuStore();

  const tabs = position === 'left' ? leftTabs : rightTabs;
  const activeTabId = position === 'left' ? activeLeftTabId : activeRightTabId;
  const otherActiveTabId = position === 'left' ? activeRightTabId : activeLeftTabId;

  useEffect(() => {
    const updateScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    updateScrollButtons();
    const resizeObserver = new ResizeObserver(updateScrollButtons);
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [tabs.length]);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      setIsDraggingOver(false);
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const [activePosition] = activeId.split('-');
    
    // 드래그하는 탭이 현재 영역의 것이 아닐 때만 드래그 오버 효과 표시
    if (activePosition !== position) {
      setIsDraggingOver(true);
    } else {
      setIsDraggingOver(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDraggingOver(false);
    
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const [activePosition, activeTabId] = activeId.split('-');
    const [overPosition, overTabId] = overId.split('-');

    if (activePosition !== overPosition) {
      // 다른 영역으로 이동
      moveTabToOtherSide(Number(activeTabId), activePosition as 'left' | 'right');
    } else if (!overId.endsWith('-droppable')) {
      // 같은 영역 내에서 탭 순서 변경
      reorderTabs(Number(activeTabId), Number(overTabId), position);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderControlButtons = () => {
    if (position === 'right') {
      return (
        <div className="flex items-center space-x-1">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => activeTabId && moveTabToOtherSide(activeTabId, 'right')}
            title="왼쪽으로 이동"
          >
            <MoveLeft className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-gray-100 rounded text-red-400 hover:text-red-600"
            onClick={toggleSplit}
            title="분할 해제"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        {!isSplit && (
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={toggleSplit}
            title="화면 분할"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        )}
        {isSplit && (
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => activeTabId && moveTabToOtherSide(activeTabId, 'left')}
            title="오른쪽으로 이동"
          >
            <MoveRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-10">
      <TabBarContainer position={position} isDraggingOver={isDraggingOver}>
        <div className="relative border-b px-2 flex items-center justify-between h-10">
          <div className="flex-1 relative flex items-center overflow-hidden">
            {showScrollButtons && (
              <button
                className="absolute left-0 top-0 bottom-0 px-1 hover:bg-gray-50 border-r flex items-center bg-white z-20"
                onClick={() => handleScroll('left')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div 
              ref={scrollContainerRef}
              className={`
                flex-1 flex items-center space-x-2 
                overflow-x-scroll scrollbar-none 
                ${showScrollButtons ? 'px-6' : ''}
              `}
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              <SortableContext
                items={tabs.map(tab => `${position}-${tab.id}`)}
                strategy={horizontalListSortingStrategy}
              >
                {tabs.map((tab) => (
                  <DraggableTab
                    key={tab.id}
                    tab={tab}
                    position={position}
                    isActive={tab.id === activeTabId}
                    isOtherActive={tab.id === otherActiveTabId}
                    onClose={(id: number) => closeTab(id, position)}
                    onClick={() => setActiveTab(tab.id, position)}
                  />
                ))}
              </SortableContext>
            </div>

            {showScrollButtons && (
              <button
                className="absolute right-0 top-0 bottom-0 px-1 hover:bg-gray-50 border-l flex items-center bg-white z-20"
                onClick={() => handleScroll('right')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="ml-2 flex items-center z-30 bg-white pl-2">
            {renderControlButtons()}
          </div>
        </div>
      </TabBarContainer>
    </div>
  );
}