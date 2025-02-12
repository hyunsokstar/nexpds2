import React from 'react';
import { useSidebarTabStore } from '../model/store';
import { CampaignTree } from './tabs/CampaignTree';
import { AgentsTree } from './tabs/AgentsTree';
import { AgentGroupsTree } from './tabs/AgentGroupsTree';

export function TabContent() {
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

  return renderContent();
}