// store/useMenuStore.ts
import { create } from 'zustand';
import { MenuItem, menuItems } from '@/widgets/header/model/menuItems';

interface MenuStore {
  activeId: number | null;
  setActiveMenu: (menuId: number) => void;
  getAllMenus: () => MenuItem[];
  selectedMenuItem: MenuItem | null;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  activeId: null,
  selectedMenuItem: null,
  setActiveMenu: (menuId) => set((state) => {
    const menuItems = get().getAllMenus();
    const selectedItem = menuItems.find(item => item.id === menuId) || null;
    
    return {
      activeId: menuId,
      selectedMenuItem: selectedItem
    };
  }),
  getAllMenus: () => menuItems // menuItems는 model/menuItems.ts에서 import
}));