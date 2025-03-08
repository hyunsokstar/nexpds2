'use client'

import TabContainer from '@/widgets/tab-container'
import Sidebar from '@/widgets/sidebar'
import { useTabSelectors } from '@/features/tabs/store/useTabStore'
import Header from '../header'
import Footer from '../footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getTabs } = useTabSelectors();
  const tabs = getTabs();
  const hasTabs = tabs.length > 0;

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 탭 컨테이너 */}
          <TabContainer />
          
          {/* 탭이 없을 때 기본 콘텐츠 표시 */}
          {!hasTabs && (
            <main className="flex-1 overflow-auto p-4">
              {children}
            </main>
          )}
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  )
}