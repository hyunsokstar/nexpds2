'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Phone, Users, ListTree } from 'lucide-react'
import TreeItem from './components/TreeItem'
import { campaignConfig, groupConfig, userConfig } from './config/sidebar-menu-items'

interface SidebarProps {
  className?: string
}

type SidebarTab = 'campaign' | 'user' | 'group';

const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<SidebarTab>('campaign')
  
  // 각 탭별로 독립적인 확장 상태 관리
  const [campaignExpandedItems, setCampaignExpandedItems] = useState<Record<string, boolean>>({
    'nexus-cc': true,
    'sk-telecom': true,
    'lg-uplus': true,
    'kt': true
  })
  
  const [userExpandedItems, setUserExpandedItems] = useState<Record<string, boolean>>({
    'user-management': true,
    'active-users': true,
    'user-performance': true
  })
  
  const [groupExpandedItems, setGroupExpandedItems] = useState<Record<string, boolean>>({
    'campaign-groups': true,
    'telecom-groups': true,
    'finance-groups': true
  })
  
  // 활성 탭에 따른 확장 상태 및 setter 가져오기
  const getExpandedItemsState = () => {
    switch (activeTab) {
      case 'campaign':
        return {
          expandedItems: campaignExpandedItems,
          setExpandedItems: setCampaignExpandedItems
        };
      case 'user':
        return {
          expandedItems: userExpandedItems,
          setExpandedItems: setUserExpandedItems
        };
      case 'group':
        return {
          expandedItems: groupExpandedItems,
          setExpandedItems: setGroupExpandedItems
        };
    }
  };
  
  const { expandedItems, setExpandedItems } = getExpandedItemsState();
  
  // 아이템 토글 함수 - 아이템 ID를 매개변수로 받음
  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 현재 경로에 해당하는 항목 자동 확장 - 탭 변경 시 실행
  useEffect(() => {
    // 재귀적으로 경로에 해당하는 모든 상위 항목 ID 찾기
    const findParentItemIds = (
      items: any[], 
      targetPath: string, 
      parentIds: string[] = []
    ): string[] => {
      for (const item of items) {
        if (item.href === targetPath) {
          return parentIds;
        }
        
        if (item.children && item.children.length > 0) {
          const foundIds = findParentItemIds(
            item.children, 
            targetPath, 
            [...parentIds, item.id]
          );
          
          if (foundIds.length > 0) {
            return foundIds;
          }
        }
      }
      
      return [];
    };
    
    // 현재 탭의 설정 가져오기
    const currentConfig = 
      activeTab === 'campaign' ? campaignConfig :
      activeTab === 'user' ? userConfig : 
      groupConfig;
    
    // 현재 경로에 해당하는 상위 항목 ID 찾기
    const parentIds = findParentItemIds(currentConfig, pathname);
    
    // 찾은 ID들을 확장 상태에 추가
    if (parentIds.length > 0) {
      const newExpandedItems = { ...expandedItems };
      
      parentIds.forEach(id => {
        newExpandedItems[id] = true;
      });
      
      setExpandedItems(newExpandedItems);
    }
  }, [activeTab, pathname]);

  // 활성 탭에 따른 설정 및 제목 결정
  const getTabConfig = () => {
    switch (activeTab) {
      case 'campaign':
        return {
          config: campaignConfig,
          title: '캠페인 관리',
          icon: <Phone size={16} />
        };
      case 'user':
        return {
          config: userConfig,
          title: '상담원 관리',
          icon: <Users size={16} />
        };
      case 'group':
        return {
          config: groupConfig,
          title: '캠페인 그룹 관리',
          icon: <ListTree size={16} />
        };
    }
  };

  const { config, title, icon } = getTabConfig();
  
  return (
    <div className={cn("w-64 bg-white border-r flex flex-col h-full", className)}>
      {/* 사이드바 헤더 - 색상 및 높이 수정 */}
      <div className="bg-gray-100 text-gray-700 px-3 py-2 flex items-center border-b">
        {icon}
        <span className="text-sm font-medium ml-2">{title}</span>
      </div>
      
      {/* 트리 메뉴 영역 - 스크롤 가능 */}
      <div className="flex-1 overflow-auto px-2 py-2">
        <nav className="space-y-1">
          {config.map((item) => (
            <TreeItem 
              key={item.id}
              item={item}
              currentPath={pathname}
              isExpanded={!!expandedItems[item.id]}
              onToggleExpand={toggleItem}
              level={0}
              expandedItems={expandedItems}
            />
          ))}
        </nav>
      </div>
      
      {/* 하단 세로 탭 */}
      <div className="border-t">
        <div className="flex flex-col divide-y">
          <button
            className={cn(
              "py-2 text-xs flex items-center justify-center",
              activeTab === 'campaign' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab('campaign')}
          >
            <Phone size={14} className="mr-1.5" />
            <span>캠페인</span>
          </button>
          <button
            className={cn(
              "py-2 text-xs flex items-center justify-center",
              activeTab === 'user' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab('user')}
          >
            <Users size={14} className="mr-1.5" />
            <span>상담원</span>
          </button>
          <button
            className={cn(
              "py-2 text-xs flex items-center justify-center",
              activeTab === 'group' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab('group')}
          >
            <ListTree size={14} className="mr-1.5" />
            <span>그룹</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar