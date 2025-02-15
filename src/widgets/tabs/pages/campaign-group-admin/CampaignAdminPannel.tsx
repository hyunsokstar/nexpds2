import { ZoomableContent } from '@/shared/ui/ZoomableContent';
import React from 'react';

const CampaignAdminPannel = () => {
  return (
    <ZoomableContent>
      {/* 가로 레이아웃을 위한 flex-container */}
      <div className="flex items-start space-x-4 p-4 min-w-max">
        {/* 카드 1 */}
        <div className="flex-shrink-0 w-80 p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-bold mb-2">캠페인 정보</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">캠페인 ID</span>
              <span>SKT_2024_001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상태</span>
              <span className="text-green-500">진행중</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">시작일</span>
              <span>2024-02-01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">종료일</span>
              <span>2024-03-31</span>
            </div>
          </div>
        </div>

        {/* 카드 2 */}
        <div className="flex-shrink-0 w-96 p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-bold mb-2">실적 현황</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded">
              <div className="flex justify-between mb-1">
                <span>목표 달성률</span>
                <span className="font-bold text-blue-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">목표</div>
                <div className="font-bold">1,000,000</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">달성</div>
                <div className="font-bold text-blue-600">750,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* 카드 3 */}
        <div className="flex-shrink-0 w-80 p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-bold mb-2">일간 통계</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">오늘 신규</span>
              <span className="font-bold">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">전일 대비</span>
              <span className="text-green-500">+5.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">주간 평균</span>
              <span>1,158</span>
            </div>
          </div>
        </div>

        {/* 카드 4 */}
        <div className="flex-shrink-0 w-80 p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="font-bold mb-2">채널별 현황</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">온라인</span>
              <span>45%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">오프라인</span>
              <span>30%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">제휴</span>
              <span>25%</span>
            </div>
          </div>
          <p className="mt-4">
            {Array(30).fill("DEFAULT 캠페인 내용! ").join(" ")}
          </p>
        </div>
      </div>
    </ZoomableContent>
  );
};

export default CampaignAdminPannel;
