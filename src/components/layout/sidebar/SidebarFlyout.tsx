"use client";

/**
 * Adapted from AdminCN Free (shadcn/studio).
 * Copyright (c) 2026 shadcn/studio
 * Licensed under MIT. See LICENSE.md.
 */

import { type ComponentType } from "react";
import Link from "next/link";
import * as Icon from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import type { MenuItem, MenuLeafSubItem, MenuSubItem } from "@/configs/navConfig";
import { isLinkActive, isSubGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

function FlyoutLink({ item, isActive }: { item: MenuLeafSubItem; isActive: boolean }) {
  return (
    <DropdownMenuItem
      className={cn("justify-between gap-2", isActive && "bg-primary/10 text-accent-foreground font-medium")}
      render={<Link href={item.href} />}
    >
      <span className="truncate">{item.label}</span>
    </DropdownMenuItem>
  );
}

export function SidebarFlyout({
  item,
  childItems,
  isChildActive,
  pathname,
  searchParams,
}: {
  item: MenuItem;
  childItems: MenuSubItem[];
  isChildActive: boolean;
  pathname: string;
  searchParams: Pick<URLSearchParams, "get">;
}) {
  const Tag = item.icon ? (Icon[item.icon] as ComponentType) : null;

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<SidebarMenuButton isActive={isChildActive} className="data-active:bg-primary/5!" />}
        >
          {Tag ? <Tag /> : null}
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <ChevronRightIcon className="ml-auto" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={12} className="w-auto min-w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-foreground flex items-center gap-2 text-sm">
              <span className="truncate">{item.label}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {childItems.map((subItem) =>
              isSubGroup(subItem) ? (
                <DropdownMenuSub key={subItem.label}>
                  <DropdownMenuSubTrigger
                    className={cn(
                      subItem.childItems.some((leaf) =>
                        isLinkActive(leaf.href, leaf.activePath, pathname, searchParams),
                      ) && "bg-primary/10 text-accent-foreground font-medium",
                    )}
                  >
                    <span className="truncate">{subItem.label}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent sideOffset={9} className="w-auto min-w-48">
                    {subItem.childItems.map((leaf) => (
                      <FlyoutLink
                        key={leaf.label}
                        item={leaf}
                        isActive={isLinkActive(leaf.href, leaf.activePath, pathname, searchParams)}
                      />
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <FlyoutLink
                  key={subItem.label}
                  item={subItem}
                  isActive={isLinkActive(subItem.href, subItem.activePath, pathname, searchParams)}
                />
              ),
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
