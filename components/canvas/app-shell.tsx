"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Compass,
  LockKeyhole,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { journey } from "@/lib/journey";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = journey.find((step) => pathname === `/trilha/${step.number}`);
  return (
    <div className="app-shell">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand-link" aria-label="Sonda — início">
          <Brand />
        </Link>
        <div className="sidebar-context">
          <span className="eyebrow">Seu próximo passo</span>
          <p>
            Boas perguntas.
            <br />
            Decisões melhores.
          </p>
        </div>
        <Link
          href="/"
          className={cn("overview-link", pathname === "/" && "is-active")}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Compass size={18} aria-hidden="true" />
          Visão geral
        </Link>
        <div className="nav-label">
          TRILHA DE ANÁLISE <span>07</span>
        </div>
        <nav
          aria-label="Etapas da análise"
          onKeyDown={(event) => {
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
              return;
            const links = Array.from(
              event.currentTarget.querySelectorAll<HTMLAnchorElement>("a"),
            );
            const index = links.indexOf(
              document.activeElement as HTMLAnchorElement,
            );
            if (index < 0) return;
            event.preventDefault();
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? links.length - 1
                  : (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      links.length) %
                    links.length;
            links[next].focus();
          }}
        >
          {journey.map(({ number, name, icon: Icon }) => (
            <Link
              key={number}
              href={`/trilha/${number}`}
              aria-current={current?.number === number ? "page" : undefined}
              className={cn(
                "step-link",
                current?.number === number && "is-active",
              )}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{name}</span>
              <span className="step-number">
                {String(number).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="well-mark">
            <ArrowDownLeft size={20} aria-hidden="true" />
          </div>
          <div>
            <strong>Do Fundo do Poço</strong>
            <span>O caminho é para cima.</span>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="desktop-breadcrumb">
            Seu espaço <span>/</span>{" "}
            <strong>
              {current
                ? `Trilha · ${current.name}`
                : pathname === "/login"
                  ? "Acesso"
                  : "Visão geral"}
            </strong>
          </div>
          <Link href="/" className="mobile-brand" aria-label="Sonda — início">
            <Brand />
          </Link>
          <div className="header-actions">
            <span className="private-badge">
              <LockKeyhole size={13} aria-hidden="true" /> Espaço privado
            </span>
            <ThemeToggle />
            <Link href="/workspaces" className="login-link">
              Meu espaço <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </header>
        <div className="mobile-nav">
          <label htmlFor="mobile-journey">Explorar a trilha</label>
          <div>
            <select
              id="mobile-journey"
              aria-label="Etapas da análise"
              value={current?.number ?? ""}
              onChange={(event) => {
                window.location.assign(
                  event.target.value ? `/trilha/${event.target.value}` : "/",
                );
              }}
            >
              <option value="">Visão geral</option>
              {journey.map((step) => (
                <option value={step.number} key={step.number}>
                  {step.number}. {step.name}
                </option>
              ))}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </div>
        </div>
        <main id="conteudo" className="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="page-footer">
          <span>
            SONDA <span className="footer-dot">·</span> DA HIPÓTESE À EVIDÊNCIA
          </span>
          <span>
            Feito para tirar ideias do fundo do poço{" "}
            <ArrowUpRight size={13} aria-hidden="true" />
          </span>
        </footer>
      </div>
    </div>
  );
}
