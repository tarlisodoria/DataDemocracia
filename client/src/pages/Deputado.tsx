import {
  ArrowRight,
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
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { initialsAvatar } from "@/data/demo";
import {
  carregarCadastros,
  carregarVotacoes,
  identificarRede,
  painelDeputado,
  perfilDeputado,
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
    };

export default function Deputado() {
  const { id } = useParams<{ id: string }>();
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });

  useEffect(() => {
    let ativo = true;
    Promise.all([carregarVotacoes(), carregarCadastros()])
      .then(([dados, cadastros]) => {
        if (!ativo) return;
        const votos = perfilDeputado(dados, Number(id));
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

  const { votos, nome, partido, uf, cadastro, coleta } = estado;
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
          <li>Nenhum destes números é uma nota sobre a atuação do deputado.</li>
        </ul>
      </section>
    </PageShell>
  );
}
