import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  FileStack,
  Layers3,
  LockKeyhole,
  Route,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { journey } from "@/lib/journey";

export default function HomePage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">MENOS ACHISMO. MAIS DIREÇÃO.</p>
          <h1>
            Da ideia à evidência<span className="text-primary">.</span>
          </h1>
          <p className="page-description">
            Um caminho claro para entender o mercado antes de construir.
          </p>
        </div>
        <span className="phase-tag">
          <span /> Fundação
        </span>
      </div>
      <section className="welcome-panel" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <span className="panel-kicker">
            <Compass size={15} aria-hidden="true" /> SEU PONTO DE PARTIDA
          </span>
          <h2 id="welcome-title">
            A próxima boa decisão
            <br />
            começa com uma pergunta.
          </h2>
          <p>
            Investigue a dor, encontre seu cliente e coloque as premissas à
            prova. Uma etapa de cada vez, com a origem de cada número à vista.
          </p>
          <Button asChild>
            <Link href="/trilha/1">
              Conhecer a trilha <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="journey-art" aria-hidden="true">
          <span className="orbit orbit-outer" />
          <span className="orbit orbit-middle" />
          <span className="orbit orbit-inner" />
          <div className="art-center">
            <ArrowUpRight size={56} strokeWidth={1.5} />
          </div>
          <span className="art-tag art-tag-top">
            <span /> Evidência
          </span>
          <span className="art-tag art-tag-bottom">
            Hipótese <ArrowUpRight size={13} />
          </span>
          <span className="orbit-point" />
        </div>
      </section>
      <section className="modes-grid" aria-label="Modos de análise">
        <div className="mode-card">
          <span className="mode-icon">
            <Sparkles size={19} aria-hidden="true" />
          </span>
          <div>
            <h2>
              Sprint <span>PARA O PITCH</span>
            </h2>
            <p>
              Da hipótese aos slides. Foco no que precisa ser validado para o
              próximo hackathon.
            </p>
          </div>
        </div>
        <div className="mode-card">
          <span className="mode-icon">
            <Layers3 size={19} aria-hidden="true" />
          </span>
          <div>
            <h2>
              Venture <span>PARA CONSTRUIR</span>
            </h2>
            <p>
              Mais profundidade, entrevistas e acompanhamento para projetos que
              vão para o mercado.
            </p>
          </div>
        </div>
      </section>
      <div className="workspace-grid">
        <section className="projects-panel" aria-labelledby="projects-title">
          <div className="section-title">
            <h2 id="projects-title">Seu espaço de projetos</h2>
            <span className="subtle-label">ACESSO POR CONVITE</span>
          </div>
          <div className="empty-projects">
            <span className="empty-icon">
              <FileStack size={28} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <h3>O primeiro projeto começa aqui.</h3>
            <p>
              Depois de entrar, seus projetos e os do time
              <br className="desktop-break" /> ficam organizados por workspace.
            </p>
            <Button variant="outline" asChild>
              <Link href="/login">
                <LockKeyhole aria-hidden="true" /> Ver acesso ao espaço
              </Link>
            </Button>
            <span className="empty-note">
              O acesso está em preparação. Nenhum projeto foi criado.
            </span>
          </div>
        </section>
        <section
          className="principles-panel"
          aria-labelledby="principles-title"
        >
          <div className="section-title">
            <h2 id="principles-title">Como vamos trabalhar</h2>
            <Route size={18} aria-hidden="true" />
          </div>
          <div className="principle">
            <span>01</span>
            <div>
              <h3>Perguntas antes de respostas</h3>
              <p>
                Sete etapas, na ordem em que uma decisão sustenta a próxima.
              </p>
            </div>
          </div>
          <div className="principle">
            <span>02</span>
            <div>
              <h3>Todo número tem uma origem</h3>
              <p>
                Premissas manuais, bases públicas e fontes da web, sempre
                visíveis.
              </p>
            </div>
          </div>
          <div className="principle">
            <span>03</span>
            <div>
              <h3>Você decide o que fica</h3>
              <p>
                O copiloto sugere e critica. Cada alteração depende do seu
                aceite.
              </p>
            </div>
          </div>
          <div className="principles-footnote">
            <Check size={15} aria-hidden="true" /> Evidência vale mais que uma
            boa história.
          </div>
        </section>
      </div>
      <section className="journey-overview" aria-labelledby="journey-title">
        <div className="section-title">
          <div>
            <p className="eyebrow">DO PROBLEMA AO PRÓXIMO PASSO</p>
            <h2 id="journey-title">Uma trilha. Sete perguntas.</h2>
          </div>
          <Link href="/trilha/1" className="text-link">
            Explorar <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="journey-cards">
          {journey.map(({ number, name, icon: Icon }) => (
            <Link
              href={`/trilha/${number}`}
              key={number}
              className="journey-card"
            >
              <span className="journey-index">
                {String(number).padStart(2, "0")}
              </span>
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              <h3>{name}</h3>
              <ArrowUpRight
                size={14}
                className="card-arrow"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
