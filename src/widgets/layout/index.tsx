"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Resizable } from "re-resizable";
import Header from "@/widgets/header";
import Sidebar from "@/widgets/sidebar";
import { TabContent } from "@/widgets/tabs/TabContent";
import { useMenuStore } from "@/store/tabStore";
import { TabBar } from "@/widgets/tabs/TabBar";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

interface AppLayoutProps {
  children: React.ReactNode;
}

// 분할 비율을 localStorage에 저장하고 불러오는 유틸리티 함수
const SPLIT_WIDTH_KEY = 'split-view-width';
const DEFAULT_SPLIT_WIDTH = 50;

const getSavedSplitWidth = () => {
  if (typeof window === 'undefined') return DEFAULT_SPLIT_WIDTH;
  const saved = localStorage.getItem(SPLIT_WIDTH_KEY);
  return saved ? parseFloat(saved) : DEFAULT_SPLIT_WIDTH;
};

const saveSplitWidth = (width: number) => {
  localStorage.setItem(SPLIT_WIDTH_KEY, width.toString());
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { 
    isSplit, 
    leftTabs, 
    rightTabs,
    moveTabToOtherSide,
    reorderTabs,
  } = useMenuStore();
  
  const [leftWidth, setLeftWidth] = useState(DEFAULT_SPLIT_WIDTH);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 초기 상태 로드
  useEffect(() => {
    setLeftWidth(getSavedSplitWidth());
    setIsInitialized(true);
  }, []);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleResize = (_e: any, _direction: any, ref: HTMLElement) => {
    const container = ref.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const newPercentage = (ref.clientWidth / containerWidth) * 100;
    const clampedPercentage = Math.min(Math.max(newPercentage, 30), 70);
    
    requestAnimationFrame(() => {
      setLeftWidth(clampedPercentage);
      saveSplitWidth(clampedPercentage);
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const [activePosition, activeTabId] = activeId.split('-');

    // 드롭 가능한 영역의 ID에서 position 추출
    const overId = over.id as string;
    const overPosition = overId.split('-')[0];

    if (activePosition !== overPosition) {
      // 다른 영역으로 이동 (droppable 영역으로 드롭된 경우)
      if (overId.endsWith('-droppable')) {
        moveTabToOtherSide(Number(activeTabId), activePosition as 'left' | 'right');
      }
    } else {
      // 같은 영역 내에서 순서 변경 (탭에 직접 드롭된 경우)
      const [_, overTabId] = over.id.toString().split('-');
      if (!overId.endsWith('-droppable')) {
        reorderTabs(
          Number(activeTabId),
          Number(overTabId),
          activePosition as 'left' | 'right'
        );
      }
    }

    setActiveId(null);
  };

  const resizableProps = {
    minWidth: "30%",
    maxWidth: "70%",
    enable: { right: true },
    onResize: handleResize,
  };

  // 초기화 전에는 투명하게 처리
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen opacity-0">
        <Header />
        <div className="flex flex-1" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="relative z-20">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1">
          {isSplit ? (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col flex-1">
                <div className="flex h-10">
                  <Resizable
                    {...resizableProps}
                    size={{ width: `${leftWidth}%`, height: "auto" }}
                    className="border-r border-dashed border-red-400"
                  >
                    <div className="h-full">
                      <TabBar position="left" />
                    </div>
                  </Resizable>
                  <div 
                    className="border-l border-dashed border-blue-400 h-full"
                    style={{ 
                      width: `${100 - leftWidth}%`,
                      transition: 'width 0ms'
                    }}
                  >
                    <TabBar position="right" />
                  </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  <Resizable
                    {...resizableProps}
                    size={{ width: `${leftWidth}%`, height: "auto" }}
                    className="border-r border-dashed border-red-400 overflow-auto"
                  >
                    <TabContent position="left" />
                  </Resizable>
                  <div 
                    className="border-l border-dashed border-blue-400 overflow-auto"
                    style={{ 
                      width: `${100 - leftWidth}%`,
                      transition: 'width 0ms'
                    }}
                  >
                    <TabContent position="right" />
                  </div>
                </div>

                <DragOverlay>
                  {activeId ? (
                    <div className="bg-white border border-dashed border-blue-400 px-2 py-1 rounded shadow-lg">
                      {[...leftTabs, ...rightTabs].find(
                        tab => `${tab.position}-${tab.id}` === activeId
                      )?.title}
                    </div>
                  ) : null}
                </DragOverlay>
              </div>
            </DndContext>
          ) : (
            <>
              <TabBar position="left" />
              <div className="flex-1 overflow-auto">
                <TabContent position="left" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}