// store/useMenuStore.ts
import { create } from 'zustand';
import { MenuItem, menuItems } from '@/widgets/header/model/menuItems';

/** 탭에 표시할 때 필요한 정보 */
export interface TabInfo {
  id: number;
  title: string;
  icon?: string; 
  // 필요하다면 더 넣어주세요 (ex: path, componentName 등)
}

interface MenuStore {
  // 기존
  activeId: number | null;
  selectedMenuItem: MenuItem | null;
  setActiveMenu: (menuId: number) => void;
  getAllMenus: () => MenuItem[];

  // 탭 관련
  openedTabs: TabInfo[];         // 열린 탭 리스트
  activeTabId: number | null;    // 현재 활성 탭
  addOrActivateTab: (menu: MenuItem) => void;
  closeTab: (tabId: number) => void;
  setActiveTab: (tabId: number) => void;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  // ----- 기존 속성들 -----
  activeId: null,
  selectedMenuItem: null,
  setActiveMenu: (menuId) => {
    const menuItems = get().getAllMenus();
    const selectedItem = menuItems.find(item => item.id === menuId) || null;
    return set({
      activeId: menuId,
      selectedMenuItem: selectedItem
    });
  },
  getAllMenus: () => menuItems, // menuItems는 model/menuItems.ts에서 import

  // ----- 탭 관련 초기 상태 -----
  openedTabs: [],
  activeTabId: null,

  // ----- 탭 기능 메서드 -----
  addOrActivateTab: (menu: MenuItem) => {
    const { openedTabs } = get();
    // 이미 열려있는지 확인
    const isExist = openedTabs.find((tab) => tab.id === menu.id);
    if (!isExist) {
      // 새 탭 추가
      const newTab: TabInfo = {
        id: menu.id,
        title: menu.title,
        icon: menu.icon
      };
      set({
        openedTabs: [...openedTabs, newTab],
        activeTabId: menu.id
      });
    } else {
      // 이미 있으면 활성화만
      set({
        activeTabId: menu.id
      });
    }
  },

  closeTab: (tabId: number) => {
    const { openedTabs, activeTabId } = get();
    // 탭 제거
    const newTabs = openedTabs.filter((tab) => tab.id !== tabId);

    let newActiveTabId = activeTabId;
    if (activeTabId === tabId) {
      // 닫은 탭이 현재 활성 탭이면, 남아있는 탭 중 마지막으로 활성화 (or 첫 번째)
      if (newTabs.length > 0) {
        newActiveTabId = newTabs[newTabs.length - 1].id;
      } else {
        newActiveTabId = null;
      }
    }

    set({
      openedTabs: newTabs,
      activeTabId: newActiveTabId
    });
  },

  setActiveTab: (tabId: number) => {
    set({ activeTabId: tabId });
  },
}));
