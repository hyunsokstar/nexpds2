// src\widgets\tab-container\tab-panel\index.tsx
'use client'

import React from 'react';
import { useTabSelectors } from '@/features/tabs/store/useTabStore';
import { cn } from '@/lib/utils';

interface TabPanelProps {
  className?: string;
}

const TabPanel = ({ className }: TabPanelProps) => {
  const { getActiveTab } = useTabSelectors();
  const activeTab = getActiveTab();
  
  // 활성화된 탭이 없을 때는 아무것도 표시하지 않음
  if (!activeTab) {
    return null;
  }

  // 활성 탭에 해당하는 컴포넌트 렌더링
  const TabComponent = activeTab.component;

  return (
    <div className={cn("flex-1 overflow-auto p-4", className)}>
      <TabComponent />
    </div>
  );
};

export default TabPanel;