import { ArrowRight, Bell, Search } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { initialsAvatar } from "@/data/demo";
import { alternarAcompanhado, lerAcompanhados } from "@/lib/acompanhar";
import {
  carregarCadastros,
  carregarVotacoes,
  divergencias,
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
  b ? `${Math.round((100 * a) / b)}%` : "—";

export default function Monitoring() {
  const [ids, setIds] = useState<number[]>(lerAcompanhados);
  const [dados, setDados] = useState<VotacoesArquivo | null>(null);
  const [cadastros, setCadastros] = useState<Record<string, PerfilCadastro>>(
    {}
  );

  useEffect(() => {
    Promise.all([carregarVotacoes(), carregarCadastros()])
      .then(([d, c]) => {
        setDados(d);
        setCadastros(c);
      })
      .catch(() => setDados(null));
  }, []);

  const acompanhados = dados
    ? ids.flatMap(id => {
        const j = dados.deps.findIndex(d => d[0] === id);
        if (j < 0) return [];
        const [, nome, partido, uf] = dados.deps[j];
        return [
          {
            id,
            nome,
            partido,
            uf,
            votos: perfilDeputado(dados, id)!,
            ultimaDivergencia: divergencias(dados, j)[0],
          },
        ];
      })
    : [];

  return (
    <PageShell
      eyebrow="Monitoramento"
      title="Deputados que você acompanha"
      description="Um resumo dos deputados que você marcou como acompanhados, com o último voto contra o próprio partido. A lista fica salva neste navegador."
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Monitoramento" }]}
      />
      {ids.length === 0 ? (
        <div className="empty-search">
          <Bell size={25} />
          <h3>Você ainda não acompanha nenhum deputado</h3>
          <p>
            Abra o perfil de um deputado e use o botão "Acompanhar". Ele aparece
            aqui com o resumo dos votos.
          </p>
          <Button asChild>
            <Link href="/buscar">
              <Search size={16} /> Encontrar deputados
            </Link>
          </Button>
        </div>
      ) : !dados ? (
        <p>Carregando…</p>
      ) : (
        <>
          <ul className="mon-list">
            {acompanhados.map(a => {
              const r = a.votos.resumo;
              const total = r.registrados + r.semRegistro;
              const foto = cadastros[a.id]?.foto;
              return (
                <li key={a.id} className="mon-card">
                  <Link href={paginaDeputado(a.id)} className="mon-head">
                    <img
                      src={foto ?? initialsAvatar(a.nome)}
                      alt=""
                      onError={e =>
                        (e.currentTarget.src = initialsAvatar(a.nome))
                      }
                    />
                    <span>
                      <strong>{a.nome}</strong>
                      <small>
                        Deputado(a) federal · {a.partido}-{a.uf}
                      </small>
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                  <dl className="mon-stats">
                    <div>
                      <dt>Votou em</dt>
                      <dd>{pct(r.registrados, total)}</dd>
                    </div>
                    <div>
                      <dt>Votos Sim</dt>
                      <dd>{pct(a.votos.tipos.sim, r.registrados)}</dd>
                    </div>
                    <div>
                      <dt>Com o partido</dt>
                      <dd>
                        {pct(
                          a.votos.alinhamento.comMaioria,
                          a.votos.alinhamento.base
                        )}
                      </dd>
                    </div>
                  </dl>
                  {a.ultimaDivergencia && (
                    <p className="mon-note">
                      Último voto contra o {a.partido}:{" "}
                      <strong>{a.ultimaDivergencia.voto}</strong> em{" "}
                      {a.ultimaDivergencia.data.split("-").reverse().join("/")}{" "}
                      —{" "}
                      <a
                        href={`/explorar/votacoes-2025.html?votacao=${a.ultimaDivergencia.id}`}
                      >
                        {a.ultimaDivergencia.proposicao || "ver votação"}
                      </a>
                    </p>
                  )}
                  <button
                    className="text-button"
                    onClick={() => setIds(alternarAcompanhado(a.id))}
                  >
                    Deixar de acompanhar
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="dep-source">
            <SourcePill
              source={`Câmara dos Deputados · coleta ${dados.coleta}`}
            />
            <span>
              Alertas por e-mail chegam quando houver contas de usuário.
            </span>
          </div>
        </>
      )}
    </PageShell>
  );
}
