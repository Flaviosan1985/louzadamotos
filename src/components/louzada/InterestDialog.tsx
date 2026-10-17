"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { registrarInteresseSite } from "@/lib/negocio/registrar-interesse";
import { WaIcon } from "@/components/louzada/WaIcon";

type InterestDialogProps = {
  vehicleId: string | number;
  brand: string;
  model: string;
  year: number;
  displacement?: number | null;
  triggerClassName?: string;
};

export function InterestDialog({
  vehicleId,
  brand,
  model,
  year,
  displacement,
  triggerClassName,
}: InterestDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { wa } = await registrarInteresseSite({
        veiculoId: String(vehicleId),
        brand,
        model,
        year,
        displacement,
        nome: name,
        telefone: phone,
        proposta: proposal,
      });
      setOpen(false);
      setName("");
      setPhone("");
      setProposal("");
      if (wa) {
        window.open(wa, "_blank", "noopener,noreferrer");
      } else {
        toast.success("Interesse registrado. A loja entra em contato pelo telefone informado.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível registrar o interesse.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] font-bold text-white hover:bg-[#1db954]",
          triggerClassName,
        )}
      >
        <WaIcon className="h-4 w-4 shrink-0" />
        Tenho interesse
      </DialogTrigger>
      <DialogContent className="border-[#2a2a2a] bg-[#141414] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-black uppercase italic">
            Tenho interesse
          </DialogTitle>
          <DialogDescription className="text-[#888]">
            {brand} {model} ({year})
            {displacement ? ` · ${displacement} cc` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void onSubmit(e)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="interest-name" className="text-[#ccc]">
              Seu nome
            </Label>
            <Input
              id="interest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-[#2a2a2a] bg-[#1a1a1a] text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interest-phone" className="text-[#ccc]">
              WhatsApp / telefone
            </Label>
            <Input
              id="interest-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="(11) 99999-9999"
              required
              className="border-[#2a2a2a] bg-[#1a1a1a] text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interest-proposal" className="text-[#ccc]">
              Proposta ou mensagem
            </Label>
            <Textarea
              id="interest-proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              rows={3}
              placeholder="Valor de entrada, troca, dúvidas…"
              className="border-[#2a2a2a] bg-[#1a1a1a] text-white"
            />
          </div>
          {error ? <p className="text-sm text-[#c41e3a]">{error}</p> : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose>
              <Button type="button" variant="outline" className="border-[#2a2a2a] bg-transparent text-[#ccc]">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-[#25D366] font-bold text-white hover:bg-[#1db954]"
            >
              <WaIcon className="h-4 w-4" />
              {loading ? "Enviando…" : "Continuar no WhatsApp"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
