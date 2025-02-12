// src/widgets/sidebar/ui/tabs/AgentsTree.tsx
import React from 'react';
import { SidebarTree } from '../SidebarTree';
import { TreeNode } from '../../model/types';

const sampleAgentsData: TreeNode[] = [
    {
        id: "1",
        label: "서울센터",
        type: "folder" as const,
        isOpen: true,
        children: [
            {
                id: "1-1",
                label: "1팀",
                type: "folder" as const,
                isOpen: true,
                children: [
                    { id: "1-1-1", label: "김상담", type: "file" as const, variant: "blue" },
                    { id: "1-1-2", label: "이상담", type: "file" as const, variant: "blue" },
                    { id: "1-1-3", label: "박상담", type: "file" as const, variant: "green" },
                ]
            },
            {
                id: "1-2",
                label: "2팀",
                type: "folder" as const,
                children: [
                    { id: "1-2-1", label: "최상담", type: "file" as const, variant: "red" },
                    { id: "1-2-2", label: "정상담", type: "file" as const, variant: "blue" },
                ]
            }
        ]
    },
    {
        id: "2",
        label: "부산센터",
        type: "folder" as const,
        children: [
            {
                id: "2-1",
                label: "1팀",
                type: "folder" as const,
                children: [
                    { id: "2-1-1", label: "강상담", type: "file" as const, variant: "green" },
                    { id: "2-1-2", label: "조상담", type: "file" as const, variant: "blue" },
                ]
            }
        ]
    }
];

export function AgentsTree() {
    return (
        <div className="flex-1 overflow-y-auto">
            <SidebarTree data={sampleAgentsData} />
        </div>
    );
}