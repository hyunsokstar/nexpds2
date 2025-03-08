'use client'

import React from 'react'
import { useTabSelectors } from '@/features/tabs/store/useTabStore'
import TabBar from './tab-bar'
import TabPanel from './tab-panel'

interface TabContainerProps {
  className?: string
}

const TabContainer = ({ className }: TabContainerProps) => {
  const { getTabs } = useTabSelectors()
  const tabs = getTabs()
  const hasTabs = tabs.length > 0
  
  return (
    <div className={`flex flex-col ${className}`}>
      {/* 탭바 */}
      <TabBar />
      
      {/* 탭 패널 */}
      {hasTabs && <TabPanel />}
    </div>
  )
}

export default TabContainer