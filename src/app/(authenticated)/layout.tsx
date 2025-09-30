import { Sidebar } from "@/components/layout/sidebar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden size-screen">
      <SidebarProvider>
        <Sidebar />
        <section className="size-full relative">
          <Navbar />
          <section className="relative size-full px-4 py-6">
            {children}
          </section>
        </section>
      </SidebarProvider>
    </div>
  );
}
