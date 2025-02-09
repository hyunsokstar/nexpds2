// app/layout.tsx
import { Providers } from "@/shared/providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { AppLayout } from "@/widgets/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NEXPDS",
  description: "NEXPDS 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}