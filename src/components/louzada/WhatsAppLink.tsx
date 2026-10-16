"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type WhatsAppLinkProps = {
  href: string | null;
  label?: string;
  className?: string;
  disabled?: boolean;
  disabledLabel?: string;
};

export function WhatsAppLink({
  href,
  label = "WhatsApp",
  className,
  disabled,
  disabledLabel = "Veículo vendido",
}: WhatsAppLinkProps) {
  if (disabled || !href) {
    return (
      <span
        className={cn(
          "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-300",
          className,
        )}
      >
        {disabledLabel}
      </span>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[#c41e3a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a01830]",
        className,
      )}
    >
      <MessageCircle className="size-4" aria-hidden />
      {label}
    </Link>
  );
}
