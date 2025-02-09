// src/widgets/sidebar/model/store.ts
import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true, // 초기 상태: 열림
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));