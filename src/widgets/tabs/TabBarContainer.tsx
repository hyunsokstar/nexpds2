// widgets/tabs/TabBarContainer.tsx
"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowLeftRight } from "lucide-react";
import { useState } from 'react';
import { useMenuStore } from "@/store/tabStore";
import { SortableTab } from '../tabs/SortableTab';

export function TabBarContainer() {
  const {
    leftTabs,
    rightTabs,
    activeLeftTabId,
    activeRightTabId,
    setActiveTab,
    closeTab,
    moveTabToOtherSide
  } = useMenuStore();

  // activeId는 드래그 중인 탭의 id를 저장합니다.
  const [activeId, setActiveId] = useState<number | null>(null);
  // dragOrigin은 드래그 시작 시 탭의 원래 영역('left' | 'right')를 저장합니다.
  const [dragOrigin, setDragOrigin] = useState<'left' | 'right' | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as { position: 'left' | 'right' };
    setActiveId(Number(active.id));
    setDragOrigin(data.position);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const overData = over.data.current as { position: 'left' | 'right' } | null;
    if (!overData || !dragOrigin) return;
    const targetPosition = overData.position;
    // 드래그 시작한 영역과 현재 오버된 영역이 다르면 탭 이동 실행
    if (dragOrigin !== targetPosition) {
      moveTabToOtherSide(Number(active.id), dragOrigin);
      // 탭이 이동했으므로 현재 영역을 새로운 origin으로 업데이트
      setDragOrigin(targetPosition);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setDragOrigin(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col">
        {/* 탭바 영역 */}
        <div className="flex">
          {/* 왼쪽 탭바 */}
          <div className="w-1/2 border-r border-dashed border-red-400">
            <div className="relative border-b px-2 flex items-center justify-between h-10">
              <SortableContext
                items={leftTabs.map(tab => tab.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex items-center space-x-2 flex-1">
                  {leftTabs.map(tab => (
                    <SortableTab
                      key={tab.id}
                      tab={tab}
                      position="left"
                      isActive={tab.id === activeLeftTabId}
                      onClose={() => closeTab(tab.id, 'left')}
                      onActivate={() => setActiveTab(tab.id, 'left')}
                    />
                  ))}
                </div>
              </SortableContext>
              <button
                className="ml-2 p-1 hover:bg-gray-100 rounded"
                onClick={() => {
                  if (activeLeftTabId) {
                    moveTabToOtherSide(activeLeftTabId, 'left');
                  }
                }}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 오른쪽 탭바 */}
          <div className="w-1/2 border-l border-dashed border-blue-400">
            <div className="relative border-b px-2 flex items-center justify-between h-10">
              <SortableContext
                items={rightTabs.map(tab => tab.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex items-center space-x-2 flex-1">
                  {rightTabs.map(tab => (
                    <SortableTab
                      key={tab.id}
                      tab={tab}
                      position="right"
                      isActive={tab.id === activeRightTabId}
                      onClose={() => closeTab(tab.id, 'right')}
                      onActivate={() => setActiveTab(tab.id, 'right')}
                    />
                  ))}
                </div>
              </SortableContext>
              <button
                className="ml-2 p-1 hover:bg-gray-100 rounded"
                onClick={() => {
                  if (activeRightTabId) {
                    moveTabToOtherSide(activeRightTabId, 'right');
                  }
                }}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 드래그 오버레이 */}
        <DragOverlay>
          {activeId ? (
            <div className="flex items-center px-2 h-8 rounded-t bg-white border shadow-lg">
              {[...leftTabs, ...rightTabs].find(tab => tab.id === activeId)?.title}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
