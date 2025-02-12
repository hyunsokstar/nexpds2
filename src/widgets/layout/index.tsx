"use client";

import Header from "@/widgets/header";
import Sidebar from "@/widgets/sidebar";
import { usePathname } from "next/navigation";
import { TabBar } from "@/widgets/tabs/TabBar";
import { TabContent } from "@/widgets/tabs/TabContent";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // 로그인 페이지는 기존처럼 단독
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1) 헤더 (가로 전체) */}
      <Header />

      {/* 2) 아래 영역: flex 로 좌우 나누기 */}
      <div className="flex flex-1">
        {/* 사이드바: 왼쪽 일부 (고정 폭) */}
        <Sidebar />

        {/* 오른쪽 영역: 탭바 + 메인 컨텐츠를 수직으로 */}
        <div className="flex flex-col flex-1">
          {/* 탭바 (상단) */}
          <TabBar />

          {/* 메인 컨텐츠 (하단) */}
          <main className="flex-1 px-4 pt-2">
            <TabContent />
          </main>
        </div>
      </div>
    </div>
  );
}
