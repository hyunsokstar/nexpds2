// widgets/tabs/TabBar.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { useMenuStore } from "@/store/tabStore";

export function TabBar() {
  const { openedTabs, activeTabId, setActiveTab, closeTab } = useMenuStore();

  if (openedTabs.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-10">
      {/* 배경을 5:5로 나누는 레이어 */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-red-200"></div>
        <div className="w-1/2 bg-blue-200"></div>
      </div>

      {/* 탭 바 */}
      <div className="relative border-b px-2 flex items-center space-x-2 h-10">
        {openedTabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center px-2 h-8 rounded-t cursor-pointer 
              ${tab.id === activeTabId ? "bg-white border-x border-t border-b-0" : ""}
            `}
            onClick={() => setActiveTab(tab.id)}
          >
            <div>{tab.title}</div>
            <button
              className="ml-2 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
