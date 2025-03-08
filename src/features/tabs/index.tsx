// src\features\tabs\index.tsx
import { Tab, useTabStore } from './store/useTabStore';

export { useTabStore } from './store/useTabStore';
export type { Tab } from './store/useTabStore';

// 간편한 사용을 위한 액션 함수들
export const useTabActions = () => {
  const { addTab, removeTab, setActiveTab } = useTabStore();
  
  return {
    openTab: (tab: Tab) => {
      addTab(tab);
    },
    
    closeTab: (id: string) => {
      removeTab(id);
    },
    
    activateTab: (id: string) => {
      setActiveTab(id);
    }
  };
};

// 간편한 사용을 위한 셀렉터 함수들
export const useTabSelectors = () => {
  const { tabs, activeTabId, hasTab } = useTabStore();
  
  return {
    getTabs: () => tabs,
    getActiveTabId: () => activeTabId,
    getActiveTab: () => tabs.find(tab => tab.id === activeTabId) || null,
    hasTab: (id: string) => hasTab(id)
  };
};