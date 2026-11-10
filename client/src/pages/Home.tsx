import {
  ArrowRight,
  FileCheck2,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { initialsAvatar } from "@/data/demo";
import {
  carregarCadastros,
  carregarVotacoes,
  destaquesDoDia,
  paginaDeputado,
  resumirDeputados,
  temasMaisVotados,
  ultimasVotacoes,
  type DeputadoResumo,
  type PerfilCadastro,
  type VotacaoResumo,
} from "@/lib/camara";
import {
  PageShell,
  SearchBox,
  SectionHeading,
  SourcePill,
} from "@/components/datademocracia/ui";

type DadosHome = {
  coleta: string;
  destaques: DeputadoResumo[];
  votacoes: VotacaoResumo[];
  temas: { tema: string; votacoes: number }[];
  cadastros: Record<string, PerfilCadastro>;
};

const dataBr = (iso: string) => iso.split("-").reverse().join("/");
const pct = (a: number, b: number) =>
  b ? `${Math.round((100 * a) / b)}%` : "—";

export default function Home() {
  const [, navigate] = useLocation();
  const [dados, setDados] = useState<DadosHome | null>(null);

  useEffect(() => {
    let ativo = true;
    Promise.all([carregarVotacoes(), carregarCadastros()])
      .then(([arquivo, cadastros]) => {
        if (!ativo) return;
        const todos = resumirDeputados(arquivo);
        setDados({
          coleta: arquivo.coleta,
          destaques: destaquesDoDia(todos.length, 3).map(i => todos[i]),
          votacoes: ultimasVotacoes(arquivo, 4),
          temas: temasMaisVotados(arquivo, 4),
          cadastros,
        });
      })
      .catch(() => {
        // Sem os arquivos de dados, a home mostra só os textos fixos.
      });
    return () => {
      ativo = false;
    };
  }, []);

  const ultima = dados?.votacoes[0];

  return (
    <PageShell>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Plataforma cívica independente
          </div>
          <h1>
            Política brasileira,
            <br />
            <em>sem ruído.</em>
          </h1>
          <p className="hero-lead">
            Dados, contexto e evidências para você entender quem disputa, quem
            decide e o que foi feito — antes, durante e depois da eleição.
          </p>
          <SearchBox
            onSubmit={value =>
              navigate(
                `/buscar${value ? `?q=${encodeURIComponent(value)}` : ""}`
              )
            }
          />
          <div className="hero-hint">
            <ShieldCheck size={15} /> Toda informação tem fonte, data e
            contexto.
          </div>
        </div>
        <div className="hero-aside" aria-label="Resumo do produto">
          <div className="hero-aside-top">
            <span>Última votação no Plenário</span>
            <span className="live-indicator">
              <i /> dados oficiais
            </span>
          </div>
          <div className="document-stack">
            <div className="document-card back">
              <span>FONTE OFICIAL</span>
              <b>Câmara dos Deputados</b>
              <small>
                API Dados Abertos{dados ? ` · coleta ${dados.coleta}` : ""}
              </small>
            </div>
            <a
              className="document-card front"
              href={
                ultima
                  ? `/explorar/votacoes-2025.html?votacao=${ultima.id}`
                  : "/explorar/votacoes-2025.html"
              }
            >
              <div className="doc-line">
                <span className="doc-number">
                  {ultima ? dataBr(ultima.data) : "2025"}
                </span>
                <span className="doc-label">
                  {ultima?.proposicao || "VOTAÇÃO"}
                </span>
              </div>
              <h3>
                {ultima
                  ? `${ultima.sim} Sim · ${ultima.nao} Não`
                  : "Votações nominais"}
              </h3>
              <p>
                {ultima
                  ? ultima.oQue
                  : "Como cada deputado votou no Plenário em 2025."}
              </p>
              <div className="doc-footer">
                <FileCheck2 size={14} /> ver o voto de cada deputado
              </div>
            </a>
          </div>
          <div className="hero-aside-foot">
            <span>01</span>
            <span>Escolha</span>
            <span className="line" />
            <span>02</span>
            <span>Verifique</span>
            <span className="line" />
            <span>03</span>
            <span>Acompanhe</span>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <a href="/explorar/votacoes-2025.html">
          <span className="trust-number">429</span>
          <span>votações reais da Câmara em 2025</span>
        </a>
        <a href="/explorar/votacoes-2025.html">
          <span className="trust-number">551</span>
          <span>deputados com voto registrado</span>
        </a>
        <div>
          <span className="trust-number">0</span>
          <span>notas ou rankings gerais</span>
        </div>
        <a className="trust-note" href="/explorar/votacoes-2025.html">
          <ShieldCheck size={17} /> Explorar o painel de votações
        </a>
      </section>

      {/* shortcut: números fixos da coleta de 03/11/2026; ler do arquivo quando a coleta for agendada */}
      <section className="how-section">
        <SectionHeading
          eyebrow="Dados reais"
          title="O que o Plenário da Câmara votou em 2025"
          description="429 votações nominais e o voto de 551 deputados, coletados da API de dados abertos da Câmara em 03/11/2026."
          action={
            <a href="/explorar/votacoes-2025.html" className="text-link">
              Abrir o painel <ArrowRight size={15} />
            </a>
          }
        />
        <div className="how-grid">
          <div className="how-step highlighted">
            <span className="how-figure">58,5%</span>
            <h3>dos votos registrados foram "Sim"</h3>
            <p>
              Entre os partidos com 10 ou mais deputados, a proporção foi de
              53,6% (PSOL) a 62,7% (PODE).
            </p>
            <a href="/explorar/votacoes-2025.html">
              Ver por partido <ArrowRight size={15} />
            </a>
          </div>
          <div className="how-step">
            <span className="how-figure">55</span>
            <h3>votações em novembro, o mês mais intenso</h3>
            <p>
              Janeiro não teve votação nominal: o Congresso estava em recesso.
            </p>
            <a href="/explorar/votacoes-2025.html?mes=11">
              Ver novembro <ArrowRight size={15} />
            </a>
          </div>
          <div className="how-step">
            <span className="how-figure">27,7%</span>
            <h3>das situações não têm voto registrado</h3>
            <p>
              Inclui faltas, licenças, missões oficiais e suplentes fora de
              exercício. Não é sinônimo de ausência.
            </p>
            <a href="/explorar/votacoes-2025.html">
              Entender o cálculo <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section className="how-section">
        <SectionHeading
          eyebrow="Como funciona"
          title="Você acompanha. A fonte sustenta."
          description="Uma forma mais clara de entender a política, sem trocar complexidade por certezas fáceis."
        />
        <div className="how-grid">
          <div className="how-step">
            <span className="step-index">01</span>
            <Search size={22} />
            <h3>Escolha</h3>
            <p>Encontre uma pessoa, um tema, uma cidade ou uma promessa.</p>
            <Link href="/buscar">
              Explorar políticos <ArrowRight size={15} />
            </Link>
          </div>
          <div className="how-step highlighted">
            <span className="step-index">02</span>
            <FileCheck2 size={22} />
            <h3>Verifique</h3>
            <p>
              Leia o resumo, abra a evidência e descubra como o dado foi
              classificado.
            </p>
            <Link href="/metodologia">
              Conhecer a metodologia <ArrowRight size={15} />
            </Link>
          </div>
          <div className="how-step">
            <span className="step-index">03</span>
            <Landmark size={22} />
            <h3>Acompanhe</h3>
            <p>
              Escolha políticos, temas e promessas para acompanhar. Os alertas
              chegam quando as contas de usuário estiverem disponíveis.
            </p>
            <Link href="/monitoramento">
              Criar monitoramento <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <SectionHeading
          eyebrow="Comece por aqui"
          title="Conheça os deputados pelos votos"
          description="Três dos 551 deputados com voto registrado em 2025, escolhidos a cada dia. Cada perfil mostra participação, temas, divergências com o partido e afinidade de voto."
          action={
            <Link href="/buscar" className="text-link">
              Ver todos <ArrowRight size={15} />
            </Link>
          }
        />
        <div className="politician-grid">
          {(dados?.destaques ?? []).map(d => {
            const foto = dados?.cadastros[d.id]?.foto;
            const total = d.registrados + d.semRegistro;
            return (
              <Link
                href={paginaDeputado(d.id)}
                className="politician-card"
                key={d.id}
              >
                <div
                  className="politician-image"
                  style={{
                    backgroundImage: [
                      foto && `url("${foto}")`,
                      `url("${initialsAvatar(d.nome)}")`,
                    ]
                      .filter(Boolean)
                      .join(", "),
                  }}
                >
                  <span className="image-tag">Dados oficiais</span>
                </div>
                <div className="politician-card-body">
                  <div className="politician-card-meta">
                    <span>Deputado(a) federal</span>
                    <span>{d.uf}</span>
                  </div>
                  <h3>{d.nome}</h3>
                  <p>
                    {d.partido}-{d.uf}. Votou em {pct(d.registrados, total)} das
                    votações nominais de 2025; {pct(d.sim, d.registrados)} dos
                    votos foram Sim.
                  </p>
                  <div className="politician-card-foot">
                    <SourcePill
                      source={`Câmara dos Deputados · coleta ${dados?.coleta}`}
                    />
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="context-section">
        <div className="context-intro">
          <div className="eyebrow">Uma pergunta por vez</div>
          <h2>Política também se aprende quando o dado vem com contexto.</h2>
          <p>
            Entenda o que faz cada cargo, como uma proposição tramita e o que
            uma métrica realmente significa.
          </p>
          <Link href="/metodologia" className="button button-secondary">
            Conhecer o DataDemocracia <ArrowRight size={16} />
          </Link>
        </div>
        <div className="topic-list">
          {(dados?.temas ?? []).map((t, k) => (
            <a
              href={`/explorar/votacoes-2025.html?tema=${encodeURIComponent(t.tema)}`}
              className="topic-row"
              key={t.tema}
            >
              <span
                className={`topic-marker ${["teal", "coral", "amber", "blue"][k % 4]}`}
              />
              <span>{t.tema}</span>
              <small>{t.votacoes} votações em 2025</small>
              <ArrowRight size={16} />
            </a>
          ))}
        </div>
      </section>

      <section className="updates-section">
        <SectionHeading
          eyebrow="Plenário"
          title="Últimas votações nominais"
          description="As votações mais recentes da coleta, com o placar e o link para o voto de cada deputado."
        />
        <div className="updates-list">
          {(dados?.votacoes ?? []).map(v => (
            <a
              className="update-row"
              key={v.id}
              href={`/explorar/votacoes-2025.html?votacao=${v.id}`}
            >
              <div className="update-date">{dataBr(v.data)}</div>
              <div className="update-type">{v.proposicao || "Votação"}</div>
              <div className="update-main">
                <h3>{v.oQue}</h3>
                <SourcePill
                  source={`${v.sim} Sim · ${v.nao} Não · Câmara dos Deputados`}
                />
              </div>
              <ArrowRight size={17} />
            </a>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <Sparkles size={21} />
          <span>Seu olhar. Seu recorte. Sua rota.</span>
        </div>
        <h2>Comece pelo deputado que você quer acompanhar.</h2>
        <Link href="/buscar" className="button button-primary">
          Explorar agora <ArrowRight size={17} />
        </Link>
      </section>
    </PageShell>
  );
}
