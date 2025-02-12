// src/widgets/sidebar/ui/SidebarTabs.tsx
import React from 'react';
import { SIDEBAR_TABS } from '../model/tabs';
import { useSidebarTabStore } from '../model/store';
import { LayoutGrid, Users, UserSquare2 } from 'lucide-react';

const TAB_ICONS = {
  campaign: LayoutGrid,
  agents: Users,
  agentGroups: UserSquare2,
};

export function SidebarTabs() {
  const { activeTab, setActiveTab } = useSidebarTabStore();

  return (
    <div className="border-t border-gray-200 pb-3">  {/* pb-4 추가 */}
      {SIDEBAR_TABS.map((tab) => {
        const Icon = TAB_ICONS[tab.id];
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              w-full px-4 py-2.5 text-sm flex items-center gap-2
              ${activeTab === tab.id 
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-500 hover:bg-gray-50'}
            `}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}