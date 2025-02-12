"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Resizable } from "re-resizable";
import Header from "@/widgets/header";
import Sidebar from "@/widgets/sidebar";
import { TabContent } from "@/widgets/tabs/TabContent";
import { useMenuStore } from "@/store/tabStore";
import { TabBar } from "@/widgets/tabs/TabBar";

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
  const { isSplit } = useMenuStore();
  const [leftWidth, setLeftWidth] = useState(DEFAULT_SPLIT_WIDTH);
  const [isInitialized, setIsInitialized] = useState(false);

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
            <div className="flex flex-col flex-1">
              <div className="flex">
                <Resizable
                  {...resizableProps}
                  size={{ width: `${leftWidth}%`, height: "auto" }}
                  className="border-r border-dashed border-red-400"
                >
                  <TabBar position="left" />
                </Resizable>
                <div 
                  className="border-l border-dashed border-blue-400"
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
            </div>
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