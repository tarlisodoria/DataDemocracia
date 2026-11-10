import {
  ArrowRight,
  Filter,
  Search as SearchIcon,
  UsersRound,
} from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialsAvatar } from "@/data/demo";
import {
  buscarDeputados,
  carregarCadastros,
  carregarDeputados,
  paginaDeputado,
  type DeputadoResumo,
  type PerfilCadastro,
} from "@/lib/camara";
import {
  Breadcrumbs,
  PageShell,
  SearchBox,
  SourcePill,
} from "@/components/datademocracia/ui";

const TODOS = "";

export default function SearchPage() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(useSearch());
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [uf, setUf] = useState(params.get("uf") ?? TODOS);
  const [partido, setPartido] = useState(params.get("partido") ?? TODOS);
  const [camara, setCamara] = useState<{
    coleta: string;
    deputados: DeputadoResumo[];
  } | null>(null);
  const [cadastros, setCadastros] = useState<Record<string, PerfilCadastro>>(
    {}
  );
  const [erro, setErro] = useState(false);
  const [limite, setLimite] = useState(20);

  useEffect(() => {
    carregarDeputados()
      .then(setCamara)
      .then(() => carregarCadastros())
      .then(setCadastros)
      .catch(() => setErro(true));
  }, []);

  const opcoes = useMemo(() => {
    const lista = camara?.deputados ?? [];
    return {
      ufs: [...new Set(lista.map(d => d.uf))].sort(),
      partidos: [...new Set(lista.map(d => d.partido))].sort(),
    };
  }, [camara]);

  const deputados = useMemo(() => {
    if (!camara) return [];
    const base = query.trim()
      ? buscarDeputados(camara.deputados, query)
      : camara.deputados;
    return base.filter(
      d => (!uf || d.uf === uf) && (!partido || d.partido === partido)
    );
  }, [camara, query, uf, partido]);

  useEffect(() => setLimite(20), [query, uf, partido]);

  const limpar = () => {
    setQuery("");
    setUf(TODOS);
    setPartido(TODOS);
    navigate("/buscar");
  };

  return (
    <PageShell
      eyebrow="Políticos"
      title="Deputados federais"
      description="Os 551 deputados que registraram voto no Plenário em 2025. Busque por nome, partido ou estado e abra o perfil para ver participação, temas e divergências."
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Políticos" }]}
      />
      <div className="search-page-top">
        <SearchBox defaultValue={query} onSubmit={value => setQuery(value)} />
      </div>
      <div className="search-layout">
        <aside className="filter-panel">
          <div className="filter-heading">
            <span>
              <Filter size={16} /> Filtros
            </span>
            <button onClick={limpar}>Limpar</button>
          </div>
          <label>
            Estado
            <select value={uf} onChange={e => setUf(e.target.value)}>
              <option value={TODOS}>Todos os estados</option>
              {opcoes.ufs.map(u => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
          <label>
            Partido
            <select value={partido} onChange={e => setPartido(e.target.value)}>
              <option value={TODOS}>Todos os partidos</option>
              {opcoes.partidos.map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <div className="filter-tip">
            <div className="filter-tip-icon">
              <UsersRound size={16} />
            </div>
            <p>
              Partido e estado são os registrados no último voto de cada
              deputado em 2025. Senadores, governadores e prefeitos entram nas
              próximas etapas.
            </p>
          </div>
        </aside>
        <section className="results-panel">
          <div className="results-header">
            <div>
              <span className="results-kicker">Câmara dos Deputados</span>
              <h2>
                {camara
                  ? `${deputados.length} deputados encontrados`
                  : erro
                    ? "Dados indisponíveis"
                    : "Carregando…"}
              </h2>
            </div>
            {camara && (
              <SourcePill
                source={`API Dados Abertos · coleta ${camara.coleta}`}
              />
            )}
          </div>
          {erro && (
            <div className="empty-search">
              <SearchIcon size={25} />
              <h3>Não foi possível carregar a lista</h3>
              <p>
                Recarregue a página. Se continuar, os arquivos de dados podem
                estar fora do ar.
              </p>
            </div>
          )}
          {camara && deputados.length === 0 && (
            <div className="empty-search">
              <SearchIcon size={25} />
              <h3>Nenhum deputado neste recorte</h3>
              <p>Tente outra grafia ou remova algum filtro.</p>
              <Button variant="outline" onClick={limpar}>
                Limpar busca
              </Button>
            </div>
          )}
          <div className="results-list">
            {deputados.slice(0, limite).map(d => {
              const foto = cadastros[d.id]?.foto;
              const total = d.registrados + d.semRegistro;
              return (
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
                        foto && `url("${foto}")`,
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
                      Deputado(a) federal · {d.partido}-{d.uf} · {d.registrados}{" "}
                      votos registrados em {total} votações
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
              );
            })}
          </div>
          {deputados.length > limite && (
            <Button
              variant="outline"
              className="real-deputies-more"
              onClick={() => setLimite(n => n + 30)}
            >
              Mostrar mais ({deputados.length - limite} restantes)
            </Button>
          )}
        </section>
      </div>
    </PageShell>
  );
}
