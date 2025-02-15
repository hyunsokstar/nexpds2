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
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

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

  const { setNodeRef, isOver } = useDroppable({
    id: `${position}-droppable`,
  });

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      const resizeObserver = new ResizeObserver(updateScrollButtons);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener('scroll', updateScrollButtons);
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    updateScrollButtons();
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
    <div className="w-full h-10 border-b border-gray-300">
      <div
        ref={setNodeRef}
        className={`h-full w-full flex items-center transition-colors duration-200 ${
          isOver ? "bg-blue-100 border-blue-400" : "border-gray-300"
        }`}
      >
        {/* 탭 영역 컨테이너 */}
        <div className="flex-1 flex items-center min-w-0 relative px-2">
          {/* 왼쪽 스크롤 버튼 */}
          {showScrollButtons && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full bg-white border"
              onClick={() => handleScroll("left")}
              disabled={!showLeftButton}
              style={{ opacity: showLeftButton ? 1 : 0.5 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* 탭 목록 */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-hidden"
            style={{
              marginLeft: showScrollButtons ? '1.5rem' : '0',
              marginRight: showScrollButtons ? '1.5rem' : '0',
            }}
          >
            <div className="flex space-x-1">
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

          {/* 오른쪽 스크롤 버튼 */}
          {showScrollButtons && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full bg-white border"
              onClick={() => handleScroll("right")}
              disabled={!showRightButton}
              style={{ opacity: showRightButton ? 1 : 0.5 }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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