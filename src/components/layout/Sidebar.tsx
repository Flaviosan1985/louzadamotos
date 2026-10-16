"use client";

/**
 * Adapted from AdminCN Free (shadcn/studio).
 * Copyright (c) 2026 shadcn/studio
 * Licensed under MIT. See LICENSE.md.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/configs/navConfig";
import { themeConfig } from "@/configs/themeConfig";
import { emptySearchParams, getActiveBranchKeys } from "@/lib/nav";
import {
  Sidebar as SidebarShell,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarAccount } from "@/components/layout/sidebar/SidebarAccount";
import { SidebarNavGroup } from "@/components/layout/sidebar/SidebarNavGroup";

export function Sidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const activeBranchKeys = useMemo(
    () => getActiveBranchKeys(navItems, pathname, emptySearchParams),
    [pathname],
  );

  const isBranchOpen = useCallback(
    (key: string) => openItems[key] ?? activeBranchKeys.has(key),
    [openItems, activeBranchKeys],
  );

  const setOpenItem = useCallback((key: string, open: boolean) => {
    setOpenItems((prev) => ({ ...prev, [key]: open }));
  }, []);

  useEffect(() => {
    setOpenItems((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const key of activeBranchKeys) {
        if (next[key] !== true) {
          next[key] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [activeBranchKeys]);

  const isIconMode = state === "collapsed" && !isMobile;

  return (
    <SidebarShell collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-16 overflow-visible! bg-transparent! px-2 hover:bg-transparent!"
              render={<Link href={themeConfig.homePageUrl} />}
            >
              <Image
                src="/logo.jpg"
                alt={themeConfig.templateName}
                width={64}
                height={64}
                className="size-14 rounded-lg object-cover group-data-[collapsible=icon]:size-8"
                priority
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:overflow-y-auto">
        {navItems.map((navItem, index) => (
          <SidebarNavGroup
            key={navItem.groupLabel || index}
            data={navItem.items}
            groupLabel={navItem.groupLabel}
            pathname={pathname}
            searchParams={emptySearchParams}
            isIconMode={isIconMode}
            isBranchOpen={isBranchOpen}
            setOpenItem={setOpenItem}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarAccount />
      </SidebarFooter>
    </SidebarShell>
  );
}
