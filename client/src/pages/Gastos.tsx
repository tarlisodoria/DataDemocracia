import { ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  carregarCota,
  carregarVotacoes,
  panoramaCota,
  paginaDeputado,
  type CotaArquivo,
  type GrupoCota,
} from "@/lib/camara";
import {
  Breadcrumbs,
  PageShell,
  SectionHeading,
  SourcePill,
} from "@/components/datademocracia/ui";

const real = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
// Valores grandes abreviados: "R$ 2,6 milhões", "R$ 840 mil".
const milhoes = (v: number) =>
  v >= 1e6
    ? `R$ ${(v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} milhões`
    : v >= 1e3
      ? `R$ ${Math.round(v / 1e3).toLocaleString("pt-BR")} mil`
      : real(v);

type Estado =
  | { fase: "carregando" }
  | { fase: "sem-dados" }
  | {
      fase: "pronto";
      cota: CotaArquivo;
      panorama: ReturnType<typeof panoramaCota>;
    };

type Ordem = "mediaMensal" | "total" | "nome";

function Grupos({
  grupos,
  destaque,
}: {
  grupos: GrupoCota[];
  destaque: string;
}) {
  const maior = Math.max(...grupos.map(g => g.mediana), 1);
  return (
    <div className="dep-bars gastos-grupos">
      {grupos.map(g => (
        <div
          className={`dep-bar cota-bar${g.nome === destaque ? " ativo" : ""}`}
          key={g.nome}
        >
          <span>
            {g.nome} <small>{g.deputados}</small>
          </span>
          <div>
            <i style={{ width: `${(100 * g.mediana) / maior}%` }} />
          </div>
          <strong>{real(g.mediana)}</strong>
        </div>
      ))}
    </div>
  );
}

export default function Gastos() {
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });
  const [uf, setUf] = useState("");
  const [partido, setPartido] = useState("");
  const [ordem, setOrdem] = useState<Ordem>("mediaMensal");
  const [limite, setLimite] = useState(25);

  useEffect(() => {
    Promise.all([carregarVotacoes(), carregarCota()])
      .then(([dados, cota]) =>
        setEstado(
          cota
            ? { fase: "pronto", cota, panorama: panoramaCota(cota, dados) }
            : { fase: "sem-dados" }
        )
      )
      .catch(() => setEstado({ fase: "sem-dados" }));
  }, []);

  const linhas = useMemo(() => {
    if (estado.fase !== "pronto") return [];
    return estado.panorama.linhas
      .filter(l => (!uf || l.uf === uf) && (!partido || l.partido === partido))
      .sort((a, b) =>
        ordem === "nome"
          ? a.nome.localeCompare(b.nome, "pt")
          : b[ordem] - a[ordem]
      );
  }, [estado, uf, partido, ordem]);

  useEffect(() => setLimite(25), [uf, partido, ordem]);

  return (
    <PageShell
      eyebrow="Cota parlamentar"
      title="Quanto os deputados gastaram da cota em 2025"
      description="A cota paga passagens, escritório, divulgação e outras despesas do mandato. O teto muda por estado, por isso as comparações usam a média por mês com gasto e a mediana de cada grupo."
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Cota parlamentar" }]}
      />

      {estado.fase === "carregando" && <p>Carregando…</p>}

      {estado.fase === "sem-dados" && (
        <div className="empty-search">
          <h3>Os dados da cota ainda não foram coletados</h3>
          <p>
            O resumo é gerado pela coleta mensal a partir do arquivo anual da
            Câmara. Enquanto isso, as notas fiscais podem ser consultadas no{" "}
            <a
              href="https://www.camara.leg.br/cota-parlamentar/"
              target="_blank"
              rel="noreferrer"
            >
              portal da Câmara
            </a>
            .
          </p>
        </div>
      )}

      {estado.fase === "pronto" && (
        <>
          <section className="gastos-resumo">
            <div>
              <span>Total líquido em 2025</span>
              <strong>{milhoes(estado.panorama.total)}</strong>
            </div>
            <div>
              <span>Deputados com despesas</span>
              <strong>{estado.panorama.deputados}</strong>
            </div>
            <div>
              <span>Mediana por mês com gasto</span>
              <strong>{real(estado.panorama.medianaMensal)}</strong>
            </div>
          </section>

          <section className="dep-section">
            <SectionHeading
              eyebrow="Para onde vai"
              title="Gastos por tipo de despesa"
              description="Soma de todos os deputados com voto registrado em 2025."
            />
            <div className="dep-bars gastos-tipos">
              {estado.panorama.porTipo.map(t => (
                <div className="dep-bar cota-bar" key={t.tipo}>
                  <span>{t.tipo}</span>
                  <div>
                    <i style={{ width: `${100 * t.parte}%` }} />
                  </div>
                  <strong>{milhoes(t.valor)}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="dep-section gastos-dupla">
            <div>
              <SectionHeading
                eyebrow="Por estado"
                title="Mediana da média mensal"
                description="Estados mais distantes de Brasília costumam ter teto maior por causa das passagens. O número ao lado da sigla é a quantidade de deputados."
              />
              <Grupos grupos={estado.panorama.porUf} destaque={uf} />
            </div>
            <div>
              <SectionHeading
                eyebrow="Por partido"
                title="Mediana da média mensal"
                description="Partidos com pelo menos cinco deputados com despesas em 2025."
              />
              {estado.panorama.porPartido.length ? (
                <Grupos
                  grupos={estado.panorama.porPartido}
                  destaque={partido}
                />
              ) : (
                <p className="dep-empty">Nenhum partido com cinco deputados.</p>
              )}
            </div>
          </section>

          <section className="dep-section">
            <SectionHeading
              id="deputados"
              eyebrow="Deputado a deputado"
              title={`${linhas.length} deputados`}
              description="Gastar mais não indica irregularidade nem gastar menos indica eficiência: o teto, a distância até Brasília e o tempo de mandato mudam de um para outro."
            />
            <div className="gastos-filtros">
              <label>
                Estado
                <select value={uf} onChange={e => setUf(e.target.value)}>
                  <option value="">Todos</option>
                  {estado.panorama.porUf
                    .map(g => g.nome)
                    .sort()
                    .map(u => (
                      <option key={u}>{u}</option>
                    ))}
                </select>
              </label>
              <label>
                Partido
                <select
                  value={partido}
                  onChange={e => setPartido(e.target.value)}
                >
                  <option value="">Todos</option>
                  {[...new Set(estado.panorama.linhas.map(l => l.partido))]
                    .sort()
                    .map(p => (
                      <option key={p}>{p}</option>
                    ))}
                </select>
              </label>
              <label>
                Ordenar por
                <select
                  value={ordem}
                  onChange={e => setOrdem(e.target.value as Ordem)}
                >
                  <option value="mediaMensal">Média por mês com gasto</option>
                  <option value="total">Total no ano</option>
                  <option value="nome">Nome</option>
                </select>
              </label>
            </div>
            <div className="dep-table-wrap">
              <table className="dep-table">
                <thead>
                  <tr>
                    <th>Deputado</th>
                    <th>Partido-UF</th>
                    <th>Meses com gasto</th>
                    <th>Média mensal</th>
                    <th>Total no ano</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.slice(0, limite).map(l => (
                    <tr key={l.id}>
                      <td>
                        <Link href={paginaDeputado(l.id)}>{l.nome}</Link>
                      </td>
                      <td>
                        {l.partido}-{l.uf}
                      </td>
                      <td>{l.meses}</td>
                      <td>
                        <strong>{real(l.mediaMensal)}</strong>
                      </td>
                      <td>{real(l.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {linhas.length > limite && (
              <button
                className="gastos-mais"
                onClick={() => setLimite(n => n + 50)}
              >
                Mostrar mais ({linhas.length - limite} restantes){" "}
                <ArrowRight size={14} />
              </button>
            )}
          </section>

          <div className="dep-source">
            <SourcePill
              source={`Câmara dos Deputados · Cota parlamentar · coleta ${estado.cota.coleta}`}
            />
            <a href={estado.cota.url}>
              Arquivo original (CSV) <ExternalLink size={13} />
            </a>
          </div>
        </>
      )}
    </PageShell>
  );
}
