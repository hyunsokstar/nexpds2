

// widgets/tabs/TabBar.tsx (단계 1, 2 적용)
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent, // DragOverEvent 추가
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { X, ArrowLeftRight } from "lucide-react";
import { useMenuStore } from "@/store/tabStore";
import { useState } from 'react';
import { SortableTab } from './SortableTab';

export function TabBar({ position }: { position: 'left' | 'right' }) {
  const {
    leftTabs,
    rightTabs,
    activeLeftTabId,
    activeRightTabId,
    setActiveTab,
    closeTab,
    moveTabToOtherSide,
    setTabPosition // 스토어에 추가될 함수
  } = useMenuStore();

  const [activeId, setActiveId] = useState<number | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const tabs = position === 'left' ? leftTabs : rightTabs;
  const activeTabId = position === 'left' ? activeLeftTabId : activeRightTabId;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

    // 단계 1: DragOver 이벤트 핸들러 추가 (탭 이동 감지)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeTabId = Number(active.id);
      const overPosition = (over.data.current as any)?.position;

      // 다른 영역으로 드래그하는 경우
      if (overPosition && overPosition !== position) {
           moveTabToOtherSide(activeTabId, position); // 탭 이동
      }
    }
  };


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeTabId = Number(active.id);
      const overPosition = (over.data.current as any)?.position;

      // 다른 영역으로 드래그 앤 드롭이 *완료*된 경우 (여기서는 아무것도 안함 - handleDragOver 에서 이미 처리)
      if (overPosition && overPosition !== position) {
      }
    }
    setActiveId(null);
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver} // onDragOver 핸들러 추가
    >
      <div className="relative w-full h-10">
        <div className="relative border-b px-2 flex items-center justify-between h-10">
          <SortableContext
            items={tabs.map(tab => tab.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-center space-x-2 flex-1">
              {tabs.map((tab) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  position={position}
                  isActive={tab.id === activeTabId}
                  onClose={() => closeTab(tab.id, position)}
                  onActivate={() => setActiveTab(tab.id, position)}
                />
              ))}
            </div>
          </SortableContext>

          <button
            className="ml-2 p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              if (activeTabId) {
                moveTabToOtherSide(activeTabId, position);
              }
            }}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="flex items-center px-2 h-8 rounded-t bg-white border shadow-lg">
            {tabs.find(tab => tab.id === activeId)?.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}