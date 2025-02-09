"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTabStore } from "@/store/tabStore";
import { MenuItem, menuItems } from "@/widgets/header/model/menuItems";
import React from "react";
import CustomAlert from "@/shared/notice-message/CustomAlert";
import { Button } from "@/shared/ui/button";
import { MenuItemButton } from "@/widgets/header/components/MenuItemButton";

const errorMessage = {
  isOpen: false,
  message: "",
  title: "로그인",
  type: "0",
};

export default function Header() {
  const router = useRouter();
  const [alertState, setAlertState] = React.useState(errorMessage);

  const {
    addTab,
    removeTab,
    openedTabs,
    duplicateTab,
    activeTabId,
    activeTabKey,
    getTabCountById,
    setCampaignIdForUpdateFromSideMenu,
  } = useTabStore();

  const handleMenuClick = (item: MenuItem, event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.ctrlKey) {
      duplicateTab(item.id);
    } else {
      const existingTabs = openedTabs.filter((tab) => tab.id === item.id);
      existingTabs.forEach((tab) => {
        removeTab(tab.id, tab.uniqueKey);
      });

      const newTabKey = `${item.id}-${Date.now()}`;
      addTab({
        ...item,
        uniqueKey: newTabKey,
        content: item.content || null,
      });
    }
    setCampaignIdForUpdateFromSideMenu(null);
  };

  const isTabOpened = (itemId: number) => {
    return openedTabs.some((tab) => tab.id === itemId);
  };

  const isActiveTab = (itemId: number) => {
    return openedTabs.some((tab) => tab.id === itemId && tab.id === activeTabId && tab.uniqueKey === activeTabKey);
  };

  const handleLoginOut = () => {
    document.cookie = "session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div className="flex flex-col mx-1">
      {/* 상단 바 */}
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

      {/* 헤더 네비게이션 */}
      <header className="bg-white border-b mt-1 px-4">
        <div className="flex items-center h-24">
          <nav className="flex gap-2 overflow-x-auto py-2">
            {menuItems.map((item) => (
              <MenuItemButton
                key={`menu-${item.id}`}
                icon={item.icon}
                title={item.title}
                isActive={isActiveTab(item.id)}
                isOpened={isTabOpened(item.id)}
                count={getTabCountById(item.id)}
                onClick={(e) => handleMenuClick(item, e)}
              />
            ))}
          </nav>
        </div>
      </header>

      {/* 커스텀 알림 */}
      <CustomAlert
        message={alertState.message}
        title={alertState.title}
        type={alertState.type}
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}