// widgets/tabs/TabBar.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { useMenuStore } from "@/store/tabStore";

export function TabBar() {
  const { openedTabs, activeTabId, setActiveTab, closeTab } = useMenuStore();

  if (openedTabs.length === 0) {
    // 만약 탭이 하나도 없으면 표시 안 하는 식으로
    return null;
  }

  return (
    <div className="bg-gray-100 border-b px-2 flex items-center space-x-2 h-10">
      {openedTabs.map((tab) => (
        <div
          key={tab.id}
          className={`
            flex items-center px-2 h-8 rounded-t
            cursor-pointer
            ${tab.id === activeTabId ? "bg-white border-x border-t border-b-0" : ""}
          `}
        >
          <div onClick={() => setActiveTab(tab.id)}>
            {tab.title}
          </div>
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
  );
}
