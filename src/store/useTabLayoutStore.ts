// store/tabLayoutStore.ts
import { create } from 'zustand';

interface TabLayoutStore {
  maximizedTab: {
    position: 'left' | 'right' | null;
    tabId: number | null;
  };
  toggleMaximize: (position: 'left' | 'right' | null, tabId: number | null) => void;
}

export const useTabLayoutStore = create<TabLayoutStore>((set) => ({
  maximizedTab: {
    position: null,
    tabId: null
  },
  toggleMaximize: (position, tabId) => 
    set((state) => ({
      maximizedTab: state.maximizedTab.tabId === tabId ? 
        { position: null, tabId: null } : 
        { position, tabId }
    })),
}));