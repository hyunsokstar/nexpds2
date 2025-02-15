"use client";

import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  MoveLeft,
  MoveRight,
  X,
} from "lucide-react";
import { useMenuStore } from "@/store/tabStore";
import { useRef, useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableTab } from "./DraggableTab";

interface TabBarProps {
  position: "left" | "right";
}

export function TabBar({ position }: TabBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

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

  const tabs = position === "left" ? leftTabs : rightTabs;
  const activeTabId = position === "left" ? activeLeftTabId : activeRightTabId;
  const otherActiveTabId = position === "left" ? activeRightTabId : activeLeftTabId;
  const hasTabs = tabs.length > 0;

  const { setNodeRef, isOver } = useDroppable({
    id: `${position}-droppable`,
  });

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

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full h-10 border-b border-gray-300 pl-2">
      <div
        ref={setNodeRef}
        className={`h-full w-full flex items-center transition-colors duration-200 ${
          isOver ? "bg-blue-100 border-blue-400" : "border-gray-300"
        }`}
      >
        {/* 탭 목록 영역 */}
        <div className="flex-1 min-w-0 relative flex items-center">
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto no-scrollbar"
          >
            <div className="flex space-x-2">
              <SortableContext
                items={tabs.map((tab) => `${position}-${tab.id}`)}
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
          </div>

          {showScrollButtons && (
            <>
              <button
                className="absolute left-0 top-0 bottom-0 px-1 hover:bg-gray-50 border-r flex items-center bg-white"
                onClick={() => handleScroll("left")}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="absolute right-0 top-0 bottom-0 px-1 hover:bg-gray-50 border-l flex items-center bg-white"
                onClick={() => handleScroll("right")}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* 오른쪽 버튼 영역 */}
        <div className="flex-none flex items-center space-x-1 px-2 border-l border-gray-300 h-full bg-white">
          {position === "right" ? (
            <>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => activeTabId && moveTabToOtherSide(activeTabId, "right")}
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
            </>
          ) : (
            <>
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
                  onClick={() => activeTabId && moveTabToOtherSide(activeTabId, "left")}
                  title="오른쪽으로 이동"
                >
                  <MoveRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}