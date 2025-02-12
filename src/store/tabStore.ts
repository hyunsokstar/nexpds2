// store/tabStore.ts
import { create } from 'zustand';
import { MenuItem, menuItems } from '@/widgets/header/model/menuItems';

/** 탭에 표시할 때 필요한 정보 */
export interface TabInfo {
  id: number;
  title: string;
  icon?: string;
  position: 'left' | 'right';
  originalPosition: 'left' | 'right'; // 탭이 처음 생성된 위치 추가
}

interface MenuStore {
  // 헤더 메뉴 관련
  activeId: number | null;
  selectedMenuItem: MenuItem | null;
  setActiveMenu: (menuId: number) => void;
  getAllMenus: () => MenuItem[];

  // 탭 관련
  leftTabs: TabInfo[];           // 왼쪽 영역 탭 리스트
  rightTabs: TabInfo[];          // 오른쪽 영역 탭 리스트
  activeLeftTabId: number | null;    // 왼쪽 활성 탭
  activeRightTabId: number | null;   // 오른쪽 활성 탭
  isSplit: boolean;                  // 화면 분할 상태

  // 탭 조작 메서드
  addOrActivateTab: (menu: MenuItem, position?: 'left' | 'right') => void;
  closeTab: (tabId: number, position: 'left' | 'right') => void;
  setActiveTab: (tabId: number, position: 'left' | 'right') => void;
  moveTabToOtherSide: (tabId: number, fromPosition: 'left' | 'right') => void;
  setTabPosition: (tabId: number, position: 'left' | 'right') => void;
  toggleSplit: () => void;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  // ----- 헤더 메뉴 관련 -----
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
  getAllMenus: () => menuItems,

  // ----- 탭 관련 초기 상태 -----
  leftTabs: [],
  rightTabs: [],
  activeLeftTabId: null,
  activeRightTabId: null,
  isSplit: false,

  // ----- 탭 기능 메서드 -----
  addOrActivateTab: (menu: MenuItem, position: 'left' | 'right' = 'left') => {
    const currentTabs = position === 'left' ? get().leftTabs : get().rightTabs;
    const isExist = currentTabs.find(tab => tab.id === menu.id);

    if (!isExist) {
      // 새 탭 추가
      const newTab: TabInfo = {
        id: menu.id,
        title: menu.title,
        icon: menu.icon,
        position,
        originalPosition: position // 처음 생성된 위치 저장
      };

      if (position === 'left') {
        set(state => ({
          leftTabs: [...state.leftTabs, newTab],
          activeLeftTabId: menu.id,
          activeId: menu.id
        }));
      } else {
        set(state => ({
          rightTabs: [...state.rightTabs, newTab],
          activeRightTabId: menu.id,
          activeId: menu.id,
          isSplit: true
        }));
      }
    } else {
      // 이미 있으면 활성화만
      if (position === 'left') {
        set({ activeLeftTabId: menu.id, activeId: menu.id });
      } else {
        set({ activeRightTabId: menu.id, activeId: menu.id });
      }
    }
  },

  closeTab: (tabId: number, position: 'left' | 'right') => {
    const currentTabs = position === 'left' ? get().leftTabs : get().rightTabs;
    const currentActiveId = position === 'left' ? get().activeLeftTabId : get().activeRightTabId;

    // 탭 제거
    const newTabs = currentTabs.filter(tab => tab.id !== tabId);

    // 새로운 활성 탭 ID 결정
    let newActiveId = currentActiveId;
    if (currentActiveId === tabId) {
      newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
    }

    if (position === 'left') {
      set({
        leftTabs: newTabs,
        activeLeftTabId: newActiveId,
        activeId: newActiveId
      });
    } else {
      set({
        rightTabs: newTabs,
        activeRightTabId: newActiveId,
        activeId: newActiveId,
        isSplit: newTabs.length > 0
      });
    }
  },

  setActiveTab: (tabId: number, position: 'left' | 'right') => {
    if (position === 'left') {
      set({
        activeLeftTabId: tabId,
        activeId: tabId
      });
    } else {
      set({
        activeRightTabId: tabId,
        activeId: tabId
      });
    }
  },

  moveTabToOtherSide: (tabId: number, fromPosition: 'left' | 'right') => {
    const toPosition = fromPosition === 'left' ? 'right' as const : 'left' as const;
    const sourceTabs = fromPosition === 'left' ? get().leftTabs : get().rightTabs;
    const tabToMove = sourceTabs.find(tab => tab.id === tabId);
    
    if (!tabToMove) return;

    // 이동하는 탭이 현재 활성 탭인 경우, 해당 영역의 새로운 활성 탭을 결정
    let newSourceActiveId = null;
    if ((fromPosition === 'left' && tabId === get().activeLeftTabId) || 
        (fromPosition === 'right' && tabId === get().activeRightTabId)) {
      const remainingTabs = sourceTabs.filter(t => t.id !== tabId);
      newSourceActiveId = remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null;
    }

    // originalPosition은 유지한 채로 현재 position만 업데이트
    const updatedTab: TabInfo = { 
      ...tabToMove, 
      position: toPosition,
      originalPosition: tabToMove.originalPosition 
    };

    set(state => {
      const newState = {
        leftTabs: fromPosition === 'left' 
          ? state.leftTabs.filter(t => t.id !== tabId)
          : [...state.leftTabs, updatedTab],
        rightTabs: fromPosition === 'right'
          ? state.rightTabs.filter(t => t.id !== tabId)
          : [...state.rightTabs, updatedTab],
        
        activeLeftTabId: toPosition === 'left' 
          ? tabId 
          : (fromPosition === 'left' ? (newSourceActiveId ?? state.activeLeftTabId) : state.activeLeftTabId),
        activeRightTabId: toPosition === 'right'
          ? tabId
          : (fromPosition === 'right' ? (newSourceActiveId ?? state.activeRightTabId) : state.activeRightTabId),
        
        isSplit: true
      };

      return newState;
    });
  },

  setTabPosition: (tabId: number, position: 'left' | 'right') => {
    set(state => ({
      leftTabs: state.leftTabs.map(tab => 
        tab.id === tabId ? { ...tab, position } : tab
      ),
      rightTabs: state.rightTabs.map(tab => 
        tab.id === tabId ? { ...tab, position } : tab
      ),
    }));
  },

// toggleSplit 함수만 수정
toggleSplit: () => {
  const { isSplit, rightTabs } = get();
  
  if (isSplit) {
    // 분할 상태일 때 토글하면 오른쪽 탭들을 왼쪽으로 이동
    rightTabs.forEach(tab => {
      const sourceTabs = get().rightTabs;
      const tabToMove = sourceTabs.find(t => t.id === tab.id);
      
      if (tabToMove) {
        // 왼쪽으로 이동
        set(state => ({
          leftTabs: [...state.leftTabs, { ...tabToMove, position: 'left' }],
          rightTabs: state.rightTabs.filter(t => t.id !== tab.id),
          activeLeftTabId: state.leftTabs.length > 0 ? state.leftTabs[state.leftTabs.length - 1].id : tab.id
        }));
      }
    });
    
    // 분할 상태 해제 및 오른쪽 탭 관련 상태 초기화
    set(state => ({
      isSplit: false,
      rightTabs: [],
      activeRightTabId: null
    }));
  } else if (get().leftTabs.length > 0) {
    // 분할되지 않은 상태에서 왼쪽에 탭이 있으면
    // 마지막 탭을 오른쪽으로 이동
    const lastTab = get().leftTabs[get().leftTabs.length - 1];
    get().moveTabToOtherSide(lastTab.id, 'left');
    set({ isSplit: true });
  }
}
}));