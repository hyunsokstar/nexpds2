// store/tabStore.ts
import { create } from 'zustand';
import { MenuItem, menuItems } from '@/widgets/header/model/menuItems';

/** 탭에 표시할 때 필요한 정보 */
export interface TabInfo {
  id: number;
  tabId: number;             // 고유 탭 ID (중복 탭 구분 위해)
  menuId: number;            // 메뉴 ID (같은 메뉴여도 중복 탭 가능한 경우)
  title: string;
  icon?: string;
  position: 'left' | 'right' | 'upper' | 'lower';

  originalPosition: 'left' | 'right'; // 탭이 처음 생성된 위치
}

interface MenuStore {
  // 헤더 메뉴 관련
  activeId: number | null;            // 마지막으로 클릭된 '메뉴' ID (중복 탭 구분 없이)
  selectedMenuItem: MenuItem | null;
  setActiveMenu: (menuId: number) => void;
  getAllMenus: () => MenuItem[];

  // 탭 관련
  leftTabs: TabInfo[];           // 왼쪽 영역 탭 리스트
  rightTabs: TabInfo[];          // 오른쪽 영역 탭 리스트
  activeLeftTabId: number | null;    // 왼쪽 활성 탭ID
  activeRightTabId: number | null;   // 오른쪽 활성 탭ID
  isSplit: boolean;                  // 화면 분할 상태
  nextTabId: number;                 // 새 탭 생성 시 ID를 증가시켜 사용

  // 탭 조작 메서드
  addOrActivateTab: (menu: MenuItem, position?: 'left' | 'right' | 'upper' | 'lower', forceDuplicate?: boolean) => void;
  closeTab: (tabId: number, position: 'left' | 'right') => void;
  setActiveTab: (tabId: number, position: 'left' | 'right') => void;
  moveTabToOtherSide: (tabId: number, fromPosition: 'left' | 'right') => void;
  setTabPosition: (tabId: number, position: 'left' | 'right') => void;
  toggleSplit: () => void;
  reorderTabs: (activeTabId: number, overTabId: number, position: 'left' | 'right') => void;

  isQuadSplit: boolean;         // 4분할 모드 여부
  upperTabs: TabInfo[];         // 상단 탭 리스트
  lowerTabs: TabInfo[];         // 하단 탭 리스트
  activeUpperTabId: number | null;  // 상단 활성 탭 ID
  activeLowerTabId: number | null;  // 하단 활성 탭 ID

  // 새로운 메서드
  enterQuadSplit: () => void;   // 4분할 모드 진입
  exitQuadSplit: () => void;    // 4분할 모드 해제

}

// 헬퍼 함수들
const getTabArrayKey = (position: string) => {
  switch (position) {
    case 'upper': return 'upper';
    case 'lower': return 'lower';
    case 'left': return 'left';
    case 'right': return 'right';
    default: return 'left';
  }
}

const getActiveIdKey = (position: string) => {
  switch (position) {
    case 'upper': return 'Upper';
    case 'lower': return 'Lower';
    case 'left': return 'Left';
    case 'right': return 'Right';
    default: return 'Left';
  }
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
  nextTabId: 1, // 새 탭ID 발급용

  // 새로운 상태들
  isQuadSplit: false,
  upperTabs: [],
  lowerTabs: [],
  activeUpperTabId: null,
  activeLowerTabId: null,

  // 4분할 관련 메서드들
  enterQuadSplit: () => {
    const { leftTabs, rightTabs } = get();
    const allTabs = [...leftTabs, ...rightTabs];

    if (allTabs.length !== 4) return;

    // 상단에 2개, 하단에 2개 배치
    const upperTabs = allTabs.slice(0, 2).map(tab => ({
      ...tab,
      position: 'upper' as const
    }));

    const lowerTabs = allTabs.slice(2, 4).map(tab => ({
      ...tab,
      position: 'lower' as const
    }));

    set({
      isQuadSplit: true,
      leftTabs: [],
      rightTabs: [],
      upperTabs,
      lowerTabs,
      activeLeftTabId: null,
      activeRightTabId: null,
      activeUpperTabId: upperTabs[0]?.tabId || null,
      activeLowerTabId: lowerTabs[0]?.tabId || null,
      activeId: upperTabs[0]?.menuId || null
    });
  },

  exitQuadSplit: () => {
    const { upperTabs, lowerTabs } = get();
    const allTabs = [...upperTabs, ...lowerTabs];

    // 원래 위치로 되돌리기
    const leftTabs = allTabs.map(tab => ({
      ...tab,
      position: tab.originalPosition
    })).filter(tab => tab.originalPosition === 'left');

    const rightTabs = allTabs.map(tab => ({
      ...tab,
      position: tab.originalPosition
    })).filter(tab => tab.originalPosition === 'right');

    set({
      isQuadSplit: false,
      upperTabs: [],
      lowerTabs: [],
      activeUpperTabId: null,
      activeLowerTabId: null,
      leftTabs,
      rightTabs,
      activeLeftTabId: leftTabs[0]?.tabId || null,
      activeRightTabId: rightTabs[0]?.tabId || null,
      activeId: leftTabs[0]?.menuId || null
    });
  },

  // addOrActivateTab 메서드 수정
  addOrActivateTab: (menu: MenuItem, position = 'left', forceDuplicate = false) => {
    // 현재 탭 목록 가져오기
    const currentTabs =
      position === 'upper' ? get().upperTabs :
        position === 'lower' ? get().lowerTabs :
          position === 'left' ? get().leftTabs :
            get().rightTabs;

    // 1) 강제 중복(CTRL+클릭) 또는 메뉴 자체가 duplicatable=true => 무조건 새 탭 생성
    if (forceDuplicate || menu.duplicatable) {
      const newTabId = get().nextTabId;
      const newTab: TabInfo = {
        id: newTabId,
        tabId: newTabId,
        menuId: menu.id,
        title: menu.title,
        icon: menu.icon,
        position,
        originalPosition: position === 'upper' || position === 'lower' ? 'left' : position
      };

      set((state) => {
        const updateObj: any = {
          [`${getTabArrayKey(position)}Tabs`]: [...currentTabs, newTab],
          [`active${getActiveIdKey(position)}TabId`]: newTabId,
          activeId: menu.id,
          nextTabId: state.nextTabId + 1,
        };

        // 분할 상태 업데이트
        if (position === 'right' || position === 'lower') {
          updateObj.isSplit = true;
        }
        if (position === 'upper' || position === 'lower') {
          updateObj.isQuadSplit = true;
        }

        return updateObj;
      });
      return;
    }

    // 2) duplicatable=false && ctrl 미눌렀을 때 => 기존 탭 있는지 확인
    const existTab = currentTabs.find(tab => tab.menuId === menu.id);
    if (!existTab) {
      // 새 탭 추가
      const newTabId = get().nextTabId;
      const newTab: TabInfo = {
        id: newTabId,
        tabId: newTabId,
        menuId: menu.id,
        title: menu.title,
        icon: menu.icon,
        position,
        originalPosition: position === 'upper' || position === 'lower' ? 'left' : position
      };

      set((state) => {
        const updateObj: any = {
          [`${getTabArrayKey(position)}Tabs`]: [...currentTabs, newTab],
          [`active${getActiveIdKey(position)}TabId`]: newTabId,
          activeId: menu.id,
          nextTabId: state.nextTabId + 1,
        };

        // 분할 상태 업데이트
        if (position === 'right' || position === 'lower') {
          updateObj.isSplit = true;
        }
        if (position === 'upper' || position === 'lower') {
          updateObj.isQuadSplit = true;
        }

        return updateObj;
      });
    } else {
      // 이미 있으면 활성화만
      set({
        [`active${getActiveIdKey(position)}TabId`]: existTab.tabId,
        activeId: menu.id
      });
    }
  },

  closeTab: (tabId: number, position: 'left' | 'right') => {
    const currentTabs = position === 'left' ? get().leftTabs : get().rightTabs;
    const currentActiveId = position === 'left' ? get().activeLeftTabId : get().activeRightTabId;

    // 탭 제거
    const newTabs = currentTabs.filter(tab => tab.tabId !== tabId);

    // 새로운 활성 탭 ID 결정
    let newActiveTabId = currentActiveId;
    if (currentActiveId === tabId) {
      newActiveTabId = newTabs.length > 0 ? newTabs[newTabs.length - 1].tabId : null;
    }

    // 상태 업데이트
    if (position === 'left') {
      set({
        leftTabs: newTabs,
        activeLeftTabId: newActiveTabId,
        // activeId: 남은 탭 중 마지막 메뉴ID. 혹은 null
        activeId: newActiveTabId
          ? newTabs.find(tab => tab.tabId === newActiveTabId)?.menuId ?? null
          : null
      });
    } else {
      set({
        rightTabs: newTabs,
        activeRightTabId: newActiveTabId,
        activeId: newActiveTabId
          ? newTabs.find(tab => tab.tabId === newActiveTabId)?.menuId ?? null
          : null,
        isSplit: newTabs.length > 0
      });
    }
  },

  setActiveTab: (tabId: number, position: 'left' | 'right') => {
    const currentTabs = position === 'left' ? get().leftTabs : get().rightTabs;
    const targetTab = currentTabs.find(t => t.tabId === tabId);
    if (!targetTab) return;

    if (position === 'left') {
      set({
        activeLeftTabId: tabId,
        activeId: targetTab.menuId
      });
    } else {
      set({
        activeRightTabId: tabId,
        activeId: targetTab.menuId
      });
    }
  },

  moveTabToOtherSide: (tabId: number, fromPosition: 'left' | 'right') => {
    const toPosition = fromPosition === 'left' ? 'right' as const : 'left' as const;
    const sourceTabs = fromPosition === 'left' ? get().leftTabs : get().rightTabs;
    const tabToMove = sourceTabs.find(tab => tab.tabId === tabId);

    if (!tabToMove) return;

    // 이동하는 탭이 현재 활성 탭인 경우, 해당 영역의 새로운 활성 탭을 결정
    let newSourceActiveTabId = null;
    if ((fromPosition === 'left' && tabId === get().activeLeftTabId) ||
      (fromPosition === 'right' && tabId === get().activeRightTabId)) {
      const remainingTabs = sourceTabs.filter(t => t.tabId !== tabId);
      newSourceActiveTabId = remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].tabId : null;
    }

    const updatedTab: TabInfo = {
      ...tabToMove,
      position: toPosition
      // originalPosition은 그대로 둠
    };

    set(state => {
      const newState = {
        leftTabs: fromPosition === 'left'
          ? state.leftTabs.filter(t => t.tabId !== tabId)
          : [...state.leftTabs, updatedTab],
        rightTabs: fromPosition === 'right'
          ? state.rightTabs.filter(t => t.tabId !== tabId)
          : [...state.rightTabs, updatedTab],

        // 활성화 탭 설정
        activeLeftTabId: toPosition === 'left'
          ? tabId
          : (fromPosition === 'left' ? (newSourceActiveTabId ?? state.activeLeftTabId) : state.activeLeftTabId),
        activeRightTabId: toPosition === 'right'
          ? tabId
          : (fromPosition === 'right' ? (newSourceActiveTabId ?? state.activeRightTabId) : state.activeRightTabId),

        isSplit: true,
        activeId: tabToMove.menuId
      };

      // activeId 업데이트 (현재 이동한 탭의 menuId)
      if (toPosition === 'left') {
        newState['activeId'] = tabToMove.menuId;
      } else {
        newState['activeId'] = tabToMove.menuId;
      }

      return newState;
    });
  },

  setTabPosition: (tabId: number, position: 'left' | 'right') => {
    set(state => ({
      leftTabs: state.leftTabs.map(tab =>
        tab.tabId === tabId ? { ...tab, position } : tab
      ),
      rightTabs: state.rightTabs.map(tab =>
        tab.tabId === tabId ? { ...tab, position } : tab
      ),
    }));
  },

  toggleSplit: () => {
    const { isSplit, rightTabs } = get();

    if (isSplit) {
      // 분할 상태 해제 -> 오른쪽 탭들을 왼쪽으로 이동
      rightTabs.forEach(rt => {
        const sourceTabs = get().rightTabs;
        const tabToMove = sourceTabs.find(t => t.tabId === rt.tabId);
        if (tabToMove) {
          set(state => ({
            leftTabs: [...state.leftTabs, { ...tabToMove, position: 'left' }],
            rightTabs: state.rightTabs.filter(t => t.tabId !== rt.tabId),
            activeLeftTabId:
              state.leftTabs.length > 0
                ? state.leftTabs[state.leftTabs.length - 1].tabId
                : rt.tabId
          }));
        }
      });

      set({
        isSplit: false,
        rightTabs: [],
        activeRightTabId: null
      });
    } else if (get().leftTabs.length > 0) {
      // 분할되지 않은 상태에서 왼쪽 탭이 있을 때 -> 마지막 탭을 오른쪽으로 이동
      const lastLeftTab = get().leftTabs[get().leftTabs.length - 1];
      get().moveTabToOtherSide(lastLeftTab.tabId, 'left');
      set({ isSplit: true });
    }
  },

  reorderTabs: (activeTabId, overTabId, position) => {
    set((state) => {
      const tabs = position === 'left' ? [...state.leftTabs] : [...state.rightTabs];
      const activeIndex = tabs.findIndex(tab => tab.tabId === activeTabId);
      const overIndex = tabs.findIndex(tab => tab.tabId === overTabId);

      if (activeIndex === -1 || overIndex === -1) return state;

      const [removedTab] = tabs.splice(activeIndex, 1);
      tabs.splice(overIndex, 0, removedTab);

      if (position === 'left') {
        return { ...state, leftTabs: tabs };
      } else {
        return { ...state, rightTabs: tabs };
      }
    });
  },
}));
