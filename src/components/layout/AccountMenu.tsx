"use client";

import { useRouter } from "next/navigation";
import { BookOpen, CircleHelp, Info, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { PanelLink } from "@/components/layout/panel/PanelLink";
import { DemoPapelSwitch } from "@/components/layout/DemoPapelSwitch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initialsFrom(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AccountMenu() {
  const router = useRouter();
  const { data } = useAppSnapshot();
  const nome = data?.profile.nome ?? "Conta";
  const papel = data?.profile.papel ?? "";
  const iniciais = data ? initialsFrom(data.profile.nome) : "AD";

  async function handleLogout() {
    try {
      await fetch("/api/demo/logout", { method: "POST" });
      if (getSupabaseEnv().isConfigured) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Não foi possível sair.");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="relative rounded-full hover:bg-transparent" />}
      >
        <Avatar>
          <AvatarFallback>{iniciais}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <span className="text-foreground text-sm font-semibold">{nome}</span>
            {papel ? (
              <span className="text-muted-foreground mt-0.5 block text-xs capitalize">{papel}</span>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DemoPapelSwitch />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<PanelLink href="/conta" />}>
            <User />
            <span>Conta</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<PanelLink href="/sistema/sobre" />}>
            <Info />
            <span>Sobre</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<PanelLink href="/suporte" />}>
            <CircleHelp />
            <span>Suporte</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<PanelLink href="/configuracoes/tutorial" />}>
            <BookOpen />
            <span>Tutorial</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
