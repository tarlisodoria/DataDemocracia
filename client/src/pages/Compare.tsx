import { ArrowRight, Scale } from "lucide-react";
import { Link, useSearch } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { initialsAvatar } from "@/data/demo";
import {
  carregarAtuacao,
  carregarCadastros,
  carregarCota,
  carregarVotacoes,
  resumoAtuacao,
  resumoCota,
  type AtuacaoArquivo,
  type CotaArquivo,
  paginaDeputado,
  perfilDeputado,
  type PerfilCadastro,
  type VotacoesArquivo,
} from "@/lib/camara";
import {
  Breadcrumbs,
  PageShell,
  SourcePill,
} from "@/components/datademocracia/ui";

const pct = (a: number, b: number) =>
  b
    ? `${((100 * a) / b).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
    : "sem dado";

const real = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

// Votações em que os dois votaram Sim ou Não, e quantas vezes votaram igual.
function concordancia(dados: VotacoesArquivo, a: number, b: number) {
  let comum = 0;
  let iguais = 0;
  for (const linha of dados.v) {
    const x = linha[a];
    const y = linha[b];
    if ((x === "S" || x === "N") && (y === "S" || y === "N")) {
      comum++;
      if (x === y) iguais++;
    }
  }
  return { comum, iguais };
}

export default function Compare() {
  const params = new URLSearchParams(useSearch());
  const [dados, setDados] = useState<VotacoesArquivo | null>(null);
  const [cadastros, setCadastros] = useState<Record<string, PerfilCadastro>>(
    {}
  );
  const [ids, setIds] = useState<[number, number] | null>(null);
  // Arquivos opcionais: sem eles, as linhas de presença, projetos e cota não aparecem.
  const [extras, setExtras] = useState<{
    cota: CotaArquivo | null;
    atuacao: AtuacaoArquivo | null;
  }>({ cota: null, atuacao: null });

  useEffect(() => {
    Promise.all([carregarCota(), carregarAtuacao()]).then(([cota, atuacao]) =>
      setExtras({ cota, atuacao })
    );
    Promise.all([carregarVotacoes(), carregarCadastros()]).then(([d, c]) => {
      setDados(d);
      setCadastros(c);
      const pedidos = [Number(params.get("a")), Number(params.get("b"))];
      const valido = (id: number) => d.deps.some(x => x[0] === id);
      setIds([
        valido(pedidos[0]) ? pedidos[0] : d.deps[0][0],
        valido(pedidos[1]) ? pedidos[1] : d.deps[1][0],
      ]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mantém a escolha no endereço, para o link da comparação poder ser compartilhado.
  useEffect(() => {
    if (ids)
      history.replaceState(null, "", `/comparar?a=${ids[0]}&b=${ids[1]}`);
  }, [ids]);

  const lados = useMemo(() => {
    if (!dados || !ids) return null;
    return ids.map(id => {
      const j = dados.deps.findIndex(d => d[0] === id);
      const [, nome, partido, uf] = dados.deps[j];
      return {
        id,
        j,
        nome,
        partido,
        uf,
        votos: perfilDeputado(dados, id)!,
        cota: extras.cota && resumoCota(extras.cota, dados, id),
        atuacao: extras.atuacao && resumoAtuacao(extras.atuacao, dados, id),
      };
    });
  }, [dados, ids, extras]);

  const entreEles =
    lados && dados ? concordancia(dados, lados[0].j, lados[1].j) : null;

  return (
    <PageShell
      eyebrow="Comparar"
      title="Compare dois deputados pelos votos"
      description="Os mesmos indicadores, no mesmo período e com a mesma fonte, lado a lado. Sem nota, sem vencedor."
      actions={
        <Button variant="outline" asChild>
          <Link href="/metodologia">
            <Scale size={16} /> Como comparar
          </Link>
        </Button>
      }
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Comparar" }]}
      />
      {!dados || !lados || !ids ? (
        <p>Carregando…</p>
      ) : (
        <>
          <div className="cmp-pickers">
            {lados.map((l, k) => (
              <label key={k}>
                {k === 0 ? "Primeiro deputado" : "Segundo deputado"}
                <select
                  value={l.id}
                  onChange={e => {
                    const novo = [...ids] as [number, number];
                    novo[k] = Number(e.target.value);
                    setIds(novo);
                  }}
                >
                  {dados.deps.map(([id, nome, partido, uf]) => (
                    <option key={id} value={id}>
                      {nome} ({partido}-{uf})
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="cmp-grid">
            {lados.map(l => {
              const r = l.votos.resumo;
              const total = r.registrados + r.semRegistro;
              const foto = cadastros[l.id]?.foto;
              return (
                <div className="cmp-col" key={l.id}>
                  <Link href={paginaDeputado(l.id)} className="cmp-head">
                    <img
                      src={foto ?? initialsAvatar(l.nome)}
                      alt=""
                      onError={e =>
                        (e.currentTarget.src = initialsAvatar(l.nome))
                      }
                    />
                    <span>
                      <strong>{l.nome}</strong>
                      <small>
                        {l.partido}-{l.uf} · ver perfil <ArrowRight size={12} />
                      </small>
                    </span>
                  </Link>
                  <dl className="cmp-list">
                    <div>
                      <dt>Votos registrados</dt>
                      <dd>
                        {pct(r.registrados, total)}{" "}
                        <small>
                          {r.registrados} de {total}
                        </small>
                      </dd>
                    </div>
                    <div>
                      <dt>Votos Sim</dt>
                      <dd>{pct(l.votos.tipos.sim, r.registrados)}</dd>
                    </div>
                    <div>
                      <dt>Votos Não</dt>
                      <dd>{pct(l.votos.tipos.nao, r.registrados)}</dd>
                    </div>
                    <div>
                      <dt>Abstenção e obstrução</dt>
                      <dd>
                        {pct(
                          l.votos.tipos.abstencao + l.votos.tipos.obstrucao,
                          r.registrados
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Com a maioria do próprio partido</dt>
                      <dd>
                        {pct(
                          l.votos.alinhamento.comMaioria,
                          l.votos.alinhamento.base
                        )}{" "}
                        <small>{l.votos.alinhamento.base} votos Sim/Não</small>
                      </dd>
                    </div>
                    {l.atuacao && (
                      <>
                        <div>
                          <dt>Presença em sessões deliberativas</dt>
                          <dd>
                            {pct(
                              l.atuacao.sessoes.presente,
                              l.atuacao.sessoes.total
                            )}{" "}
                            <small>
                              {l.atuacao.sessoes.presente} de{" "}
                              {l.atuacao.sessoes.total}
                            </small>
                          </dd>
                        </div>
                        <div>
                          <dt>Projetos como primeiro autor</dt>
                          <dd>
                            {l.atuacao.projetos.principal}{" "}
                            <small>
                              mediana da Câmara:{" "}
                              {l.atuacao.projetos.medianaPrincipal}
                            </small>
                          </dd>
                        </div>
                      </>
                    )}
                    {l.cota && (
                      <div>
                        <dt>Cota: média por mês com gasto</dt>
                        <dd>
                          {real(l.cota.mediaMensal)}{" "}
                          <small>
                            mediana de {l.cota.uf.sigla}:{" "}
                            {real(l.cota.uf.mediana)}
                          </small>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              );
            })}
          </div>

          {entreEles && (
            <div className="cmp-together">
              <span className="eyebrow">Entre os dois</span>
              <p>
                Nas <strong>{entreEles.comum}</strong> votações em que ambos
                votaram Sim ou Não, votaram igual em{" "}
                <strong>{pct(entreEles.iguais, entreEles.comum)}</strong> delas.
              </p>
              <a href={`/explorar/votacoes-2025.html?deputado=${lados[0].id}`}>
                Abrir o painel de votações <ArrowRight size={14} />
              </a>
            </div>
          )}

          <div className="dep-source">
            <SourcePill
              source={`Câmara dos Deputados · API Dados Abertos · coleta ${dados.coleta}`}
            />
            <span>
              Votações nominais do Plenário em 2025. Participação baixa pode ser
              licença ou suplência.
            </span>
          </div>
        </>
      )}
    </PageShell>
  );
}
