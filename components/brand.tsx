import { ArrowUp } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-full border-2 border-current text-primary">
        <ArrowUp size={21} strokeWidth={2.5} aria-hidden="true" />
      </span>
      {!compact && (
        <span className="font-heading text-xl font-bold tracking-tight">
          sonda<span className="text-primary">.</span>
        </span>
      )}
    </span>
  );
}
