// store/useSidebarStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  width: number;
  toggleSidebar: () => void;
  setWidth: (width: number) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      width: 256, // 기본 너비
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setWidth: (width: number) => set({ width }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);