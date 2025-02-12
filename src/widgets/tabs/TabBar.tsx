// src/widgets/tabs/TabBar.tsx
import { X, ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useMenuStore } from "@/store/tabStore";
import { useRef, useState, useEffect } from "react";

export function TabBar({ position }: { position: 'left' | 'right' }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const { 
    leftTabs, 
    rightTabs, 
    activeLeftTabId, 
    activeRightTabId, 
    setActiveTab,
    closeTab,
    moveTabToOtherSide,
    toggleSplit,
    isSplit
  } = useMenuStore();

  const tabs = position === 'left' ? leftTabs : rightTabs;
  const activeTabId = position === 'left' ? activeLeftTabId : activeRightTabId;
  const otherActiveTabId = position === 'left' ? activeRightTabId : activeLeftTabId;

  useEffect(() => {
    setShowScrollButtons(tabs.length >= 6);
  }, [tabs.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (tabs.length === 0) {
    return null;
  }

  const handleButtonClick = () => {
    if (position === 'right' && isSplit) {
      toggleSplit();
    } else {
      if (activeTabId) {
        moveTabToOtherSide(activeTabId, position);
      }
    }
  };

  const getTabClassName = (tabId: number) => {
    const isCurrentActive = tabId === activeTabId;
    const isOtherActive = tabId === otherActiveTabId;
    
    const baseStyle = "flex items-center px-2 h-8 rounded-t cursor-pointer border shrink-0 ";
    
    if (isCurrentActive) {
      return `${baseStyle} bg-white border-solid border-2 border-blue-400 border-b-0`;
    } else if (isOtherActive) {
      return `${baseStyle} bg-white border-solid border border-blue-400 border-b-0`;
    } else {
      return `${baseStyle} border-dashed border-gray-300 hover:border-gray-400`;
    }
  };

  return (
    <div className="relative w-full h-10">
      <div className="relative border-b px-2 flex items-center justify-between h-10">
        <div className="flex-1 relative flex items-center overflow-hidden">
          {/* 왼쪽 스크롤 버튼 */}
          {showScrollButtons && (
            <div className="absolute left-0 top-0 bottom-0 bg-white z-20">
              <button
                className="h-full px-1 hover:bg-gray-50 border-r flex items-center"
                onClick={() => handleScroll('left')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 탭 목록 */}
          <div 
            ref={scrollContainerRef}
            className={`
              flex-1 flex items-center space-x-2 
              overflow-x-scroll scrollbar-none 
              ${showScrollButtons ? 'px-6' : ''}
            `}
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={getTabClassName(tab.id)}
                onClick={() => setActiveTab(tab.id, position)}
              >
                <div className={tab.id === activeTabId ? 'font-semibold whitespace-nowrap' : 'whitespace-nowrap'}>
                  {tab.title}
                </div>
                <button
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id, position);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* 오른쪽 스크롤 버튼 */}
          {showScrollButtons && (
            <div className="absolute right-0 top-0 bottom-0 bg-white z-20">
              <button
                className="h-full px-1 hover:bg-gray-50 border-l flex items-center"
                onClick={() => handleScroll('right')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 분할/이동 버튼 */}
        <button 
          className={`ml-2 p-1 hover:bg-gray-100 rounded shrink-0 ${
            position === 'right' && isSplit ? 'border border-dashed border-red-400' : ''
          }`}
          onClick={handleButtonClick}
          title={position === 'right' && isSplit ? "분할 해제" : "탭 이동"}
        >
          <ArrowLeftRight className={`w-4 h-4 ${
            position === 'right' && isSplit ? 'text-red-400' : ''
          }`} />
        </button>
      </div>
    </div>
  );
}