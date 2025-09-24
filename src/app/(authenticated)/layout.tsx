import { Sidebar } from "@/components/layout/sidebar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden size-screen">
      <SidebarProvider>
        <Sidebar />
        <section className="size-full overflow-auto px-4 py-12">
          {children}
        </section>
      </SidebarProvider>
    </div>
  );
}
