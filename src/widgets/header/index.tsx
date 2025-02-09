// C:\Users\terec\super\nexpds2\src\widgets\header\index.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Button } from "@/shared/ui/button";
import { MenuItemButton } from "@/widgets/header/components/MenuItemButton";
import { useMenuStore } from "@/store/tabStore";

export default function Header() {
  const router = useRouter();
  const { activeId, setActiveMenu, getAllMenus } = useMenuStore();
  const menuItems = getAllMenus();

  const handleLoginOut = () => {
    document.cookie = "session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    // 헤더 전체를 fixed로 잡고, 최상단(z-50)으로 올려줌
    <div className="fixed top-0 left-0 w-full z-50">
      {/* 상단 얇은 바 */}
      <div className="header-top bg-[#5BC2C1] h-[28px] flex items-center">
        <div className="px-4 flex justify-between items-center w-full">
          <div className="flex items-center">
            <Image src="/header-menu/nexpds-logo.svg" alt="NEXPDS" width={66} height={11} priority />
          </div>
          <div className="flex items-center space-x-4 text-white text-sm">
            <div className="flex items-center space-x-1">
              <Image src="/header-menu/top_pic.svg" alt="사용자" width={18} height={18} priority />
              <span>홍길동(관리자)</span>
            </div>
            <Button
              variant="ghost"
              className="flex items-center space-x-1 text-sm text-white hover:bg-[#56CAD6]/20"
              onClick={handleLoginOut}
            >
              <Image src="/header-menu/log-out.svg" alt="로그아웃" width={14} height={10} priority />
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 헤더 부분 */}
      <header className="bg-white border-b px-4 h-24 flex items-center">
        <nav className="flex gap-2 overflow-x-auto py-2">
          {menuItems.map((item) => (
            <MenuItemButton
              key={`menu-${item.id}`}
              icon={item.icon}
              title={item.title}
              isActive={activeId === item.id}
              onClick={() => setActiveMenu(item.id)}
            />
          ))}
        </nav>
      </header>
    </div>
  );
}
