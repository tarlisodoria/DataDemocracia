import {
  ArrowRight,
  Filter,
  MapPin,
  Search as SearchIcon,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialsAvatar, politicians } from "@/data/demo";
import {
  buscarDeputados,
  carregarCadastros,
  carregarDeputados,
  type PerfilCadastro,
  paginaDeputado,
  type DeputadoResumo,
} from "@/lib/camara";
import {
  dataSourceLabel,
  fetchPublicPoliticians,
  isNeonConfigured,
  mergePublicPoliticians,
} from "@/lib/neon";
import {
  Breadcrumbs,
  PageShell,
  SearchBox,
  SourcePill,
} from "@/components/datademocracia/ui";

export default function SearchPage() {
  const [, navigate] = useLocation();
  const initial = new URLSearchParams(useSearch()).get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [activeTab, setActiveTab] = useState("Políticos");
  const [role, setRole] = useState("Todos os cargos");
  const [stateFilter, setStateFilter] = useState("Todos os estados");
  const [situation, setSituation] = useState("Todas as situações");
  const [directory, setDirectory] = useState(politicians);
  const [usingLiveDirectory, setUsingLiveDirectory] = useState(false);
  const [cadastros, setCadastros] = useState<Record<string, PerfilCadastro>>(
    {}
  );
  const [camara, setCamara] = useState<{
    coleta: string;
    deputados: DeputadoResumo[];
  } | null>(null);

  useEffect(() => {
    carregarDeputados()
      .then(setCamara)
      .then(() => carregarCadastros())
      .then(setCadastros)
      .catch(() => {
        // Sem o arquivo do painel, a busca segue só com o catálogo.
      });
  }, []);

  // Sem termo de busca, lista todos os deputados em ordem alfabética.
  const deputados = useMemo(
    () =>
      !camara
        ? []
        : query.trim()
          ? buscarDeputados(camara.deputados, query)
          : camara.deputados,
    [camara, query]
  );
  const [limite, setLimite] = useState(20);
  useEffect(() => setLimite(20), [query]);

  useEffect(() => {
    if (!isNeonConfigured) return;

    let active = true;
    fetchPublicPoliticians()
      .then(records => {
        if (!active || records.length === 0) return;
        setDirectory(mergePublicPoliticians(records));
        setUsingLiveDirectory(true);
      })
      .catch(() => {
        // Keep search usable with the local catalog during a temporary API failure.
      });

    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(
    () =>
      directory.filter(
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
    [directory, query, role, stateFilter, situation]
  );
  return (
    <PageShell
      eyebrow="Explorar"
      title="Encontre o que importa para você"
      description="Pesquise pessoas, candidaturas, promessas, temas e cidades. Depois, escolha o que acompanhar."
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
              {tab === "Políticos" && (
                <span>
                  {directory.length + (camara?.deputados.length ?? 0)}
                </span>
              )}
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
              {usingLiveDirectory
                ? `Catálogo público conectado ao Neon. ${dataSourceLabel}.`
                : "Dados demonstrativos para validação do protótipo. As fontes reais entram na próxima etapa."}
            </p>
          </div>
        </aside>
        <section className="results-panel">
          <div className="results-header">
            <div>
              <span className="results-kicker">{activeTab}</span>
              <h2>
                {results.length + deputados.length} resultados encontrados
              </h2>
            </div>
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
                    <SourcePill
                      source={
                        usingLiveDirectory
                          ? dataSourceLabel
                          : "TSE · registro demonstrativo"
                      }
                    />
                  </div>
                  <div className="result-side">
                    <span>
                      <strong>{politician.promises}</strong> promessas
                    </span>
                    <ArrowRight size={18} />
                  </div>
                </Link>
              ))}
              {deputados.length > 0 && camara && (
                <div className="real-deputies">
                  <div className="real-deputies-head">
                    <h3>Deputados federais com votos reais em 2025</h3>
                    <SourcePill
                      source={`Câmara dos Deputados · coleta ${camara.coleta}`}
                    />
                  </div>
                  {deputados.slice(0, limite).map(d => (
                    <Link
                      href={paginaDeputado(d.id)}
                      className="result-row"
                      key={d.id}
                    >
                      <div
                        className="result-avatar"
                        style={{
                          // A foto oficial cobre as iniciais; se não carregar, as iniciais aparecem.
                          backgroundImage: [
                            cadastros[d.id]?.foto &&
                              `url("${cadastros[d.id]!.foto}")`,
                            `url("${initialsAvatar(d.nome)}")`,
                          ]
                            .filter(Boolean)
                            .join(", "),
                        }}
                      />
                      <div className="result-info">
                        <div className="result-meta">
                          <Badge variant="outline">Dados oficiais</Badge>
                          <span>{d.uf}</span>
                        </div>
                        <h3>{d.nome}</h3>
                        <p>
                          Deputado(a) federal · {d.partido}-{d.uf} ·{" "}
                          {d.registrados} votos registrados em{" "}
                          {d.registrados + d.semRegistro} votações
                        </p>
                      </div>
                      <div className="result-side">
                        <span>
                          <strong>
                            {d.registrados
                              ? Math.round((100 * d.sim) / d.registrados)
                              : "—"}
                            %
                          </strong>{" "}
                          de votos Sim
                        </span>
                        <ArrowRight size={18} />
                      </div>
                    </Link>
                  ))}
                  {deputados.length > limite && (
                    <Button
                      variant="outline"
                      className="real-deputies-more"
                      onClick={() => setLimite(n => n + 30)}
                    >
                      Mostrar mais ({deputados.length - limite} restantes)
                    </Button>
                  )}
                </div>
              )}
              {results.length === 0 && deputados.length === 0 && (
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
