'use client'

import React from 'react';
import { X } from 'lucide-react';
import { useTabActions, useTabSelectors } from '@/features/tabs/store/useTabStore';
import { cn } from '@/lib/utils';

const TabBar = () => {
  const { getTabs, getActiveTabId } = useTabSelectors();
  const { activateTab, closeTab } = useTabActions();
  
  const tabs = getTabs();
  const activeTabId = getActiveTabId();
  
  // 탭이 없을 때는 렌더링하지 않음
  if (tabs.length === 0) {
    return (
      <div className="border-b border-dashed border-gray-300 p-2 text-center text-gray-500 text-sm">
        상단 메뉴를 클릭하여 탭을 추가하세요.
      </div>
    );
  }

  return (
    <div className="flex border-b overflow-x-auto bg-gray-50">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const Icon = tab.icon;

        return (
          <div
            key={tab.id}
            className={cn(
              "flex items-center px-3 py-2 min-w-fit cursor-pointer border-r text-sm",
              isActive
                ? "bg-white text-blue-600 border-b-2 border-b-blue-600"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
            )}
            onClick={() => activateTab(tab.id)}
          >
            {Icon && (
              <Icon className="h-4 w-4 mr-1.5" />
            )}
            <span>{tab.name}</span>
            {tab.closable && (
              <button
                className="ml-1.5 rounded-full hover:bg-gray-200 p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabBar;