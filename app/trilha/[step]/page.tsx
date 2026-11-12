import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { journey } from "@/lib/journey";

export function generateStaticParams() {
  return journey.map((step) => ({ step: String(step.number) }));
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const active = journey.find((item) => String(item.number) === step);
  if (!active) notFound();
  const Icon = active.icon;
  return (
    <div className="reading-column">
      <Link href="/" className="text-link">
        <ArrowLeft size={15} aria-hidden="true" /> Visão geral
      </Link>
      <div className="step-page-heading">
        <span className="step-hero-icon">
          <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="eyebrow">
          ETAPA {String(active.number).padStart(2, "0")} DE 07
        </p>
        <h1>
          {active.name}
          <span className="text-primary">.</span>
        </h1>
        <p className="step-question">{active.question}</p>
      </div>
      <section className="concept-panel">
        <h2>Como isso funciona?</h2>
        <p>{active.description}</p>
        <div className="expected-output">
          <Check size={18} aria-hidden="true" />
          <div>
            <strong>O que você leva desta etapa</strong>
            <p>{active.output}</p>
          </div>
        </div>
      </section>
      <div className="setup-notice">
        <LockKeyhole size={20} aria-hidden="true" />
        <div>
          <h2>Conheça a trilha enquanto preparamos seu espaço.</h2>
          <p>
            Esta é uma apresentação das etapas. A edição e o salvamento de
            projetos serão liberados após a configuração do acesso por convite.
          </p>
          <Link className="text-link" href="/login">
            Ver acesso <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <nav aria-label="Navegação entre etapas" className="step-pagination">
        <Button variant="outline" asChild>
          <Link
            href={active.number === 1 ? "/" : `/trilha/${active.number - 1}`}
          >
            <ArrowLeft aria-hidden="true" />
            {active.number === 1 ? "Visão geral" : "Etapa anterior"}
          </Link>
        </Button>
        <Button asChild>
          <Link
            href={active.number === 7 ? "/" : `/trilha/${active.number + 1}`}
          >
            {active.number === 7 ? "Voltar ao início" : "Próxima etapa"}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </nav>
    </div>
  );
}
