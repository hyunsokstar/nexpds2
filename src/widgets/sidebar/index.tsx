"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import { useSidebarStore } from "@/store/useSidebarStore";
import { debounce } from "lodash";
import { SidebarHeader } from "./ui/SidebarHeader";
import { TabContent } from "./ui/TabContent";
import { SidebarToggleButton } from "./ui/SidebarToggleButton";
import { SidebarTabs } from "./ui/SidebarTabs";

export default function Sidebar() {
  const { isOpen, width, setWidth } = useSidebarStore();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const [isResizing, setIsResizing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [resizeStartX, setResizeStartX] = useState(0);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const debouncedSetWidth = useCallback(
    debounce((width: number) => {
      setWidth(width);
    }, 100),
    []
  );

  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    setIsResizing(true);
    setResizeStartX('clientX' in e ? e.clientX : e.touches[0].clientX);
    document.body.style.cursor = "ew-resize";
  }, []);

  const handleResize = useCallback(
    (_: any, __: any, ref: HTMLElement) => {
      const newWidth = ref.clientWidth;
      debouncedSetWidth(newWidth);
    },
    [debouncedSetWidth]
  );

  const handleResizeStop = useCallback((e: MouseEvent | TouchEvent) => {
    setIsResizing(false);
    document.body.style.cursor = "default";

    // 드래그 거리가 매우 작으면 클릭으로 간주
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const dragDistance = Math.abs(clientX - resizeStartX);
    if (dragDistance < 5) {
      toggleSidebar();
    }
  }, [resizeStartX, toggleSidebar]);

  if (!isInitialized) {
    return <div className="h-[calc(100vh-112px)] opacity-0" />;
  }

  return (
    <div className="h-[calc(100vh-112px)]">
      <Resizable
        size={{
          width: isOpen ? width : 16,
          height: "100%",
        }}
        minWidth={16}
        maxWidth={480}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        handleStyles={{
          right: {
            width: "12px",
            right: "-6px",
            cursor: "ew-resize",
            height: "100%",
            position: "absolute",
            zIndex: 20,
          },
        }}
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        className="bg-white h-full relative"
        style={{
          transition: isResizing ? "none" : "width 300ms ease-in-out",
        }}
      >
        <SidebarToggleButton isOpen={isOpen} onClick={toggleSidebar} />

        <div
          className={`
            h-full flex flex-col
            ${!isOpen && "w-0 overflow-hidden"}
            ${isResizing ? "" : "transition-all duration-300 ease-in-out"}
          `}
        >
          {isOpen && (
            <>
              <SidebarHeader />
              <div className="flex-1 overflow-hidden">
                <TabContent />
              </div>
              <SidebarTabs />
            </>
          )}
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