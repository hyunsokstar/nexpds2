'use client'

import React from 'react';
import { useTabActions, useTabSelectors } from '@/features/tabs/store/useTabStore';
import VisualTabForTabBar from '../component/VisualTabForTabBar';

const TabBar = () => {
  const { getTabs, getActiveTabId } = useTabSelectors();
  const { activateTab, closeTab } = useTabActions();
  
  const tabs = getTabs();
  const activeTabId = getActiveTabId();
  
  // 탭이 없을 때는 렌더링하지 않음
  if (tabs.length === 0) {
    return (
      <div className="border-b border-gray-100 p-2 text-center text-gray-500 text-sm bg-white">
        상단 메뉴를 클릭하여 탭을 추가하세요.
      </div>
    );
  }

  return (
    <div className="flex border-b border-gray-100 overflow-x-auto bg-white p-0.5">
      {tabs.map((tab) => (
        <VisualTabForTabBar
          key={tab.id}
          id={tab.id}
          name={tab.name}
          icon={tab.icon}
          isActive={tab.id === activeTabId}
          closable={tab.closable}
          onClick={() => activateTab(tab.id)}
          onClose={closeTab}
        />
      ))}
    </div>
  );
};

export default TabBar;