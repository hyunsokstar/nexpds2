"use client";

import React, { useState } from "react";
import { Minus, Plus, RotateCcw, Maximize2, X } from "lucide-react";

interface ZoomableContentProps {
  children: React.ReactNode;
  minZoom?: number;
  maxZoom?: number;
}

export function ZoomableContent({
  children,
  minZoom = 0.5,
  maxZoom = 2,
}: ZoomableContentProps) {
  const [zoom, setZoom] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, maxZoom));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, minZoom));
  const resetZoom = () => setZoom(1);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🔹 버튼 컨트롤 (z-index 최상위, pointer-events 보장) */}
      <div
        className={`absolute top-2 right-2 flex items-center gap-2 bg-white p-1 rounded shadow transition-opacity ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 50, pointerEvents: "auto" }} // 🔹 해결: z-index, pointer-events 설정
      >
        <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded">
          <Minus size={16} />
        </button>
        <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded">
          <Plus size={16} />
        </button>
        <button onClick={resetZoom} className="p-1 hover:bg-gray-100 rounded">
          <RotateCcw size={16} />
        </button>

        {/* 전체 보기 버튼 */}
        <button onClick={openDialog} className="p-1 hover:bg-gray-100 rounded">
          <Maximize2 size={16} />
        </button>

        {/* 줌 상태 표시 */}
        <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
      </div>

      {/* 🔹 확대/축소 적용된 컨텐츠 */}
      <div
        className="border p-2"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>

      {/* 🔹 모달 (전체 보기) */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          style={{ pointerEvents: "auto" }} // 🔹 해결: 모달에서도 이벤트 가능하도록 설정
        >
          <div className="bg-white p-4 w-[90%] h-[90%] relative overflow-auto shadow-lg">
            {/* 닫기 버튼 */}
            <button
              onClick={closeDialog}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>

            {/* 전체 보기 컨텐츠 */}
            <div>
              <h2 className="font-bold mb-4">전체 보기</h2>
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
