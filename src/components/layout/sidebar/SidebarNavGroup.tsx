"use client";

/**
 * Adapted from AdminCN Free (shadcn/studio).
 * Copyright (c) 2026 shadcn/studio
 * Licensed under MIT. See LICENSE.md.
 */

import { type ComponentType } from "react";
import * as Icon from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import type { MenuItem } from "@/configs/navConfig";
import { isLinkActive, isSubGroup, subGroupKey } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SidebarFlyout } from "@/components/layout/sidebar/SidebarFlyout";
import { SidebarMenuIndicator } from "@/components/layout/sidebar/SidebarMenuIndicator";
import { PanelLink } from "@/components/layout/panel/PanelLink";
import { usePanelNav } from "@/components/layout/panel/PanelNavProvider";

const tabHover =
  "transition-colors duration-200 hover:bg-[#E10600]! hover:text-white! [&_svg]:hover:text-white!";

const activeLeafClass = cn(
  "relative z-10 bg-transparent! data-active:bg-transparent! data-active:text-white! data-active:hover:text-white! [&_svg]:data-active:text-white!",
  tabHover,
);

function firstLeafHref(item: MenuItem) {
  for (const subItem of item.childItems ?? []) {
    if (isSubGroup(subItem)) {
      const leaf = subItem.childItems[0];
      if (leaf) return leaf.href;
    } else {
      return subItem.href;
    }
  }
  return null;
}

export function SidebarNavGroup({
  data,
  groupLabel,
  pathname,
  searchParams,
  isIconMode,
  isBranchOpen,
  setOpenItem,
}: {
  data: MenuItem[];
  groupLabel?: string;
  pathname: string;
  searchParams: Pick<URLSearchParams, "get">;
  isIconMode: boolean;
  isBranchOpen: (key: string) => boolean;
  setOpenItem: (key: string, open: boolean) => void;
}) {
  const { navigate } = usePanelNav();

  function isChildActive(item: MenuItem) {
    return (
      item.childItems?.some((subItem) =>
        isSubGroup(subItem)
          ? subItem.childItems.some((leaf) =>
              isLinkActive(leaf.href, leaf.activePath, pathname, searchParams),
            )
          : isLinkActive(subItem.href, subItem.activePath, pathname, searchParams),
      ) ?? false
    );
  }

  return (
    <SidebarGroup>
      {groupLabel ? (
        <SidebarGroupLabel className="text-sidebar-foreground/50 tracking-wider uppercase">
          {groupLabel}
        </SidebarGroupLabel>
      ) : null}
      <SidebarGroupContent>
        <SidebarMenuIndicator pathname={pathname}>
        <SidebarMenu>
          {data.map((item) => {
            const Tag = item.icon ? (Icon[item.icon] as ComponentType) : null;
            const childActive = isChildActive(item);

            if (item.childItems && isIconMode) {
              return (
                <SidebarFlyout
                  key={item.label}
                  item={item}
                  childItems={item.childItems}
                  isChildActive={childActive}
                  pathname={pathname}
                  searchParams={searchParams}
                />
              );
            }

            if (item.childItems) {
              return (
                <Collapsible
                  className="group/collapsible"
                  key={item.label}
                  open={isBranchOpen(item.label)}
                  onOpenChange={(open) => {
                    setOpenItem(item.label, open);
                    if (!open || childActive) return;
                    const href = firstLeafHref(item);
                    if (href) navigate(href);
                  }}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={childActive}
                          className={cn("relative z-10 data-active:bg-transparent!", tabHover)}
                        />
                      }
                    >
                      {Tag ? <Tag /> : null}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-all duration-200 data-ending-style:h-0 data-starting-style:h-0">
                      <SidebarMenuSub>
                        {item.childItems.map((subItem) =>
                          isSubGroup(subItem) ? (
                            <Collapsible
                              className="group/subcollapsible"
                              key={subItem.label}
                              open={isBranchOpen(subGroupKey(item.label, subItem.label))}
                              onOpenChange={(open) =>
                                setOpenItem(subGroupKey(item.label, subItem.label), open)
                              }
                            >
                              <SidebarMenuSubItem>
                                <CollapsibleTrigger
                                  nativeButton={false}
                                  render={
                                    <SidebarMenuSubButton
                                      className={cn(
                                        "relative z-10 justify-between data-active:bg-transparent!",
                                        tabHover,
                                      )}
                                      isActive={subItem.childItems.some((leaf) =>
                                        isLinkActive(leaf.href, leaf.activePath, pathname, searchParams),
                                      )}
                                    />
                                  }
                                >
                                  {subItem.label}
                                  <ChevronRightIcon className="ml-auto shrink-0 transition-transform duration-200 group-data-open/subcollapsible:rotate-90" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-all duration-200 data-ending-style:h-0 data-starting-style:h-0">
                                  <SidebarMenuSub className="mx-0">
                                    {subItem.childItems.map((leaf) => (
                                      <SidebarMenuSubItem
                                      key={leaf.label}
                                      data-nav-active={
                                        isLinkActive(leaf.href, leaf.activePath, pathname, searchParams)
                                          ? "true"
                                          : undefined
                                      }
                                    >
                                        <SidebarMenuSubButton
                                          className={cn(
                                            activeLeafClass,
                                            isLinkActive(leaf.href, leaf.activePath, pathname, searchParams) &&
                                              "text-white!",
                                          )}
                                          render={<PanelLink href={leaf.href} />}
                                          isActive={isLinkActive(
                                            leaf.href,
                                            leaf.activePath,
                                            pathname,
                                            searchParams,
                                          )}
                                        >
                                          <span className="min-w-0 flex-1 truncate">{leaf.label}</span>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuSubItem>
                            </Collapsible>
                          ) : (
                            <SidebarMenuSubItem
                              key={subItem.label}
                              data-nav-active={
                                isLinkActive(subItem.href, subItem.activePath, pathname, searchParams)
                                  ? "true"
                                  : undefined
                              }
                            >
                              <SidebarMenuSubButton
                                className={cn(
                                  activeLeafClass,
                                  isLinkActive(subItem.href, subItem.activePath, pathname, searchParams) &&
                                    "text-white!",
                                )}
                                render={<PanelLink href={subItem.href} />}
                                isActive={isLinkActive(
                                  subItem.href,
                                  subItem.activePath,
                                  pathname,
                                  searchParams,
                                )}
                              >
                                <span className="min-w-0 flex-1 truncate">{subItem.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ),
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem
                key={item.label}
                data-nav-active={pathname === item.href ? "true" : undefined}
              >
                <SidebarMenuButton
                  tooltip={item.label}
                  render={<PanelLink href={item.href} />}
                  isActive={pathname === item.href}
                  className={cn(activeLeafClass, pathname === item.href && "text-white!")}
                >
                  {Tag ? <Tag /> : null}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        </SidebarMenuIndicator>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
