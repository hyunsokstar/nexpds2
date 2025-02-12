// widgets/tabs/TabContent.tsx
"use client";

import { useMenuStore } from "@/store/tabStore";
import React from "react";

/** 실제 각 탭별로 표시할 컴포넌트 (임시) */
function SktComponent() {
 return <div>SKT 캠페인 내용!</div>;
}

function DefaultComponent() {
 return <div>DEFAULT 캠페인 내용!</div>;
}

interface TabContentProps {
 position: 'left' | 'right';
}

export function TabContent({ position }: TabContentProps) {
 const { activeLeftTabId, activeRightTabId, leftTabs, rightTabs } = useMenuStore();

 // position에 따라 활성 탭 정보 가져오기
 const activeTabId = position === 'left' ? activeLeftTabId : activeRightTabId;
 const tabs = position === 'left' ? leftTabs : rightTabs;
 
 // 현재 활성 탭 정보
 const activeTab = tabs.find((t) => t.id === activeTabId);

 if (!activeTab) {
   return <div className="p-4">열린 탭이 없습니다.</div>;
 }

 // 예시) 탭 id 에 따라 분기하여 다른 컴포넌트 보여주기
 switch (activeTab.id) {
   case 2: // 예: [2] SKT
     return <SktComponent />;
   case 1: // [1] DEFAULT
     return <DefaultComponent />;
   default:
     return <div className="p-4">
       <p>현재 탭 ({position}): {activeTab.title}</p>
       <p>여기에 해당하는 컴포넌트 렌더링</p>
     </div>;
 }
}