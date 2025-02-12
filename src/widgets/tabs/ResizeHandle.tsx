import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

interface ResizeHandleProps {
  onResize: (newWidth: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizeHandle({ 
  onResize, 
  minWidth = 200, 
  maxWidth = 800 
}: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const debouncedResize = useCallback(
    debounce((width: number) => {
      onResize(width);
    }, 16),
    [onResize]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const parentElement = (e.target as HTMLElement)?.closest('.flex');
    if (!parentElement) return;

    const parentRect = parentElement.getBoundingClientRect();
    const newWidth = e.clientX - parentRect.left;
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    
    requestAnimationFrame(() => {
      debouncedResize(clampedWidth);
    });
  }, [isDragging, minWidth, maxWidth, debouncedResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    debouncedResize.flush();
  }, [debouncedResize]);

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
      className="relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 리사이즈 감지 영역 */}
      <div
        className={`
          absolute top-0 -right-1 w-2 h-full
          cursor-col-resize z-30
        `}
        onMouseDown={handleMouseDown}
      />

      {/* 배경 라인 */}
      <div 
        className={`
          absolute top-0 right-0 w-px h-full
          bg-gray-200
        `}
      />

      {/* 호버/드래그 효과 */}
      <div
        className={`
          absolute top-0 -right-1 w-2 h-full
          transition-opacity duration-200
          ${(isHovered || isDragging) ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* 핸들 표시 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`
              w-[3px] h-8 rounded-full
              ${isDragging ? 'bg-blue-500' : 'bg-gray-400'}
              transition-colors duration-200
            `}
          />
        </div>

        {/* 반투명 하이라이트 */}
        <div
          className={`
            absolute inset-0
            ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
            opacity-30
          `}
        />
      </div>
    </div>
  );
}