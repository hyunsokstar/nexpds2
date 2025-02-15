"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import { useSidebarStore } from "@/store/useSidebarStore";
import { SidebarHeader } from './ui/SidebarHeader';
import { TabContent } from './ui/TabContent';
import { SidebarToggleButton } from "./ui/SidebarToggleButton";
import { SidebarTabs } from "./ui/SidebarTabs";

export default function Sidebar() {
  const { isOpen, width, setWidth } = useSidebarStore();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
    setCurrentWidth(width);
  }, [width]);

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
  }, []);

  const handleResize = useCallback((_: any, __: any, ref: HTMLElement) => {
    setCurrentWidth(ref.clientWidth);
  }, []);

  const handleResizeStop = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
    setWidth(currentWidth);
  }, [currentWidth, setWidth]);

  if (!isInitialized) {
    return <div className="h-full opacity-0" />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative select-none">
        <Resizable
          size={{
            width: isOpen ? currentWidth : 16,
            height: '100%',
          }}
          minWidth={16}
          maxWidth={480}
          enable={{
            top: false,
            right: isOpen,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleStyles={{
            right: {
              width: '16px',
              right: '-8px',
              height: '100%',
              position: 'absolute',
              cursor: 'ew-resize',
              zIndex: 50,
              touchAction: 'none',
            }
          }}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
          onResizeStop={handleResizeStop}
          className="bg-white h-full relative"
        >
          {/* 토글 버튼 */}
          <div className="absolute -right-2 top-3 z-40">
            <SidebarToggleButton isOpen={isOpen} onClick={toggleSidebar} />
          </div>

          <div 
            className={`
              h-full flex flex-col
              ${!isOpen && 'w-0 overflow-hidden'}
            `}
          >
            <SidebarHeader />
            <div className="flex-1 overflow-hidden">
              <TabContent />
            </div>
          </div>

          {!isResizing && (
            <div 
              className="absolute top-0 -right-px w-px h-full bg-gray-200 z-30 pointer-events-none"
              style={{
                borderRight: '1px dashed #d1d5db',
              }}
            />
          )}
        </Resizable>
      </div>

      {/* 하단 탭 메뉴 */}
      <div
        className={`
          bg-white flex-shrink-0
          ${!isOpen ? 'w-16' : ''}
        `}
        style={{ 
          width: isOpen ? currentWidth : 16,
        }}
      >
        <SidebarTabs />
      </div>
    </div>
  );
}