// store/tabStore.ts (단계 2 적용)
import { create } from 'zustand';
import { MenuItem, menuItems } from '@/widgets/header/model/menuItems';

/** 탭에 표시할 때 필요한 정보 */
export interface TabInfo {
  id: number;
  title: string;
  icon?: string;
  position: 'left' | 'right';
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
  setTabPosition: (tabId: number, position: 'left' | 'right') => void; // 추가: 탭 위치 설정
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
        position
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
          isSplit: true // 오른쪽에 탭 추가시 자동으로 분할
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
        isSplit: newTabs.length > 0 // 오른쪽 탭이 모두 닫히면 분할 해제
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

  // 단계 2: 탭 이동 후 활성화
// store/tabStore.ts 수정
moveTabToOtherSide: (tabId: number, fromPosition: 'left' | 'right') => {
  const toPosition = fromPosition === 'left' ? 'right' as const : 'left' as const;
  const sourceTabs = fromPosition === 'left' ? get().leftTabs : get().rightTabs;
  const tabToMove = sourceTabs.find(tab => tab.id === tabId);
  
  if (!tabToMove) return;

  // 이동하는 탭이 현재 활성 탭인 경우, 해당 영역의 새로운 활성 탭을 결정
  let newSourceActiveId = null;
  if ((fromPosition === 'left' && tabId === get().activeLeftTabId) || 
      (fromPosition === 'right' && tabId === get().activeRightTabId)) {
    // 이동하는 탭을 제외한 남은 탭들
    const remainingTabs = sourceTabs.filter(t => t.id !== tabId);
    // 남은 탭이 있으면 마지막 탭을 활성화
    newSourceActiveId = remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null;
  }

  // 업데이트된 탭 생성
  const updatedTab: TabInfo = { ...tabToMove, position: toPosition };

  set(state => {
    const newState = {
      // 탭 리스트 업데이트
      leftTabs: fromPosition === 'left' 
        ? state.leftTabs.filter(t => t.id !== tabId)
        : [...state.leftTabs, updatedTab],
      rightTabs: fromPosition === 'right'
        ? state.rightTabs.filter(t => t.id !== tabId)
        : [...state.rightTabs, updatedTab],
      
      // 활성 탭 설정
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

  // 탭 위치 설정 (필요에 따라 사용)
  setTabPosition: (tabId: number, position: 'left' | 'right') => {
    set(state => ({
      leftTabs: state.leftTabs.map(tab => tab.id === tabId ? { ...tab, position } : tab),
      rightTabs: state.rightTabs.map(tab => tab.id === tabId ? { ...tab, position } : tab),
    }));
  },


  toggleSplit: () => {
    const { isSplit, rightTabs } = get();
    // 분할 상태일 때 토글하면 오른쪽 탭들을 왼쪽으로 이동
    if (isSplit) {
      rightTabs.forEach(tab => {
        get().moveTabToOtherSide(tab.id, 'right');
      });
      set({ isSplit: false });
    } else if (get().leftTabs.length > 0) {
      // 분할되지 않은 상태에서 왼쪽에 탭이 있으면
      // 마지막 탭을 오른쪽으로 이동
      const lastTab = get().leftTabs[get().leftTabs.length - 1];
      get().moveTabToOtherSide(lastTab.id, 'left');
      set({ isSplit: true });
    }
  }
}));