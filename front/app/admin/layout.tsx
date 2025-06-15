"use client";
// app/admin/layout.tsx
import Header from "@/components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className="px-6 py-8">{children}</main>
    </>
  );
}
