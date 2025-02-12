// src/widgets/layout/index.tsx
"use client";

import Header from "@/widgets/header";
import Sidebar from "@/widgets/sidebar";
import { usePathname } from "next/navigation";
import { TabContent } from "@/widgets/tabs/TabContent";
import { useMenuStore } from "@/store/tabStore";
import { TabBar } from "@/widgets/tabs/TabBar";
import { useState } from "react";
import { ResizeHandle } from "../tabs/ResizeHandle";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { isSplit } = useMenuStore();
  const [leftWidth, setLeftWidth] = useState(50); // percentage

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleResize = (newWidth: number) => {
    const container = document.querySelector('.flex.flex-1.overflow-hidden');
    if (!container) return;

    const containerWidth = container.clientWidth;
    const newPercentage = (newWidth / containerWidth) * 100;
    // 최소/최대 퍼센트 제한
    const clampedPercentage = Math.min(Math.max(newPercentage, 30), 70);
    setLeftWidth(clampedPercentage);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <Header />

      {/* 메인 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 - z-index 추가 */}
        <div className="relative z-20">
          <Sidebar />
        </div>

        {/* 탭 컨텐츠 영역 */}
        <div className="flex flex-col flex-1">
          {isSplit ? (
            // 분할된 레이아웃
            <div className="flex flex-col flex-1">
              {/* 탭바 */}
              <div className="flex">
                <div 
                  className="relative border-r border-dashed border-red-400"
                  style={{ width: `${leftWidth}%` }}
                >
                  <TabBar position="left" />
                  <ResizeHandle onResize={handleResize} />
                </div>
                <div 
                  className="border-l border-dashed border-blue-400"
                  style={{ width: `${100 - leftWidth}%` }}
                >
                  <TabBar position="right" />
                </div>
              </div>

              {/* 컨텐츠 */}
              <div className="flex flex-1 overflow-hidden">
                <div 
                  className="relative border-r border-dashed border-red-400 overflow-auto"
                  style={{ width: `${leftWidth}%` }}
                >
                  <TabContent position="left" />
                  <ResizeHandle onResize={handleResize} />
                </div>
                <div 
                  className="border-l border-dashed border-blue-400 overflow-auto"
                  style={{ width: `${100 - leftWidth}%` }}
                >
                  <TabContent position="right" />
                </div>
              </div>
            </div>
          ) : (
            // 단일 레이아웃
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