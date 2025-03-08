import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, AlertTriangleIcon, CircleIcon, FolderIcon, BuildingIcon } from 'lucide-react';
import { SidebarItem, ItemType } from '../config/sidebar-menu-items';

interface TreeItemProps {
  item: SidebarItem;
  currentPath: string;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  level: number;
  expandedItems: Record<string, boolean>;
}

// 아이템 타입에 따른 아이콘 가져오기
const getIconForType = (type: ItemType, status?: string) => {
  switch (type) {
    case 'organization':
      return <BuildingIcon size={16} className="text-blue-500" />;
    case 'tenant':
      return <FolderIcon size={16} className="text-amber-500" />;
    case 'campaign':
      if (status === 'warning') {
        return <CircleIcon 
          size={14} 
          className="text-orange-500"
          fill="rgb(249, 115, 22)"
        />;
      }
      return <CircleIcon 
        size={14} 
        className={status === 'active' ? 'text-green-500' : 'text-gray-400'} 
        fill={status === 'active' ? 'rgb(34, 197, 94)' : 'transparent'}
      />;
    default:
      return <CircleIcon size={14} />;
  }
};

const TreeItem: React.FC<TreeItemProps> = ({ 
  item, 
  currentPath, 
  isExpanded, 
  onToggleExpand,
  level,
  expandedItems
}) => {
  const isActive = currentPath === item.href;
  const hasChildren = item.children && item.children.length > 0;
  const indent = level * 16;
  
  // 아이템 클릭 시 처리 함수
  const handleItemClick = () => {
    if (hasChildren) {
      onToggleExpand(item.id);
    }
  };
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1.5 text-sm cursor-pointer rounded hover:bg-gray-50",
          isActive && "bg-blue-50 text-blue-600"
        )}
        onClick={handleItemClick}
        style={{ paddingLeft: `${indent}px` }}
      >
        {/* 폴더 아이콘 - 열고 닫기 상태에 따라 변경 */}
        {hasChildren && (
          <span className="text-gray-400 mr-1">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        
        {/* 아이템 아이콘 */}
        <span className="mr-2">
          {getIconForType(item.type, item.status)}
        </span>
        
        {/* 라벨 */}
        <span>{item.label}</span>
        
        {/* 경고 표시 */}
        {item.status === 'warning' && (
          <AlertTriangleIcon size={14} className="ml-2 text-orange-500" />
        )}
      </div>
      
      {/* 자식 항목은 열린 상태일 때만 렌더링 */}
      {isExpanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              currentPath={currentPath}
              isExpanded={!!expandedItems[child.id]} // 자식 항목의 확장 상태
              onToggleExpand={onToggleExpand} // 동일한 토글 함수 전달
              level={level + 1}
              expandedItems={expandedItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeItem;