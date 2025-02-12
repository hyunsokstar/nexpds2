// src/widgets/sidebar/model/types.ts
// src/widgets/sidebar/model/types.ts
export type TabType = 'campaign' | 'agents' | 'agentGroups';

export interface SidebarTab {
  id: TabType;
  label: string;
  icon?: React.ReactNode;
}

export interface TreeNode {
  id: string;
  label: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  isOpen?: boolean;
  variant?: 'default' | 'blue' | 'red' | 'green';
}

export interface SidebarState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}