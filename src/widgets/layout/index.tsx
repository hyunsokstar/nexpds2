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
  DragOverEvent,
} from "@dnd-kit/core";
import CommonFooter from "../footer";

const SPLIT_WIDTH_KEY = "split-view-width";
const DEFAULT_SPLIT_WIDTH = 50;

interface AppLayoutProps {
  children: React.ReactNode;
}

const getSavedSplitWidth = () => {
  if (typeof window === "undefined") return DEFAULT_SPLIT_WIDTH;
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

  useEffect(() => {
    setLeftWidth(getSavedSplitWidth());
    setIsInitialized(true);
  }, []);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleResize = (
    _e: MouseEvent | TouchEvent,
    _direction: "top" | "right" | "bottom" | "left" | "topRight" | "bottomRight" | "bottomLeft" | "topLeft",
    ref: HTMLElement
  ) => {
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

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();
    const [activePosition] = activeId.split("-");
    const [overPosition] = overId.split("-");

    if (activePosition !== overPosition) {
      event.active.data.current = {
        ...event.active.data.current,
        isOverOtherArea: true,
      };
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();
    const [activePosition, activeTabId] = activeId.split("-");
    const [overPosition, overTabId] = overId.split("-");

    if (activePosition !== overPosition) {
      moveTabToOtherSide(
        Number(activeTabId),
        activePosition as "left" | "right"
      );
    } else if (!overId.endsWith("-droppable")) {
      reorderTabs(
        Number(activeTabId),
        Number(overTabId),
        activePosition as "left" | "right"
      );
    }
  };

  const resizableProps = {
    minWidth: "30%",
    maxWidth: "70%",
    enable: { right: true },
    onResize: handleResize,
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen">
        <Header className="flex-shrink-0" />
        <div className="flex-1 min-h-0" />
        <CommonFooter />
      </div>
    );
  }

  const mainContent = (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* 상단 탭 바 영역 */}
      {isSplit ? (
        <div className="flex h-10 flex-shrink-0">
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
              transition: "width 0ms",
            }}
          >
            <TabBar position="right" />
          </div>
        </div>
      ) : (
        <div className="flex h-10 flex-shrink-0">
          <TabBar position="left" />
        </div>
      )}

      {/* 탭 콘텐츠 영역 */}
      {isSplit ? (
        <div className="flex flex-1 min-h-0">
          <Resizable
            {...resizableProps}
            size={{ width: `${leftWidth}%`, height: "auto" }}
            className="border-r border-dashed border-red-400"
          >
            <div className="h-full overflow-auto">
              <TabContent position="left" />
            </div>
          </Resizable>
          <div
            style={{
              width: `${100 - leftWidth}%`,
              transition: "width 0ms",
            }}
            className="border-l border-dashed border-blue-400"
          >
            <div className="h-full overflow-auto">
              <TabContent position="right" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-auto">
            <TabContent position="left" />
          </div>
        </div>
      )}

      <DragOverlay>
        {activeId ? (
          <div className="bg-white border border-dashed border-blue-400 px-2 py-1 rounded shadow-lg">
            {[...leftTabs, ...rightTabs].find(
              (tab) => `${tab.position}-${tab.id}` === activeId
            )?.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <Header className="flex-shrink-0" />

      {/* 본문(사이드바 + 탭 컨텐츠) */}
      <div className="flex flex-1 min-h-0">
        <div className="w-64 flex-shrink-0 border-r overflow-auto">
          <Sidebar />
        </div>

        {/* 우측 메인 영역: 탭/분할 뷰 */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* 탭 컨텐츠 */}
          <div className="flex flex-col flex-1 min-h-0">
            {mainContent}
          </div>

          {/* 푸터 */}
          <CommonFooter />
        </div>
      </div>
    </div>
  );
}