"use client";
import { AdminGuard } from "@/components/AdminGuard";
import Header from "@/components/Header";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
      <Header />

      <main className="px-6 py-8 pt-28"> <AdminGuard>{children}</AdminGuard></main>
    </>
  );
}

