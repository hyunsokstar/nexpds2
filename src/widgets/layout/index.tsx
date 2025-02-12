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

  if (isLoginPage) {
    return <>{children}</>;
  }

  // 실시간 리사이징 핸들러
  const handleResize = (_e: any, _direction: any, ref: HTMLElement) => {
    const container = ref.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const newPercentage = (ref.clientWidth / containerWidth) * 100;
    const clampedPercentage = Math.min(Math.max(newPercentage, 30), 70);
    
    // requestAnimationFrame을 사용하여 부드러운 업데이트
    requestAnimationFrame(() => {
      setLeftWidth(clampedPercentage);
    });
  };

  // 리사이저블 컴포넌트 공통 설정
  const resizableProps = {
    minWidth: "30%",
    maxWidth: "70%",
    enable: { right: true },
    onResize: handleResize, // onResizeStop 대신 onResize 사용
  };

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
                    transition: 'width 0ms' // 트랜지션 제거로 즉시 반영
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
                    transition: 'width 0ms' // 트랜지션 제거로 즉시 반영
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