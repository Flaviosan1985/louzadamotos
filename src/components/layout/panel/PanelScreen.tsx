"use client";

import { Fragment } from "react";
import { normalizePanelPath } from "@/lib/panel/paths";
import { renderPanelView } from "@/lib/panel/views";
import { usePanelNav } from "@/components/layout/panel/PanelNavProvider";

export function PanelScreen() {
  const { pathname } = usePanelNav();
  const path = normalizePanelPath(pathname);
  return <Fragment key={path}>{renderPanelView(pathname)}</Fragment>;
}
