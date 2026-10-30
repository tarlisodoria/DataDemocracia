import {
  ArrowRight,
  Filter,
  MapPin,
  Search as SearchIcon,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { politicians } from "@/data/demo";
import {
  Breadcrumbs,
  PageShell,
  SearchBox,
  SourcePill,
} from "@/components/datademocracia/ui";

export default function SearchPage() {
  const [location, navigate] = useLocation();
  const initial =
    new URLSearchParams(location.split("?")[1] ?? "").get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [activeTab, setActiveTab] = useState("Políticos");
  const [role, setRole] = useState("Todos os cargos");
  const [stateFilter, setStateFilter] = useState("Todos os estados");
  const [situation, setSituation] = useState("Todas as situações");
  const results = useMemo(
    () =>
      politicians.filter(
        p =>
          (!query ||
            `${p.name} ${p.role} ${p.party} ${p.city} ${p.state}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (role === "Todos os cargos" || p.role === role) &&
          (stateFilter === "Todos os estados" ||
            (stateFilter === "Minas Gerais" && p.state === "MG") ||
            (stateFilter === "Paraná" && p.state === "PR") ||
            (stateFilter === "Pernambuco" && p.state === "PE")) &&
          (situation === "Todas as situações" ||
            (situation === "Em exercício" && p.type === "mandato") ||
            (situation === "Candidato não eleito" && p.type === "candidatura"))
      ),
    [query, role, stateFilter, situation]
  );
  return (
    <PageShell
      eyebrow="Explorar"
      title="Encontre o que importa para você"
      description="Pesquise pessoas, candidaturas, promessas, temas e cidades. Depois, escolha o que acompanhar."
      actions={
        <Button variant="outline">
          <SlidersHorizontal size={16} /> Salvar busca
        </Button>
      }
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Explorar" }]}
      />
      <div className="search-page-top">
        <SearchBox
          compact
          defaultValue={query}
          onSubmit={value => setQuery(value)}
        />
        <div className="search-page-note">
          <Sparkles size={16} /> Experimente “saúde”, “senador” ou “Minas
          Gerais”.
        </div>
      </div>
      <div className="search-tabs">
        {["Políticos", "Promessas", "Proposições", "Temas", "Cidades"].map(
          tab => (
            <button
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
              key={tab}
            >
              {tab}
              <span>
                {tab === "Políticos"
                  ? 3
                  : tab === "Promessas"
                    ? 7
                    : tab === "Proposições"
                      ? 12
                      : tab === "Temas"
                        ? 18
                        : 27}
              </span>
            </button>
          )
        )}
      </div>
      <div className="search-layout">
        <aside className="filter-panel">
          <div className="filter-heading">
            <span>
              <Filter size={16} /> Filtros
            </span>
            <button
              onClick={() => {
                setRole("Todos os cargos");
                setStateFilter("Todos os estados");
                setSituation("Todas as situações");
              }}
            >
              Limpar
            </button>
          </div>
          <label>
            Cargo
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option>Todos os cargos</option>
              <option>Deputada Federal</option>
              <option>Senadora</option>
              <option>Prefeita</option>
              <option>Vereadora</option>
            </select>
          </label>
          <label>
            Estado
            <select
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
            >
              <option>Todos os estados</option>
              <option>Minas Gerais</option>
              <option>Paraná</option>
              <option>Pernambuco</option>
            </select>
          </label>
          <label>
            Situação
            <select
              value={situation}
              onChange={e => setSituation(e.target.value)}
            >
              <option>Todas as situações</option>
              <option>Em exercício</option>
              <option>Candidato não eleito</option>
              <option>Ex-mandatário</option>
            </select>
          </label>
          <div className="filter-divider" />
          <p className="filter-caption">Escopo da busca</p>
          <div className="check-row">
            <input type="checkbox" defaultChecked id="official" />
            <label htmlFor="official">Com fonte oficial</label>
          </div>
          <div className="check-row">
            <input type="checkbox" id="updated" />
            <label htmlFor="updated">Atualizado recentemente</label>
          </div>
          <div className="filter-tip">
            <ShieldIcon />
            <p>
              Dados demonstrativos para validação do protótipo. As fontes reais
              entram na próxima etapa.
            </p>
          </div>
        </aside>
        <section className="results-panel">
          <div className="results-header">
            <div>
              <span className="results-kicker">{activeTab}</span>
              <h2>{results.length} resultados encontrados</h2>
            </div>
            <button className="sort-button">
              <SlidersHorizontal size={15} /> Mais relevantes
            </button>
          </div>
          {activeTab !== "Políticos" ? (
            <div className="empty-search">
              <SearchIcon size={25} />
              <h3>Explore {activeTab.toLowerCase()}</h3>
              <p>
                Este recorte visual está preparado para receber registros
                oficiais e demonstrativos na próxima etapa.
              </p>
              <Link href="/metodologia" className="text-link">
                Ver como os dados entram <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="results-list">
              {results.map(politician => (
                <Link
                  href={`/politico/${politician.id}`}
                  className="result-row"
                  key={politician.id}
                >
                  <div
                    className="result-avatar"
                    style={{ backgroundImage: `url(${politician.portrait})` }}
                  />
                  <div className="result-info">
                    <div className="result-meta">
                      <Badge variant="outline">
                        {politician.type === "candidatura"
                          ? "Candidatura não eleita"
                          : "Em exercício"}
                      </Badge>
                      <span>
                        {politician.state} · {politician.city}
                      </span>
                    </div>
                    <h3>{politician.name}</h3>
                    <p>
                      {politician.role} · {politician.party} ·{" "}
                      {politician.period}
                    </p>
                    <SourcePill source="TSE · registro demonstrativo" />
                  </div>
                  <div className="result-side">
                    <span>
                      <strong>{politician.promises}</strong> promessas
                    </span>
                    <ArrowRight size={18} />
                  </div>
                </Link>
              ))}
              {results.length === 0 && (
                <div className="empty-search">
                  <SearchIcon size={25} />
                  <h3>Nenhum resultado neste recorte</h3>
                  <p>Tente uma grafia diferente ou remova algum filtro.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      navigate("/buscar");
                    }}
                  >
                    Limpar busca
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

function ShieldIcon() {
  return (
    <div className="filter-tip-icon">
      <UsersRound size={16} />
    </div>
  );
}
