"use client";

import { type ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <div className="flex h-full w-full min-w-0 bg-[#F5F4F8]">
          <Sidebar />
          <SidebarInset className="flex flex-1 flex-col bg-[#F5F4F8]">
            <Header />
            <main className="mx-auto size-full max-w-360 flex-1 px-4 py-6 sm:px-6">{children}</main>
            <Toaster />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
