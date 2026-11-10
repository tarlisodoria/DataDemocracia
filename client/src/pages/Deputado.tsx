import {
  ArrowRight,
  Bell,
  BarChart3,
  CheckCircle2,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  UsersRound,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alternarAcompanhado, lerAcompanhados } from "@/lib/acompanhar";
import { initialsAvatar } from "@/data/demo";
import {
  carregarCadastros,
  carregarAtuacao,
  carregarCota,
  resumoAtuacao,
  type ResumoAtuacao,
  resumoCota,
  type ResumoCota,
  carregarVotacoes,
  identificarRede,
  painelDeputado,
  divergencias,
  maisParecidos,
  perfilDeputado,
  votosPorTema,
  type Divergencia,
  type Semelhante,
  type TemaVoto,
  type PerfilCadastro,
  type PerfilVotos,
} from "@/lib/camara";
import {
  Breadcrumbs,
  MetricTile,
  PageShell,
  SectionHeading,
  SourcePill,
} from "@/components/datademocracia/ui";
import NotFound from "./NotFound";

const ICONES: Record<string, typeof Globe> = {
  Instagram,
  Facebook,
  X: Twitter,
  YouTube: Youtube,
  LinkedIn: Linkedin,
};

const pct = (a: number, b: number) =>
  b
    ? `${((100 * a) / b).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
    : "sem dado";

type Estado =
  | { fase: "carregando" }
  | { fase: "erro" }
  | { fase: "ausente" }
  | {
      fase: "pronto";
      coleta: string;
      votos: PerfilVotos;
      nome: string;
      partido: string;
      uf: string;
      cadastro?: PerfilCadastro;
      divergiu: Divergencia[];
      temas: TemaVoto[];
      parecidos: Semelhante[];
      cota: ResumoCota | null;
      atuacao: ResumoAtuacao | null;
      atuacaoColeta?: string;
      cotaColeta?: string;
    };

export default function Deputado() {
  const { id } = useParams<{ id: string }>();
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });
  const [acompanhados, setAcompanhados] = useState(lerAcompanhados);
  const acompanha = acompanhados.includes(Number(id));

  useEffect(() => {
    let ativo = true;
    Promise.all([
      carregarVotacoes(),
      carregarCadastros(),
      carregarCota(),
      carregarAtuacao(),
    ])
      .then(([dados, cadastros, cota, atuacao]) => {
        if (!ativo) return;
        const votos = perfilDeputado(dados, Number(id));
        const j = dados.deps.findIndex(d => d[0] === Number(id));
        if (!votos) return setEstado({ fase: "ausente" });
        const [, nome, partido, uf] = dados.deps.find(
          d => d[0] === Number(id)
        )!;
        document.title = `${nome} · DataDemocracia`;
        setEstado({
          fase: "pronto",
          coleta: dados.coleta,
          votos,
          nome,
          partido,
          uf,
          cadastro: cadastros[id],
          divergiu: divergencias(dados, j),
          temas: votosPorTema(dados, j).slice(0, 10),
          parecidos: maisParecidos(dados, j),
          cota: cota && resumoCota(cota, dados, Number(id)),
          cotaColeta: cota?.coleta,
          atuacao: atuacao && resumoAtuacao(atuacao, dados, Number(id)),
          atuacaoColeta: atuacao?.coleta,
        });
      })
      .catch(() => ativo && setEstado({ fase: "erro" }));
    return () => {
      ativo = false;
    };
  }, [id]);

  if (estado.fase === "ausente") return <NotFound />;
  if (estado.fase !== "pronto")
    return (
      <PageShell
        title={
          estado.fase === "erro"
            ? "Não foi possível carregar os dados"
            : "Carregando…"
        }
      >
        {estado.fase === "erro" && (
          <p>
            Recarregue a página. Se o erro continuar, os arquivos do painel
            podem estar indisponíveis.
          </p>
        )}
      </PageShell>
    );

  const {
    votos,
    nome,
    partido,
    uf,
    cadastro,
    coleta,
    divergiu,
    temas,
    parecidos,
  } = estado;
  const { resumo, tipos, alinhamento } = votos;
  const total = resumo.registrados + resumo.semRegistro;
  const redes = (cadastro?.redes ?? []).map(identificarRede);

  return (
    <PageShell>
      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Políticos", href: "/buscar" },
          { label: nome },
        ]}
      />

      <section className="dep-header">
        <img
          className="dep-photo"
          src={cadastro?.foto ?? initialsAvatar(nome)}
          alt={cadastro?.foto ? `Foto oficial de ${nome}` : ""}
          onError={e => (e.currentTarget.src = initialsAvatar(nome))}
        />
        <div className="dep-id">
          <div className="dep-badges">
            <Badge variant="outline">
              <CheckCircle2 size={13} /> Dados oficiais
            </Badge>
            <span>57ª legislatura</span>
          </div>
          <h1>{nome}</h1>
          <p className="dep-role">
            Deputado(a) federal · {partido}-{uf}
            {cadastro?.nomeCivil && cadastro.nomeCivil !== nome && (
              <> · nome civil: {cadastro.nomeCivil}</>
            )}
          </p>
          {(redes.length > 0 || cadastro?.email) && (
            <ul className="dep-social" aria-label="Contatos e redes sociais">
              {redes.map(r => {
                const Icone = ICONES[r.nome] ?? Globe;
                return (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${r.nome} de ${nome}`}
                    >
                      <Icone size={17} /> <span>{r.nome}</span>
                    </a>
                  </li>
                );
              })}
              {cadastro?.email && (
                <li>
                  <a
                    href={`mailto:${cadastro.email}`}
                    aria-label={`E-mail do gabinete de ${nome}`}
                  >
                    <Mail size={17} /> <span>{cadastro.email}</span>
                  </a>
                </li>
              )}
            </ul>
          )}
          <div className="dep-actions">
            <Button
              variant={acompanha ? "secondary" : "outline"}
              aria-pressed={acompanha}
              onClick={() => setAcompanhados(alternarAcompanhado(resumo.id))}
            >
              <Bell size={16} /> {acompanha ? "Acompanhando" : "Acompanhar"}
            </Button>
            <Link className="text-link" href={`/comparar?a=${resumo.id}`}>
              Comparar com outro deputado <ArrowRight size={14} />
            </Link>
            <a
              className="button button-primary"
              href={painelDeputado(resumo.id)}
            >
              <BarChart3 size={16} /> Ver no painel de votações
            </a>
            <a
              className="text-link"
              href={`https://www.camara.leg.br/deputados/${resumo.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Perfil na Câmara <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <div className="dep-source">
        <SourcePill
          source={`Câmara dos Deputados · API Dados Abertos · coleta ${coleta}`}
        />
        <span>Votações nominais do Plenário em 2025</span>
      </div>

      <p className="dep-lede">
        Em 2025, {nome} registrou voto em{" "}
        <strong>{pct(resumo.registrados, total)}</strong> das votações nominais
        do Plenário (média da Câmara: {pct(votos.mediaParticipacao, 1)}). Votou
        com a maioria do {partido} em{" "}
        <strong>{pct(alinhamento.comMaioria, alinhamento.base)}</strong> dos
        votos Sim/Não e votou contra ela em <strong>{divergiu.length}</strong>{" "}
        votações.
        {parecidos[0] && (
          <>
            {" "}
            Quem mais votou igual: <strong>{parecidos[0].nome}</strong> (
            {parecidos[0].partido}-{parecidos[0].uf}), em{" "}
            {pct(parecidos[0].concordancia, 1)} das votações em comum.
          </>
        )}
      </p>

      <section className="profile-metrics">
        <MetricTile
          label="Votos registrados"
          value={`${resumo.registrados} de ${total}`}
          note={`${pct(resumo.registrados, total)} das votações · média da Câmara ${pct(votos.mediaParticipacao, 1)}`}
          icon={BarChart3}
        />
        <MetricTile
          label="Votos Sim"
          value={pct(tipos.sim, resumo.registrados)}
          note={`${tipos.sim} votos`}
        />
        <MetricTile
          label="Votos Não"
          value={pct(tipos.nao, resumo.registrados)}
          note={`${tipos.nao} votos`}
        />
        <MetricTile
          label="Com a maioria do partido"
          value={pct(alinhamento.comMaioria, alinhamento.base)}
          note={`${alinhamento.comMaioria} de ${alinhamento.base} votos Sim/Não`}
          icon={UsersRound}
        />
      </section>

      <section className="dep-section">
        <SectionHeading
          eyebrow="Distribuição"
          title="Como votou em 2025"
          description="Percentual sobre os votos registrados. Obstrução inclui os registros de Art. 17."
        />
        <div
          className="dep-bars"
          role="img"
          aria-label={`Sim ${tipos.sim}, Não ${tipos.nao}, Abstenção ${tipos.abstencao}, Obstrução ${tipos.obstrucao}`}
        >
          {(
            [
              ["Sim", tipos.sim, "sim"],
              ["Não", tipos.nao, "nao"],
              ["Abstenção", tipos.abstencao, "abst"],
              ["Obstrução", tipos.obstrucao, "obst"],
            ] as const
          ).map(([rotulo, n, cls]) => (
            <div className="dep-bar" key={rotulo}>
              <span>{rotulo}</span>
              <div>
                <i
                  className={cls}
                  style={{
                    width: resumo.registrados
                      ? `${(100 * n) / resumo.registrados}%`
                      : 0,
                  }}
                />
              </div>
              <strong>{pct(n, resumo.registrados)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="dep-section">
        <SectionHeading
          eyebrow="Registro"
          title="Últimas votações com voto registrado"
        />
        <div className="dep-table-wrap">
          <table className="dep-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Proposição</th>
                <th>O que foi votado</th>
                <th>Voto</th>
              </tr>
            </thead>
            <tbody>
              {votos.ultimos.map(u => (
                <tr key={u.id}>
                  <td>{u.data.split("-").reverse().join("/")}</td>
                  <td>{u.proposicao || "—"}</td>
                  <td>
                    <a href={`/explorar/votacoes-2025.html?votacao=${u.id}`}>
                      {u.oQue}
                    </a>
                  </td>
                  <td>
                    <strong>{u.voto}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {temas.length > 0 && (
        <section className="dep-section">
          <SectionHeading
            eyebrow="Por tema"
            title="Como votou em cada assunto"
            description="Percentual de votos Sim por tema da proposição, comparado ao partido e à Câmara inteira. Mostra os temas com mais votos."
          />
          <div className="dep-table-wrap">
            <table className="dep-table">
              <thead>
                <tr>
                  <th>Tema</th>
                  <th className="n">Votos</th>
                  <th className="n">Sim · deputado</th>
                  <th className="n">Sim · {partido}</th>
                  <th className="n">Sim · Câmara</th>
                </tr>
              </thead>
              <tbody>
                {temas.map(t => (
                  <tr key={t.tema}>
                    <td>{t.tema}</td>
                    <td className="n">{t.votos}</td>
                    <td className="n">
                      <strong>{pct(t.simDeputado, 1)}</strong>
                    </td>
                    <td className="n">
                      {t.simPartido === null ? "—" : pct(t.simPartido, 1)}
                    </td>
                    <td className="n">{pct(t.simCamara, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="dep-section">
        <SectionHeading
          eyebrow="Divergências"
          title={`Quando votou diferente do ${partido}`}
          description={`${divergiu.length} votações em que o voto Sim/Não foi o oposto do da maioria dos colegas de sigla. As mais recentes primeiro.`}
        />
        {divergiu.length === 0 ? (
          <p className="dep-empty">Nenhuma divergência registrada em 2025.</p>
        ) : (
          <div className="dep-table-wrap">
            <table className="dep-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>O que foi votado</th>
                  <th>Voto</th>
                  <th>Colegas de sigla</th>
                </tr>
              </thead>
              <tbody>
                {divergiu.slice(0, 10).map(d => (
                  <tr key={d.id}>
                    <td>{d.data.split("-").reverse().join("/")}</td>
                    <td>
                      <a href={`/explorar/votacoes-2025.html?votacao=${d.id}`}>
                        {d.proposicao ? `${d.proposicao}: ` : ""}
                        {d.oQue}
                      </a>
                    </td>
                    <td>
                      <strong>{d.voto}</strong>
                    </td>
                    <td>
                      {d.partidoSim} Sim · {d.partidoNao} Não
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {parecidos.length > 0 && (
        <section className="dep-section">
          <SectionHeading
            eyebrow="Afinidade de voto"
            title="Quem mais votou igual"
            description="Deputados com o maior percentual de votos Sim/Não iguais nas votações em que os dois votaram (mínimo de 100 em comum). Não indica aliança nem qualidade."
          />
          <ul className="dep-peers">
            {parecidos.map(s => (
              <li key={s.id}>
                <Link href={`/deputado/${s.id}`}>
                  <img src={initialsAvatar(s.nome)} alt="" />
                  <span>
                    <strong>{s.nome}</strong>
                    <small>
                      {s.partido}-{s.uf}
                      {s.partido !== partido && " · outro partido"}
                    </small>
                  </span>
                  <b>{pct(s.concordancia, 1)}</b>
                  <small>{s.emComum} em comum</small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {estado.atuacao && (
        <SecaoAtuacao atuacao={estado.atuacao} coleta={estado.atuacaoColeta} />
      )}

      {estado.cota && (
        <SecaoCota cota={estado.cota} coleta={estado.cotaColeta} />
      )}

      <section className="dep-section dep-notes">
        <h2>Como ler estes números</h2>
        <ul>
          <li>
            <strong>Votos registrados</strong> contam só votações nominais do
            Plenário. Ficar sem registro pode ser falta, licença, missão oficial
            ou período fora do exercício do mandato.
          </li>
          <li>
            <strong>Com a maioria do partido</strong> compara o voto Sim/Não do
            deputado com o voto da maioria dos colegas da mesma sigla na mesma
            votação. Empates não entram na conta.
          </li>
          <li>
            "Sim" pode significar aprovar ou rejeitar algo, conforme o objeto
            votado. Abra a votação para ler o contexto.
          </li>
          <li>
            <strong>Presença</strong> vem do registro de comparecimento da
            Câmara. Sessões e reuniões perdidas podem ser licença, missão
            oficial ou período antes da posse.
          </li>
          <li>
            <strong>Proposições</strong> contam só projetos (PL, PLP, PEC, PDL)
            e requerimentos apresentados em 2025. Quantidade não mede qualidade
            nem resultado.
          </li>
          <li>
            <strong>Cota parlamentar</strong> é a verba para despesas do mandato
            (passagens, escritório, divulgação). O teto muda por estado, por
            isso a comparação é com deputados da mesma UF. Valores líquidos, já
            descontados reembolsos.
          </li>
          <li>Nenhum destes números é uma nota sobre a atuação do deputado.</li>
        </ul>
      </section>
    </PageShell>
  );
}

const real = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
const cnpj = (c: string) =>
  c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
const MESES = "jan fev mar abr mai jun jul ago set out nov dez".split(" ");

function SecaoCota({ cota, coleta }: { cota: ResumoCota; coleta?: string }) {
  const { uf } = cota;
  const maiorMes = Math.max(...cota.porMes, 1);
  const diferenca = uf.mediana ? cota.mediaMensal / uf.mediana - 1 : 0;
  return (
    <section className="dep-section">
      <SectionHeading
        eyebrow="Cota parlamentar"
        title={`${real(cota.total)} em despesas do mandato em 2025`}
        description={`${cota.lancamentos} lançamentos em ${cota.meses} ${cota.meses === 1 ? "mês" : "meses"}. Média de ${real(cota.mediaMensal)} por mês com gasto: ${
          Math.abs(diferenca) < 0.05
            ? "perto da"
            : `${pct(Math.abs(diferenca), 1)} ${diferenca > 0 ? "acima da" : "abaixo da"}`
        } mediana dos deputados de ${uf.sigla} (${real(uf.mediana)}).`}
      />
      <div className="cota-grid">
        <div>
          <h3>Por mês</h3>
          <div
            className="cota-months"
            role="img"
            aria-label={cota.porMes
              .map((v, i) => `${MESES[i]} ${real(v)}`)
              .join(", ")}
          >
            {cota.porMes.map((v, i) => (
              <div key={i} title={`${MESES[i]}: ${real(v)}`}>
                <i
                  style={{ height: `${(100 * Math.max(v, 0)) / maiorMes}%` }}
                />
                <span>{MESES[i]}</span>
              </div>
            ))}
          </div>
          <p className="cota-rank">
            {uf.posicao}ª maior média mensal entre os {uf.deputados} deputados
            de {uf.sigla} que usaram a cota em 2025, suplentes incluídos.
          </p>
        </div>
        <div>
          <h3>Por tipo de despesa</h3>
          <div className="dep-bars">
            {cota.tipos.slice(0, 6).map(t => (
              <div className="dep-bar cota-bar" key={t.tipo}>
                <span>{t.tipo}</span>
                <div>
                  <i style={{ width: `${100 * t.parte}%` }} />
                </div>
                <strong>{real(t.valor)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      {cota.fornecedores.length > 0 && (
        <div className="dep-table-wrap">
          <table className="dep-table">
            <caption>Maiores fornecedores no ano</caption>
            <thead>
              <tr>
                <th>Fornecedor</th>
                <th>CNPJ</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {cota.fornecedores.map(f => (
                <tr key={f.nome}>
                  <td>{f.nome}</td>
                  <td className="cota-doc">
                    {f.cnpj ? cnpj(f.cnpj) : "sem CNPJ"}
                  </td>
                  <td>
                    <strong>{real(f.valor)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="dep-source">
        <SourcePill
          source={`Câmara dos Deputados · Cota parlamentar${coleta ? ` · coleta ${coleta}` : ""}`}
        />
        <a
          href="https://www.camara.leg.br/cota-parlamentar/"
          target="_blank"
          rel="noreferrer"
        >
          Notas fiscais no portal da Câmara <ArrowRight size={13} />
        </a>
      </div>
    </section>
  );
}

const num = (v: number) => Math.round(v).toLocaleString("pt-BR");

function SecaoAtuacao({
  atuacao,
  coleta,
}: {
  atuacao: ResumoAtuacao;
  coleta?: string;
}) {
  const { sessoes, reunioes, projetos } = atuacao;
  return (
    <section className="dep-section">
      <SectionHeading
        eyebrow="Atuação"
        title="Presença, comissões e projetos em 2025"
        description="Registros de comparecimento, participação em órgãos e proposições apresentadas, com a mediana da Câmara ao lado."
      />
      <div className="atu-tiles">
        <div>
          <span>Sessões deliberativas do Plenário</span>
          <strong>
            {num(sessoes.presente)} <small>de {num(sessoes.total)}</small>
          </strong>
          <p>Mediana da Câmara: {num(sessoes.mediana)}</p>
        </div>
        <div>
          <span>Reuniões de comissão e audiências</span>
          <strong>{num(reunioes.presente)}</strong>
          <p>Mediana da Câmara: {num(reunioes.mediana)}</p>
        </div>
        <div>
          <span>Projetos como primeiro autor</span>
          <strong>
            {num(projetos.principal)}{" "}
            <small>de {num(projetos.total)} assinados</small>
          </strong>
          <p>Mediana da Câmara: {num(projetos.medianaPrincipal)}</p>
        </div>
        <div>
          <span>Requerimentos e indicações</span>
          <strong>{num(atuacao.requerimentos)}</strong>
          <p>Pedidos de informação, audiências e providências</p>
        </div>
      </div>

      {atuacao.orgaos.length > 0 && (
        <>
          <h3 className="atu-sub">Comissões e cargos no ano</h3>
          <ul className="atu-orgaos">
            {atuacao.orgaos.map(o => (
              <li key={o.sigla}>
                <span>{o.nome}</span>
                <b className={o.cargo === "Suplente" ? "sup" : undefined}>
                  {o.cargo}
                </b>
              </li>
            ))}
          </ul>
        </>
      )}

      {atuacao.exemplos.length > 0 && (
        <>
          <h3 className="atu-sub">Projetos apresentados</h3>
          <ul className="atu-props">
            {atuacao.exemplos.map(e => (
              <li key={e.id}>
                <a
                  href={`https://www.camara.leg.br/propostas-legislativas/${e.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>{e.rotulo}</strong>
                  <span>{e.ementa}</span>
                  <small>
                    {e.principal ? "Primeiro autor" : "Coautor"} ·{" "}
                    {e.data.split("-").reverse().join("/")} · {e.situacao}
                  </small>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="dep-source">
        <SourcePill
          source={`Câmara dos Deputados · arquivos de dados abertos${coleta ? ` · coleta ${coleta}` : ""}`}
        />
      </div>
    </section>
  );
}
