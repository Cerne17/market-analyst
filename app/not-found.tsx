import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="feedback-state">
      <Compass size={36} aria-hidden="true" />
      <p className="eyebrow">CAMINHO NÃO ENCONTRADO</p>
      <h1>Esta página ficou fora da trilha.</h1>
      <p>Volte ao início para encontrar seu próximo passo.</p>
      <Button asChild>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </section>
  );
}
