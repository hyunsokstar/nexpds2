// widgets/sidebar/index.tsx
"use client";

import React from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { SidebarTree } from "./ui/SidebarTree";
import { sidebarData } from "./model/sidebarData";
import { SidebarToggleButton } from "./ui/SidebarToggleButton";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <aside
      className={`fixed top-[112px] left-0 h-[calc(100vh-112px)] bg-white ${
        isOpen ? "w-64" : "w-4"
      } transition-all duration-300 ease-in-out`}
    >
      <SidebarToggleButton isOpen={isOpen} onClick={toggleSidebar} />
      
      <div className={cn(
        "p-4 overflow-y-auto h-full",
        !isOpen && "invisible"
      )}>
        <SidebarTree data={sidebarData} />
      </div>
    </aside>
  );
}