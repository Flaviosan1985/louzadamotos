"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type IndicatorBox = {
  top: number;
  left: number;
  width: number;
  height: number;
  visible: boolean;
};

const hiddenBox: IndicatorBox = { top: 0, left: 0, width: 0, height: 0, visible: false };

export function SidebarMenuIndicator({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<IndicatorBox>(hiddenBox);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const active = root.querySelector<HTMLElement>("[data-nav-active='true']");
      if (!active) {
        setBox((current) => (current.visible ? hiddenBox : current));
        return;
      }
      const rootRect = root.getBoundingClientRect();
      const rect = active.getBoundingClientRect();
      const next = {
        top: rect.top - rootRect.top,
        left: rect.left - rootRect.left,
        width: rect.width,
        height: rect.height,
        visible: true,
      };
      setBox((current) =>
        current.visible === next.visible &&
        current.top === next.top &&
        current.left === next.left &&
        current.width === next.width &&
        current.height === next.height
          ? current
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div ref={rootRef} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute z-0 rounded-xl bg-[#E10600] transition-[transform,width,height,opacity] duration-300 ease-out"
        style={{
          width: box.width,
          height: box.height,
          opacity: box.visible ? 1 : 0,
          transform: `translate(${box.left}px, ${box.top}px)`,
        }}
      />
      {children}
    </div>
  );
}
