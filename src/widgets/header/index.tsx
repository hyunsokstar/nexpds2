"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { MenuItemButton } from "@/widgets/header/components/MenuItemButton";
import { useMenuStore } from "@/store/tabStore";
import { cn } from "@/lib/utils";
import { Layout } from 'lucide-react';
import { SplitScreenDialog } from "./ui/SplitScreenDialog";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { 
    activeId, 
    activeLeftTabId, 
    activeRightTabId,
    leftTabs,
    rightTabs,
    setActiveMenu, 
    getAllMenus, 
    addOrActivateTab,
    splitScreenMode,
    setSplitScreenMode 
  } = useMenuStore();
  
  const menuItems = getAllMenus();

  const handleLoginOut = () => {
    document.cookie = "session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const isMenuActive = (menuId: number) => {
    return activeId === menuId;
  };

  const isMenuRegistered = (menuId: number) => {
    return leftTabs.some(tab => tab.menuId === menuId) || 
           rightTabs.some(tab => tab.menuId === menuId);
  };

  const handleMenuClick = (menuId: number, event: React.MouseEvent) => {
    const target = menuItems.find((m) => m.id === menuId);
    if (target) {
      const forceDuplicate = event.ctrlKey;
      const position = event.ctrlKey ? 'right' : 'left';
      setActiveMenu(menuId);
      addOrActivateTab(target, position, forceDuplicate);
    }
  };

  const totalTabs = leftTabs.length + rightTabs.length;
  const canSplitScreen = totalTabs > 2;

  const applySplitScreen = () => {
    if (!canSplitScreen) return;
    
    // 4개의 탭을 2x2 그리드로 재배치
    const allTabs = [...leftTabs, ...rightTabs];
    const upperTabs = allTabs.slice(0, 2);
    const lowerTabs = allTabs.slice(2, 4);

    // 기존 탭들을 모두 제거하고 새로운 레이아웃으로 재배치
    upperTabs.forEach(tab => {
      addOrActivateTab(tab, 'upper', false);
    });

    lowerTabs.forEach(tab => {
      addOrActivateTab(tab, 'lower', false);
    });

    setSplitScreenMode(true);
  };

  return (
    <div className={cn("w-full z-50", className)}>
      <div className="header-top bg-[#5BC2C1] h-[28px] flex items-center">
        <div className="px-4 flex justify-between items-center w-full">
          <div className="flex items-center">
            <Image 
              src="/header-menu/nexpds-logo.svg" 
              alt="NEXPDS" 
              width={66} 
              height={11} 
              priority 
            />
          </div>
          <div className="flex items-center space-x-4 text-white text-sm">
            <div className="flex items-center space-x-1">
              <Image 
                src="/header-menu/top_pic.svg" 
                alt="사용자" 
                width={18} 
                height={18} 
                priority 
              />
              <span>홍길동(관리자)</span>
            </div>
            <Button
              variant="ghost"
              className="flex items-center space-x-1 text-sm text-white hover:bg-[#56CAD6]/20"
              onClick={handleLoginOut}
            >
              <Image 
                src="/header-menu/log-out.svg" 
                alt="로그아웃" 
                width={14} 
                height={10} 
                priority 
              />
            </Button>
          </div>
        </div>
      </div>

      <header className="bg-white border-b px-4 h-24 flex items-center">
        <nav className="flex-1 flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto py-2">
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
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsDialogOpen(true)}
            className="ml-4 flex items-center space-x-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSplitScreen}
          >
            <Layout className="w-5 h-5" />
            <span>화면 분할</span>
          </Button>
        </nav>
      </header>

      <SplitScreenDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        tabs={[...leftTabs, ...rightTabs]}
        onApply={applySplitScreen}
      />
    </div>
  );
}