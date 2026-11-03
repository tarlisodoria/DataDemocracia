import {
  ArrowRight,
  FileCheck2,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { politicians, sources, themes, updates } from "@/data/demo";
import {
  dataSourceLabel,
  fetchPublicPoliticians,
  isNeonConfigured,
  mergePublicPoliticians,
} from "@/lib/neon";
import {
  PageShell,
  SearchBox,
  SectionHeading,
  SourcePill,
} from "@/components/datademocracia/ui";

export default function Home() {
  const [, navigate] = useLocation();
  const [directory, setDirectory] = useState(politicians);
  const [usingLiveDirectory, setUsingLiveDirectory] = useState(false);

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
        // Keep the demonstrative catalog available during a temporary API failure.
      });

    return () => {
      active = false;
    };
  }, []);

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
            <span>Em foco agora</span>
            <span className="live-indicator">
              <i />{" "}
              {usingLiveDirectory
                ? "catálogo conectado"
                : "dados demonstrativos"}
            </span>
          </div>
          <div className="document-stack">
            <div className="document-card back">
              <span>FONTE OFICIAL</span>
              <b>Proposta de governo</b>
              <small>Eleição 2024 · documento original</small>
            </div>
            <div className="document-card front">
              <div className="doc-line">
                <span className="doc-number">01</span>
                <span className="doc-label">EVIDÊNCIA</span>
              </div>
              <h3>O que foi prometido?</h3>
              <p>
                Veja o texto original, a competência do cargo, o prazo e o que
                já foi documentado.
              </p>
              <div className="doc-footer">
                <FileCheck2 size={14} /> rastreabilidade por registro
              </div>
            </div>
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
        <div>
          <span className="trust-number">4</span>
          <span>camadas de evidência</span>
        </div>
        <div>
          <span className="trust-number">12</span>
          <span>fontes conectadas</span>
        </div>
        <div>
          <span className="trust-number">0</span>
          <span>opiniões vendidas</span>
        </div>
        <div className="trust-note">
          <ShieldCheck size={17} /> Metodologia aberta
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
              Monte sua própria rota de monitoramento e receba atualizações
              relevantes.
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
          title="Uma visão antes do julgamento"
          description="Perfis demonstrativos para explorar trajetória, promessas e atuação com o contexto que cada dado precisa."
          action={
            <Link href="/buscar" className="text-link">
              Ver todos <ArrowRight size={15} />
            </Link>
          }
        />
        <div className="politician-grid">
          {directory.map(politician => (
            <Link
              href={`/politico/${politician.id}`}
              className="politician-card"
              key={politician.id}
            >
              <div
                className="politician-image"
                style={{ backgroundImage: `url(${politician.portrait})` }}
              >
                <span className="image-tag">
                  {politician.type === "candidatura"
                    ? "Candidatura"
                    : "Em exercício"}
                </span>
              </div>
              <div className="politician-card-body">
                <div className="politician-card-meta">
                  <span>{politician.role}</span>
                  <span>{politician.state}</span>
                </div>
                <h3>{politician.shortName}</h3>
                <p>{politician.summary}</p>
                <div className="politician-card-foot">
                  <SourcePill
                    source={
                      usingLiveDirectory
                        ? dataSourceLabel
                        : "TSE · demonstrativo"
                    }
                  />
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
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
          {themes.map(theme => (
            <Link href="/promessas" className="topic-row" key={theme.name}>
              <span className={`topic-marker ${theme.color}`} />
              <span>{theme.name}</span>
              <small>{theme.count} registros demonstrativos</small>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className="updates-section">
        <SectionHeading
          eyebrow="Rastreabilidade"
          title="O que mudou recentemente"
          description="Atualizações com data, fonte e motivo — não um feed infinito de notícias."
        />
        <div className="updates-list">
          {updates.map(update => (
            <div className="update-row" key={update.title}>
              <div className="update-date">{update.date}</div>
              <div className="update-type">{update.type}</div>
              <div className="update-main">
                <h3>{update.title}</h3>
                <SourcePill source={update.source} />
              </div>
              <ArrowRight size={17} />
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <Sparkles size={21} />
          <span>Seu olhar. Seu recorte. Sua rota.</span>
        </div>
        <h2>Comece pelo político que você quer acompanhar.</h2>
        <Link href="/buscar" className="button button-primary">
          Explorar agora <ArrowRight size={17} />
        </Link>
      </section>
    </PageShell>
  );
}
