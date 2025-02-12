import React from 'react';
import { SidebarTree } from '../SidebarTree';
import { TreeNode } from '../../model/types';

const sampleCampaignData: TreeNode[] = [
  {
    id: "NEXUS",
    label: "NEXUS",
    type: "folder" as const,
    isOpen: true,
    children: [
      {
        id: "1",
        label: "[1] DEFAULT",
        type: "folder" as const,
      },
      {
        id: "2",
        label: "[2] SKT",
        type: "folder" as const,
        isOpen: true,
        children: [
          { id: "2-1", label: "모니터링", type: "file" as const, variant: "red" },
          { id: "2-2", label: "testtest_00124", type: "file" as const, variant: "blue" },
          { id: "2-3", label: "testtest_00124", type: "file" as const, variant: "blue" },
          {
            id: "2-4",
            label: "1247 그룹",
            type: "folder" as const,
            children: [
              { id: "2-4-1", label: "카카오톡회원", type: "file" as const, variant: "green" },
              { id: "2-4-2", label: "카카오톡회원", type: "file" as const, variant: "red" },
              { id: "2-4-3", label: "카카오톡회원", type: "file" as const, variant: "blue" },
            ]
          },
          { id: "2-5", label: "PDS_Web_Only", type: "file" as const, variant: "green" },
          { id: "2-6", label: "asldk;jflkasdjfkds", type: "file" as const, variant: "red" },
        ]
      },
      {
        id: "3",
        label: "[3] KAKAO ENTER",
        type: "folder" as const,
      },
      {
        id: "4",
        label: "[4] SK텔레카",
        type: "folder" as const,
      }
    ]
  }
];

export function CampaignTree() {
  return (
    <div className="flex-1 overflow-y-auto">
      <SidebarTree data={sampleCampaignData} />
    </div>
  );
}