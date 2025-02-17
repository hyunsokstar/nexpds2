"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { TabInfo } from '@/store/tabStore';
import CampaignGroupAdminPannel from '@/widgets/tabs/pages/campaign-group-admin/CampaignGroupAdminPannel';
import CampaignAdminPannel from '@/widgets/tabs/pages/campaign-group-admin/CampaignAdminPannel';

interface SplitScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: TabInfo[];
  onApply: () => void;
}

export function SplitScreenDialog({ isOpen, onClose, tabs, onApply }: SplitScreenDialogProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const screenRefs = useRef<Array<HTMLDivElement | null>>([]);

  // 부드러운 스크롤 함수
  function smoothScrollTo(element: HTMLElement, to: number, duration = 600) {
    let start = element.scrollTop;
    let startTime: number | null = null;

    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);

      element.scrollTop = start + (to - start) * easedProgress;

      if (elapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop;
      let currentIndex = 0;

      for (let i = 0; i < tabs.length; i++) {
        const ref = screenRefs.current[i];
        if (ref && ref.offsetTop <= scrollPos + 10) {
          currentIndex = i;
        }
      }
      setActiveIndex(currentIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [tabs]);

  const handleScrollToIndex = (index: number) => {
    const container = containerRef.current;
    const ref = screenRefs.current[index];
    if (!container || !ref) return;

    setActiveIndex(index);

    const containerRect = container.getBoundingClientRect();
    const refRect = ref.getBoundingClientRect();
    const offset = (refRect.top - containerRect.top) + container.scrollTop;

    smoothScrollTo(container, offset, 1000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (!isNaN(Number(key))) {
        const screenNumber = Number(key);
        if (screenNumber >= 1 && screenNumber <= tabs.length) {
          handleScrollToIndex(screenNumber - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden flex flex-col">
        {/* 헤더 (버튼을 타이틀 옆으로 이동) */}
        <DialogHeader className="shrink-0 px-6 py-4 flex justify-between items-center">
          <DialogTitle></DialogTitle>
          
          {/* 버튼 그룹 - 오른쪽 정렬 */}
          <div className="flex gap-2">
            {tabs.map((tab, index) => (
              <Button
                key={index}
                onClick={() => handleScrollToIndex(index)}
                variant="outline"
                className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all
                  ${
                    activeIndex === index
                      ? "bg-blue-100 text-blue-600 border-blue-500"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                화면 {tab.menuId}
              </Button>
            ))}
          </div>
        </DialogHeader>

        {/* 스크롤 영역 */}
        <div ref={containerRef} className="flex-1 overflow-y-auto px-6">
          <div className="flex flex-col gap-6 pb-6">
            {tabs.map((tab, index) => (
              <div
                key={`preview-${tab.menuId}-${index}`}
                ref={(el) => { screenRefs.current[index] = el; }}
                id={`screen-${index}`}
                className={
                  "border rounded-lg bg-gray-50 h-[600px] overflow-auto " +
                  (activeIndex === index ? "ring-2 ring-blue-400" : "")
                }
              >
                <TabPreview tab={tab} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="shrink-0 flex justify-end gap-4 px-6 py-4 border-t bg-white">
          <Button variant="secondary" onClick={onClose} className="w-32">
            취소
          </Button>
          <Button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="w-32"
          >
            적용
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const TabPreview = ({ tab, index }: { tab: TabInfo; index: number }) => {
  const renderPreviewContent = () => {
    switch (tab.menuId) {
      case 1:
        return <CampaignGroupAdminPannel />;
      case 2:
        return <CampaignAdminPannel />;
      default:
        return <div className="text-lg">{tab.title}</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 화면 헤더 */}
      <div className="shrink-0 text-xl font-semibold p-4 border-b bg-white">
        화면 {tab.menuId}
      </div>
      {/* 실제 콘텐츠 영역 */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <div className="h-full w-full overflow-auto p-4 bg-white">
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
