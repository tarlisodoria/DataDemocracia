import {
  ArrowRight,
  CalendarDays,
  Filter,
  Flag,
  Info,
  Search,
} from "lucide-react";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { allPromises } from "@/data/demo";
import {
  Breadcrumbs,
  PageShell,
  ProgressBar,
  SectionHeading,
  SourcePill,
  StatusBadge,
} from "@/components/datademocracia/ui";

const statusFilters = [
  "Todas",
  "Em andamento",
  "Cumprida",
  "Prazo crítico",
  "Sem evidência suficiente",
  "Fora da competência direta",
];

export default function Promises() {
  const [status, setStatus] = useState("Todas");
  const [theme, setTheme] = useState("Todos os temas");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      allPromises.filter(
        promise =>
          (status === "Todas" || promise.status === status) &&
          (theme === "Todos os temas" || promise.theme === theme) &&
          promise.title.toLowerCase().includes(query.toLowerCase())
      ),
    [status, theme, query]
  );
  const counts = {
    total: allPromises.length,
    progress: allPromises.filter(p => p.status === "Em andamento").length,
    done: allPromises.filter(p => p.status === "Cumprida").length,
    critical: allPromises.filter(p => p.status === "Prazo crítico").length,
  };
  return (
    <PageShell
      eyebrow="Monitoramento"
      title="Promessas e compromissos"
      description="Acompanhe o que foi declarado, o que está documentado e o que ainda não tem evidência suficiente."
      actions={
        <Button>
          <Flag size={16} /> Acompanhar tema
        </Button>
      }
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Promessas" }]}
      />
      <section className="promise-overview">
        <div className="promise-overview-copy">
          <span className="eyebrow">Todos os perfis demonstrativos</span>
          <h2>Uma promessa é mais que uma frase.</h2>
          <p>
            Ela precisa de texto original, prazo, competência, indicador e
            evidências para ser acompanhada com responsabilidade.
          </p>
        </div>
        <div className="promise-count-grid">
          <div>
            <strong>{counts.total}</strong>
            <span>compromissos</span>
          </div>
          <div>
            <strong>{counts.progress}</strong>
            <span>em andamento</span>
          </div>
          <div>
            <strong>{counts.done}</strong>
            <span>cumpridos</span>
          </div>
          <div>
            <strong>{counts.critical}</strong>
            <span>prazo crítico</span>
          </div>
        </div>
      </section>
      <div className="promise-toolbar">
        <div className="status-filter-row">
          {statusFilters.map(filter => (
            <button
              className={status === filter ? "active" : ""}
              onClick={() => setStatus(filter)}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="promise-filter-controls">
          <label className="inline-search">
            <Search size={15} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar promessa"
            />
          </label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option>Todos os temas</option>
            <option>Saúde</option>
            <option>Educação</option>
            <option>Transparência</option>
            <option>Mobilidade</option>
            <option>Zeladoria</option>
          </select>
          <Button variant="outline" size="icon" aria-label="Mais filtros">
            <Filter size={16} />
          </Button>
        </div>
      </div>
      <div className="promise-list-page">
        <SectionHeading
          title={`${filtered.length} compromissos no recorte`}
          description="Clique em um item para abrir o registro completo e suas evidências."
        />
        <div className="promise-list-grid">
          {filtered.map(promise => (
            <Link
              href={`/promessa/${promise.id}`}
              className="promise-card-large"
              key={promise.id}
            >
              <div className="promise-card-large-top">
                <span className="promise-theme">{promise.theme}</span>
                <StatusBadge status={promise.status} />
              </div>
              <h3>{promise.title}</h3>
              <div className="promise-owner">
                <span>Monitorado em</span>
                <strong>{promise.politician}</strong>
              </div>
              <div className="promise-progress-row">
                <ProgressBar
                  value={promise.progress}
                  tone={
                    promise.status === "Prazo crítico"
                      ? "amber"
                      : promise.status === "Sem evidência suficiente"
                        ? "blue"
                        : "teal"
                  }
                />
                <span>{promise.progress}%</span>
              </div>
              <div className="promise-card-details">
                <span>
                  <CalendarDays size={13} /> {promise.deadline}
                </span>
                <span>
                  <Info size={13} /> {promise.competence}
                </span>
              </div>
              <div className="promise-card-bottom">
                <SourcePill source={promise.evidence} date={promise.updated} />
                <ArrowRight size={17} />
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-search">
            <Flag size={25} />
            <h3>Nenhuma promessa neste recorte</h3>
            <p>Experimente remover um filtro ou buscar por outro tema.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
