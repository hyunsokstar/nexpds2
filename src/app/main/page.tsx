// src\app\main\page.tsx
import React from 'react'

export default function MainPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-700">시스템 상태</h2>
          <p className="mt-2 text-sm text-gray-500">모든 시스템이 정상 작동 중입니다.</p>
        </div>
        
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-700">오늘의 활성 캠페인</h2>
          <p className="mt-2 text-sm text-gray-500">5개의 캠페인이 현재 활성화되어 있습니다.</p>
        </div>
        
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-700">최근 알림</h2>
          <p className="mt-2 text-sm text-gray-500">새로운 알림이 없습니다.</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        왼쪽 사이드바 또는 상단 메뉴에서 원하는 기능을 선택하세요.
      </p>
    </div>
  )
}