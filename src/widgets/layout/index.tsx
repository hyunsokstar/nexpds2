// widgets/layout/index.tsx
"use client";

import Header from "@/widgets/header";
import Sidebar from "@/widgets/sidebar";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      <Header />
      <div className="flex">
        {!isLoginPage && <Sidebar />}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}