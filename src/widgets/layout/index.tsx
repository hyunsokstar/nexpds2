"use client";

import { useState } from "react";
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

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { isSplit } = useMenuStore();
  const [leftWidth, setLeftWidth] = useState(50); // percentage

  // 로그인 페이지일 경우 children만 렌더링
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 리사이즈 핸들러 - 퍼센트 기반으로 너비 조절
  const handleResizeStop = (_e: any, _direction: any, ref: HTMLElement) => {
    const container = ref.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const newPercentage = (ref.clientWidth / containerWidth) * 100;
    const clampedPercentage = Math.min(Math.max(newPercentage, 30), 70);
    setLeftWidth(clampedPercentage);
  };

  // 리사이저블 컴포넌트 공통 설정
  const resizableProps = {
    minWidth: "30%",
    maxWidth: "70%",
    enable: { right: true },
    onResizeStop: handleResizeStop,
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 영역 */}
      <Header />

      {/* 메인 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <div className="relative z-20">
          <Sidebar />
        </div>

        {/* 탭 컨텐츠 영역 */}
        <div className="flex flex-col flex-1">
          {isSplit ? (
            // 분할 레이아웃
            <div className="flex flex-col flex-1">
              {/* 탭바 영역 */}
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
                  style={{ width: `${100 - leftWidth}%` }}
                >
                  <TabBar position="right" />
                </div>
              </div>

              {/* 컨텐츠 영역 */}
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