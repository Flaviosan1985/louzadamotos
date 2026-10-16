import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export function AvisoLegal({ texto, className }: { texto: string; className?: string }) {
  return (
    <Alert role="note" className={cn("print:border-0 print:p-0", className)}>
      <Info aria-hidden />
      <AlertDescription>{texto}</AlertDescription>
    </Alert>
  );
}
