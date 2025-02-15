// store/useSidebarStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;         // 열림/닫힘 상태
  width: number;           // 현재 너비
  toggleSidebar: () => void;
  setWidth: (width: number) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,     // 기본: 열림
      width: 256,       // 기본 너비
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setWidth: (width: number) => set({ width }),
    }),
    {
      name: "sidebar-storage",
    }
  )
);
