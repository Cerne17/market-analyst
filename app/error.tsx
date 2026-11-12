"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="feedback-state" role="alert">
      <CircleAlert size={36} aria-hidden="true" />
      <h1>Não foi possível abrir esta página.</h1>
      <p>
        Tente novamente. Se o problema continuar, volte em alguns instantes.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </section>
  );
}
