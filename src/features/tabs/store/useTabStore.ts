// src\features\tabs\store\useTabStore.ts

import { create } from 'zustand';
import { LucideIcon } from 'lucide-react';

// 컴포넌트 타입
type ComponentType = React.ComponentType<any>;

export interface Tab {
  id: string;
  name: string; // title이 아닌 name으로 일관되게 사용
  icon: LucideIcon;
  component: ComponentType;
  closable?: boolean;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  hasTab: (id: string) => boolean;
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [],
  activeTabId: null,
  
  addTab: (tab: Tab) => {
    const { hasTab } = get();
    
    if (!hasTab(tab.id)) {
      set((state) => ({
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      }));
    } else {
      set({ activeTabId: tab.id });
    }
  },
  
  removeTab: (id: string) => {
    set((state) => {
      const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
      
      if (tabIndex === -1) return state;
      
      const newTabs = [...state.tabs];
      newTabs.splice(tabIndex, 1);
      
      let newActiveTabId = state.activeTabId;
      
      // 삭제된 탭이 활성 탭이었다면 다른 탭을 활성화
      if (state.activeTabId === id) {
        if (newTabs.length === 0) {
          newActiveTabId = null;
        } else if (tabIndex < newTabs.length) {
          newActiveTabId = newTabs[tabIndex].id;
        } else {
          newActiveTabId = newTabs[newTabs.length - 1].id;
        }
      }
      
      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    });
  },
  
  setActiveTab: (id: string) => {
    set({ activeTabId: id });
  },
  
  hasTab: (id: string) => {
    return get().tabs.some((tab) => tab.id === id);
  },
}));

// 편의를 위한 훅 함수들
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

export const useTabSelectors = () => {
  const { tabs, activeTabId } = useTabStore();
  
  return {
    getTabs: () => tabs,
    getActiveTabId: () => activeTabId,
    getActiveTab: () => tabs.find(tab => tab.id === activeTabId) || null
  };
};