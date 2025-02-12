// widgets/tabs/TabBar.tsx
import { X, ArrowLeftRight } from "lucide-react";
import { useMenuStore } from "@/store/tabStore";

export function TabBar({ position }: { position: 'left' | 'right' }) {
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

  // position에 따른 상태 선택
  const tabs = position === 'left' ? leftTabs : rightTabs;
  const activeTabId = position === 'left' ? activeLeftTabId : activeRightTabId;

  if (tabs.length === 0) {
    return null;
  }

  const handleSplitToggle = () => {
    if (isSplit) {
      // 분할된 상태에서는 toggleSplit을 호출하여 해제
      toggleSplit();
    } else {
      // 분할되지 않은 상태에서는 현재 활성 탭을 반대편으로 이동
      if (activeTabId) {
        moveTabToOtherSide(activeTabId, position);
      }
    }
  };

  return (
    <div className="relative w-full h-10">
      {/* 탭 바 */}
      <div className="relative border-b px-2 flex items-center justify-between h-10">
        {/* 탭 목록 */}
        <div className="flex items-center space-x-2 flex-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-2 h-8 rounded-t cursor-pointer 
                ${tab.id === activeTabId ? "bg-white border-x border-t border-b-0" : ""}
              `}
              onClick={() => setActiveTab(tab.id, position)}
            >
              <div>{tab.title}</div>
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

        {/* 분할/해제 토글 버튼 */}
        <button 
          className={`ml-2 p-1 hover:bg-gray-100 rounded ${
            isSplit ? 'border border-dashed border-red-400' : ''
          }`}
          onClick={handleSplitToggle}
          title={isSplit ? "분할 해제" : "탭 이동"}
        >
          <ArrowLeftRight className={`w-4 h-4 ${isSplit ? 'text-red-400' : ''}`} />
        </button>
      </div>
    </div>
  );
}