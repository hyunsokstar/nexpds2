// src/widgets/sidebar/ui/SidebarHeader.tsx
import React from 'react';
import { SIDEBAR_TABS } from '../model/tabs';
import { useSidebarTabStore } from '../model/store';
import { Filter, SortDesc } from 'lucide-react';

export function SidebarHeader() {
  const activeTab = useSidebarTabStore((state) => state.activeTab);
  const activeTabLabel = SIDEBAR_TABS.find(tab => tab.id === activeTab)?.label;

  return (
    <div className="border-b border-gray-200 flex justify-between items-center h-10 pl-2 pr-5">
      <h2 className="text-lg font-semibold">{activeTabLabel}</h2>
      <div className="flex gap-2">
        <button className="p-1 hover:bg-gray-100 rounded">
          <Filter size={18} />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <SortDesc size={18} />
        </button>
      </div>
    </div>
  );
}