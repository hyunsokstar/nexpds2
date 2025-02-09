// widgets/sidebar/ui/SidebarTree.tsx
"use client";

import React, { useState } from 'react';
import { TreeItem } from './TreeItem';

interface TreeNode {
  id: string;
  label: string;
  type: 'folder' | 'file';
  variant?: 'default' | 'blue' | 'red' | 'green';
  children?: TreeNode[];
}

interface SidebarTreeProps {
  data: TreeNode[];
  level?: number;
}

export function SidebarTree({ data, level = 0 }: SidebarTreeProps) {
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set(['NEXUS', '[2] SKT', '1247 그룹']));

  const toggleNode = (nodeId: string) => {
    const newOpenNodes = new Set(openNodes);
    if (newOpenNodes.has(nodeId)) {
      newOpenNodes.delete(nodeId);
    } else {
      newOpenNodes.add(nodeId);
    }
    setOpenNodes(newOpenNodes);
  };

  return (
    <div>
      {data.map((node) => (
        <React.Fragment key={node.id}>
          <TreeItem
            label={node.label}
            type={node.type}
            level={level}
            isOpen={openNodes.has(node.id)}
            variant={node.variant}
            onToggle={() => node.type === 'folder' && toggleNode(node.id)}
          />
          {node.children && openNodes.has(node.id) && (
            <SidebarTree data={node.children} level={level + 1} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}