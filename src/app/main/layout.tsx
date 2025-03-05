// src\app\main\layout.tsx
import MainLayout from '@/widgets/layouts/main-layout'

export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}