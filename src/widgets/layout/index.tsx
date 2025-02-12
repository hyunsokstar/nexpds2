// src/widgets/layout/index.tsx
"use client";

import Header from "@/widgets/header";
import Sidebar from "@/widgets/sidebar";
import { usePathname } from "next/navigation";
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

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <Header />

      {/* 메인 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <Sidebar />

        {/* 탭 컨텐츠 영역 */}
        <div className="flex flex-col flex-1">
          {isSplit ? (
            // 분할된 레이아웃
            <div className="flex flex-col flex-1">
              {/* 탭바 */}
              <div className="flex">
                <div className="w-1/2 border-r border-dashed border-red-400">
                  <TabBar position="left" />
                </div>
                <div className="w-1/2 border-l border-dashed border-blue-400">
                  <TabBar position="right" />
                </div>
              </div>

              {/* 컨텐츠 */}
              <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 border-r border-dashed border-red-400 overflow-auto">
                  <TabContent position="left" />
                </div>
                <div className="w-1/2 border-l border-dashed border-blue-400 overflow-auto">
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