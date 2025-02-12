"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import { useSidebarStore } from "@/store/useSidebarStore";
import { debounce } from 'lodash';
import { SidebarHeader } from './ui/SidebarHeader';
import { TabContent } from './ui/TabContent';
import { SidebarToggleButton } from "./ui/SidebarToggleButton";
import { useSidebarTabStore } from "./model/store";
import { SidebarTabs } from "./ui/SidebarTabs";

export default function Sidebar() {
  const { isOpen, width, setWidth } = useSidebarStore();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const [isResizing, setIsResizing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const debouncedSetWidth = useCallback(
    debounce((width: number) => {
      setWidth(width);
    }, 100),
    []
  );

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
  }, []);

  const handleResize = useCallback((_: any, __: any, ref: HTMLElement) => {
    const newWidth = ref.clientWidth;
    debouncedSetWidth(newWidth);
  }, [debouncedSetWidth]);

  const handleResizeStop = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
  }, []);

  if (!isInitialized) {
    return <div className="h-[calc(100vh-112px)] opacity-0" />;
  }

  return (
    <div className="h-[calc(100vh-112px)]">
      <Resizable
        size={{
          width: isOpen ? width : 16,
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
            width: '4px',
            right: '-2px',
            cursor: 'ew-resize',
            height: '100%',
            position: 'absolute',
          },
        }}
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        className="bg-white h-full relative"
        style={{
          transition: isResizing ? 'none' : 'width 300ms ease-in-out',
        }}
      >
        <SidebarToggleButton isOpen={isOpen} onClick={toggleSidebar} />
        
        <div 
          className={`
            h-full flex flex-col
            ${!isOpen && 'w-0 overflow-hidden'}
            ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}
          `}
        >
          <SidebarHeader />
          <div className="flex-1 overflow-hidden">
            <TabContent />
          </div>
          <SidebarTabs />
        </div>

        <div 
          className={`
            absolute top-0 -right-px w-px h-full bg-gray-200
            after:absolute after:inset-0 after:border-r after:border-dashed after:border-gray-300
          `}
        />
      </Resizable>
    </div>
  );
}