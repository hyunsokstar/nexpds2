// src/widgets/sidebar/model/store.ts
import { create } from 'zustand';
import { TabType } from './types';

interface SidebarTabStore {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useSidebarTabStore = create<SidebarTabStore>((set) => ({
  activeTab: 'campaign',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));