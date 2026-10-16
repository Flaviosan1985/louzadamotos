import type { MenuGroupSubItem, MenuSubItem, NavItem } from "@/configs/navConfig";

export const isSubGroup = (item: MenuSubItem): item is MenuGroupSubItem =>
  "childItems" in item;

export const emptySearchParams: Pick<URLSearchParams, "get"> = {
  get: () => null,
};

export function isLinkActive(
  href: string,
  activePath: string | undefined,
  pathname: string,
  searchParams: Pick<URLSearchParams, "get"> = emptySearchParams,
) {
  if (activePath) {
    return pathname.startsWith(activePath);
  }

  if (href.includes("?")) {
    const [hrefPath, hrefQuery] = href.split("?");
    if (pathname !== hrefPath) return false;
    const hrefParams = new URLSearchParams(hrefQuery);
    for (const [key, value] of hrefParams.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  }

  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function subGroupKey(itemLabel: string, subItemLabel: string) {
  return `${itemLabel}::${subItemLabel}`;
}

export function getActiveBranchKeys(
  groups: NavItem[],
  pathname: string,
  searchParams: Pick<URLSearchParams, "get">,
) {
  const keys = new Set<string>();

  groups.forEach((group) => {
    group.items.forEach((item) => {
      item.childItems?.forEach((subItem) => {
        if (isSubGroup(subItem)) {
          if (
            subItem.childItems.some((leaf) =>
              isLinkActive(leaf.href, leaf.activePath, pathname, searchParams),
            )
          ) {
            keys.add(item.label);
            keys.add(subGroupKey(item.label, subItem.label));
          }
        } else if (isLinkActive(subItem.href, subItem.activePath, pathname, searchParams)) {
          keys.add(item.label);
        }
      });
    });
  });

  return keys;
}
