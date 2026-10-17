"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminAside } from "@/components/louzada/admin/AdminAside";
import { AdminOverviewCard } from "@/components/louzada/admin/AdminOverviewCard";
import { AdminPageHeader } from "@/components/louzada/admin/AdminPageHeader";
import { AdminPhotosTab } from "@/components/louzada/admin/AdminPhotosTab";
import { AdminRegisterTab } from "@/components/louzada/admin/AdminRegisterTab";
import { AdminShell } from "@/components/louzada/admin/AdminShell";
import { AdminSidebar } from "@/components/louzada/admin/AdminSidebar";
import { AdminSoldTab } from "@/components/louzada/admin/AdminSoldTab";
import { AdminLeadsTab } from "@/components/louzada/admin/AdminLeadsTab";
import { AdminVehiclesTab } from "@/components/louzada/admin/AdminVehiclesTab";
import type { AdminTabId } from "@/components/louzada/admin/types";
import { adminCardClass } from "@/lib/louzada/admin-theme";

function AdminTabPanel({ active }: { active: AdminTabId }) {
  switch (active) {
    case "vehicles":
      return <AdminVehiclesTab />;
    case "register":
      return <AdminRegisterTab />;
    case "photos":
      return <AdminPhotosTab />;
    case "sold":
      return <AdminSoldTab />;
    case "leads":
      return <AdminLeadsTab />;
    default:
      return null;
  }
}

export function AdminPanel() {
  const router = useRouter();
  const [active, setActive] = useState<AdminTabId>("vehicles");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/painel/login");
    router.refresh();
  }

  return (
    <AdminShell
      sidebar={<AdminSidebar active={active} onTabChange={setActive} />}
      aside={<AdminAside onLogout={() => void logout()} />}
    >
      <AdminPageHeader active={active} onLogout={() => void logout()} />

      <div className="mb-6 space-y-6">
        <AdminOverviewCard />

        <section
          key={active}
          className={`${adminCardClass} animate-in fade-in slide-in-from-bottom-2 p-6 duration-300`}
        >
          <AdminTabPanel active={active} />
        </section>
      </div>
    </AdminShell>
  );
}
