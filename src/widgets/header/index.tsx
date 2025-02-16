"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Button } from "@/shared/ui/button";
import { MenuItemButton } from "@/widgets/header/components/MenuItemButton";
import { useMenuStore } from "@/store/tabStore";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();

  const { 
    activeId, 
    activeLeftTabId, 
    activeRightTabId,
    leftTabs,
    rightTabs,
    setActiveMenu, 
    getAllMenus, 
    addOrActivateTab 
  } = useMenuStore();
  
  const menuItems = getAllMenus();

  const handleLoginOut = () => {
    document.cookie = "session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  // 메뉴 아이템이 활성화 상태인지 확인
  const isMenuActive = (menuId: number) => {
    // activeId가 직접적으로 현재 메뉴 ID와 일치하는지 확인
    return activeId === menuId;
  };

  // 메뉴 아이템이 탭으로 등록되어 있는지 확인
  const isMenuRegistered = (menuId: number) => {
    return leftTabs.some(tab => tab.menuId === menuId) || 
           rightTabs.some(tab => tab.menuId === menuId);
  };

  // 헤더 메뉴 클릭 시
  const handleMenuClick = (menuId: number, event: React.MouseEvent) => {
    const target = menuItems.find((m) => m.id === menuId);
    if (target) {
      const forceDuplicate = event.ctrlKey;
      const position = event.ctrlKey ? 'right' : 'left';
      setActiveMenu(menuId);  // 메뉴 ID를 먼저 활성화
      addOrActivateTab(target, position, forceDuplicate);
    }
  };

  return (
    <div className={cn("w-full z-50", className)}>
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
              isActive={isMenuActive(item.id)}
              isRegistered={isMenuRegistered(item.id)}
              onClick={(e: React.MouseEvent) => handleMenuClick(item.id, e)}
            />
          ))}
        </nav>
      </header>
    </div>
  );
}