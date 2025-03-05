// src\widgets\layouts\main-layout.tsx

'use client'

import Header from '@/widgets/header'
// import Sidebar from '@/widgets/sidebar'
// import TabContainer from '@/widgets/tab-container'
// import Footer from '@/widgets/footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* <Sidebar /> */}
        
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* <TabContainer /> */}
          
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
          
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  )
}