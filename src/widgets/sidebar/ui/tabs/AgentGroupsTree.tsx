import React from 'react';
import { SidebarTree } from '../SidebarTree';
import { TreeNode } from '../../model/types';

const sampleAgentGroupsData: TreeNode[] = [
  {
    id: "worktype",
    label: "근무형태",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "day",
        label: "주간",
        type: "folder",
        isOpen: true,
        children: [
          { id: "day-1", label: "일반상담그룹", type: "file", variant: "blue" },
          { id: "day-2", label: "VIP상담그룹", type: "file", variant: "red" },
          { id: "day-3", label: "컴플레인그룹", type: "file", variant: "green" }
        ]
      },
      {
        id: "night",
        label: "야간",
        type: "folder",
        children: [
          { id: "night-1", label: "긴급상담그룹", type: "file", variant: "red" },
          { id: "night-2", label: "일반상담그룹", type: "file", variant: "blue" }
        ]
      }
    ]
  },
  {
    id: "skill",
    label: "스킬그룹",
    type: "folder",
    children: [
      {
        id: "skill-1",
        label: "초급상담",
        type: "folder",
        children: [
          { id: "skill-1-1", label: "일반문의", type: "file", variant: "blue" },
          { id: "skill-1-2", label: "단순접수", type: "file", variant: "green" }
        ]
      },
      {
        id: "skill-2",
        label: "전문상담",
        type: "folder",
        children: [
          { id: "skill-2-1", label: "기술지원", type: "file", variant: "red" },
          { id: "skill-2-2", label: "장애처리", type: "file", variant: "red" }
        ]
      }
    ]
  },
  {
    id: "special",
    label: "특별관리그룹",
    type: "folder",
    children: [
      { id: "special-1", label: "VIP전담팀", type: "file", variant: "red" },
      { id: "special-2", label: "클레임전담", type: "file", variant: "red" }
    ]
  }
];

export function AgentGroupsTree() {
  return (
    <div className="flex-1 overflow-y-auto">
      <SidebarTree data={sampleAgentGroupsData} />
    </div>
  );
}