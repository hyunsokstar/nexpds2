// widgets/sidebar/index.tsx
"use client";

import React, { useCallback, useState, useEffect } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 렌더링 시 상태 초기화 완료를 확인
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

  // 초기화되기 전까지는 투명하게 처리
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
            h-full
            ${!isOpen && 'w-0 overflow-hidden'}
            ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}
          `}
        >
          <div className="p-4 overflow-y-auto h-full">
            <SidebarTree data={sidebarData} />
          </div>
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