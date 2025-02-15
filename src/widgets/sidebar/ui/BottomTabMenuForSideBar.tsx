// ui/BottomTabMenuForSideBar.tsx
import React from 'react';
import { useSidebarTabStore } from '../model/store';
import { CampaignTree } from './tabs/CampaignTree';
import { AgentsTree } from './tabs/AgentsTree';
import { AgentGroupsTree } from './tabs/AgentGroupsTree';

export function BottomTabMenuForSideBar() {
  const activeTab = useSidebarTabStore((state) => state.activeTab);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'campaign':
        return <CampaignTree />;
      case 'agents':
        return <AgentsTree />;
      case 'agentGroups':
        return <AgentGroupsTree />;
      default:
        return null;
    }
  };

  return (
    <div className="border-t bg-gray-50 h-full overflow-auto">
      {renderContent()}
    </div>
  );
}