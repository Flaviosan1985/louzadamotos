"use client";

import { type AnchorHTMLAttributes, type MouseEvent, forwardRef } from "react";
import { isPanelPath } from "@/lib/panel/paths";
import { usePanelNav } from "@/components/layout/panel/PanelNavProvider";

export const PanelLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  function PanelLink({ href, onClick, ...props }, ref) {
    const { navigate } = usePanelNav();

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (event.currentTarget.target === "_blank") return;
      if (!href || href.startsWith("//")) return;
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (!isPanelPath(url.pathname)) return;
      } catch {
        return;
      }
      event.preventDefault();
      navigate(href);
    }

    return <a ref={ref} href={href} onClick={handleClick} {...props} />;
  },
);
