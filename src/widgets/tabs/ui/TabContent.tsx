// src\widgets\tabs\TabContent.tsx
import { useMenuStore } from "@/store/tabStore";
import CampaignGroupAdminPannel from "../pages/campaign-group-admin/CampaignGroupAdminPannel";
import CampaignAdminPannel from "../pages/campaign-group-admin/CampaignAdminPannel";

interface TabContentProps {
  position: 'left' | 'right';
}

export function TabContent({ position }: TabContentProps) {
  const { activeLeftTabId, activeRightTabId, leftTabs, rightTabs } = useMenuStore();

  const activeTabId = position === 'left' ? activeLeftTabId : activeRightTabId;
  const tabs = position === 'left' ? leftTabs : rightTabs;
  const activeTab = tabs.find((t) => t.tabId === activeTabId);  // tabId로 찾기

  if (!activeTab) {
    return <div className="p-4">열린 탭이 없습니다.</div>;
  }

  // menuId로 분기
  switch (activeTab.menuId) {
    case 1: // [1] DEFAULT
      return <CampaignGroupAdminPannel />;
    case 2: // 예: [2] SKT
      return <CampaignAdminPannel />;
    default:
      return <div className="p-4">
        <p>현재 탭 ({position}): {activeTab.title}</p>
        <p>여기에 해당하는 컴포넌트 렌더링</p>
      </div>;
  }
}