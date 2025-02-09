// widgets/sidebar/index.tsx
"use client";

import React, { useCallback, useState } from "react";
import { Resizable } from "re-resizable";
import { useSidebarStore } from "@/store/useSidebarStore";
import { SidebarTree } from "./ui/SidebarTree";
import { sidebarData } from "./model/sidebarData";
import { SidebarToggleButton } from "./ui/SidebarToggleButton";
import { debounce } from 'lodash';

export default function Sidebar() {
  const { isOpen, width, setWidth } = useSidebarStore();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const [isResizing, setIsResizing] = useState(false);

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
            h-full
            ${!isOpen && 'w-0 overflow-hidden'}
            ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}
          `}
        >
          <div className="p-4 overflow-y-auto h-full">
            <SidebarTree data={sidebarData} />
          </div>
        </div>

        {/* 경계선 */}
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