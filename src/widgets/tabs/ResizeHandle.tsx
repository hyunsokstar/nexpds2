// src/widgets/layout/components/ResizeHandle.tsx
import { useState, useCallback, useEffect } from 'react';

interface ResizeHandleProps {
  onResize: (newWidth: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizeHandle({ onResize, minWidth = 200, maxWidth = 800 }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const parentRect = (e.target as HTMLElement)?.closest('.flex')?.getBoundingClientRect();
    if (!parentRect) return;

    const newWidth = e.clientX - parentRect.left;
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    onResize(clampedWidth);
  }, [isDragging, minWidth, maxWidth, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`
        absolute right-[-4px] top-0 bottom-0 w-2 cursor-col-resize z-30
        hover:bg-blue-400 hover:opacity-50 transition-colors
        ${isDragging ? 'bg-blue-400 opacity-50' : ''}
      `}
      onMouseDown={handleMouseDown}
    />
  );
}