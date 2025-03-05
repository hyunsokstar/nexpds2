// src\app\page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('token')
    
    if (true) {
      // 로그인 되어 있으면 메인 페이지로
      router.push('/main')
    } else {
      // 로그인 안 되어 있으면 로그인 페이지로
      router.push('/login')
    }
  }, [router])

  // 리디렉션 중 표시할 로딩 상태
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">리디렉션 중...</p>
    </div>
  )
}