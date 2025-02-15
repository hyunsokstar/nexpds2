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

// 로컬 스토리지에 사이드 뷰 너비를 저장/로드하는 키
const SPLIT_WIDTH_KEY = "split-view-width";
const DEFAULT_SPLIT_WIDTH = 50;

interface AppLayoutProps {
  children: React.ReactNode;
}

// 로컬 스토리지에서 사이드 뷰 너비를 가져오는 함수
const getSavedSplitWidth = () => {
  if (typeof window === "undefined") return DEFAULT_SPLIT_WIDTH;
  const saved = localStorage.getItem(SPLIT_WIDTH_KEY);
  return saved ? parseFloat(saved) : DEFAULT_SPLIT_WIDTH;
};

// 로컬 스토리지에 사이드 뷰 너비를 저장하는 함수
const saveSplitWidth = (width: number) => {
  localStorage.setItem(SPLIT_WIDTH_KEY, width.toString());
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // 탭/분할 관리 로직
  const {
    isSplit,
    leftTabs,
    rightTabs,
    moveTabToOtherSide,
    reorderTabs,
  } = useMenuStore();

  // 사이드 분할 너비 상태
  const [leftWidth, setLeftWidth] = useState(DEFAULT_SPLIT_WIDTH);
  // 로컬 스토리지에서 초기 값 로딩이 끝났는지
  const [isInitialized, setIsInitialized] = useState(false);
  // DnD(드래그 앤 드롭) 중인 탭 ID
  const [activeId, setActiveId] = useState<string | null>(null);

  // DnD-kit 센서
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 페이지 첫 로딩 시, 로컬 스토리지에 저장된 사이드 뷰 너비 로드
  useEffect(() => {
    setLeftWidth(getSavedSplitWidth());
    setIsInitialized(true);
  }, []);

  // 로그인 페이지면 레이아웃 없이 children만
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Re-resizable 콜백
  const handleResize = (
    _e: MouseEvent | TouchEvent,
    _direction:
      | "top"
      | "right"
      | "bottom"
      | "left"
      | "topRight"
      | "bottomRight"
      | "bottomLeft"
      | "topLeft",
    ref: HTMLElement
  ) => {
    const container = ref.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const newPercentage = (ref.clientWidth / containerWidth) * 100;
    // 30% ~ 70% 사이로 제한
    const clampedPercentage = Math.min(Math.max(newPercentage, 30), 70);

    requestAnimationFrame(() => {
      setLeftWidth(clampedPercentage);
      saveSplitWidth(clampedPercentage);
    });
  };

  // DnD-kit 이벤트들
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

    // 다른 영역으로 끌려가면 표시
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

    // 다른 영역으로 이동 시
    if (activePosition !== overPosition) {
      moveTabToOtherSide(
        Number(activeTabId),
        activePosition as "left" | "right"
      );
    }
    // 같은 영역 내부에서 순서 변경
    else if (!overId.endsWith("-droppable")) {
      reorderTabs(
        Number(activeTabId),
        Number(overTabId),
        activePosition as "left" | "right"
      );
    }
  };

  // Re-resizable 기본 옵션
  const resizableProps = {
    minWidth: "30%",
    maxWidth: "70%",
    enable: { right: true },
    onResize: handleResize,
  };

  // 아직 로컬 스토리지 값 로딩 전이면 임시 레이아웃
  if (!isInitialized) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1" />
        <footer className="h-8 bg-gray-100 border-t">푸터</footer>
      </div>
    );
  }

  // 분할 뷰일 때와 아닐 때 각각 다른 레이아웃
  const mainContent = isSplit ? (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* 상단 탭 바 영역 */}
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
            transition: "width 0ms",
          }}
        >
          <TabBar position="right" />
        </div>
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="flex flex-1 ">
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
            transition: "width 0ms",
          }}
        >
          <TabContent position="right" />
        </div>
      </div>

      {/* 드래그 오버레이 (드래그 중인 탭 표시) */}
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
  ) : (
    // 스플릿이 아닐 때는 단일 탭 바 + 단일 컨텐츠
    <>
      <TabBar position="left" />
      <div className="flex-1 overflow-auto">
        <TabContent position="left" />
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <Header />

      {/* 본문(사이드바 + 탭 컨텐츠) */}
      <div className="flex flex-1">
        <div className="relative z-20 max-h-full overflow-y-auto border-r">
          <Sidebar />
        </div>

        {/* 우측 메인 영역: 탭/분할 뷰 */}
        <div className="flex flex-col flex-1">
          {/* 위의 mainContent 렌더링 */}
          <div className="flex flex-col flex-1">{mainContent}</div>

          {/* 푸터. 사이드바와 ‘같은 선상’에서 하단에 위치 */}
          <CommonFooter />
        </div>
      </div>
    </div>
  );
}