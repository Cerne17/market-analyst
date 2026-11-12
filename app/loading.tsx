export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="loading-state">
      <span className="eyebrow">CARREGANDO SEU ESPAÇO</span>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-panel" />
      <span className="sr-only">Carregando conteúdo…</span>
    </div>
  );
}
