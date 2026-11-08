import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Download,
  FileSearch,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDossierData, getPolitician } from "@/data/demo";
import {
  AuditStamp,
  Breadcrumbs,
  EvidenceNote,
  MetricTile,
  PageShell,
  ProgressBar,
  SourcePill,
  StatusBadge,
} from "@/components/datademocracia/ui";

export default function Dossier() {
  const { id } = useParams<{ id: string }>();
  const politician = getPolitician(id);
  const dossier = getDossierData(politician);

  const downloadDossier = () => {
    const payload = {
      produto: "DataDemocracia",
      tipo: "Dossiê factual demonstrativo",
      politico: politician.name,
      atualizadoEm: "28 out. 2026",
      candidaturas: dossier.candidacies,
      indicadores: dossier.indicators,
      integridade: dossier.legalRecords,
      limitacoes: dossier.limitations,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `datademocracia-dossie-${politician.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell>
      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Políticos", href: "/buscar" },
          { label: politician.shortName, href: `/politico/${politician.id}` },
          { label: "Dossiê factual" },
        ]}
      />
      <Link href={`/politico/${politician.id}`} className="back-link">
        <ArrowLeft size={15} /> Voltar ao perfil
      </Link>
      <section className="dossier-hero">
        <div className="dossier-identity">
          <div
            className="dossier-portrait"
            style={{ backgroundImage: `url(${politician.portrait})` }}
          />
          <div>
            <span className="eyebrow">
              <FileSearch size={14} /> Dossiê factual · leitura documental
            </span>
            <h1>Raio-X de {politician.shortName}</h1>
            <p>
              {politician.role} · {politician.party} · {politician.city},{" "}
              {politician.state}
            </p>
            <AuditStamp
              protocol="Registro demonstrativo"
              version="v0.4 demonstrativo"
              reviewedAt="28 out. 2026"
            />
          </div>
        </div>
        <Button variant="outline" onClick={downloadDossier}>
          <Download size={16} /> Exportar dossiê JSON
        </Button>
      </section>
      <section className="dossier-metrics">
        {politician.stats.map((stat, index) => (
          <MetricTile
            key={stat.label}
            label={stat.label}
            value={stat.value}
            note={stat.note}
            icon={[BarChart3, Landmark, Scale, ShieldCheck][index] ?? BarChart3}
          />
        ))}
      </section>
      <div className="dossier-layout">
        <main className="dossier-main">
          <section className="dossier-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Trajetória eleitoral</div>
                <h2>Candidaturas e resultados</h2>
                <p>
                  Histórico demonstrativo organizado por ano, cargo e resultado
                  registrado.
                </p>
              </div>
            </div>
            <div className="candidacy-table">
              <div className="candidacy-table-head">
                <span>Ano</span>
                <span>Cargo disputado</span>
                <span>Resultado</span>
                <span>Fonte</span>
              </div>
              {dossier.candidacies.map(item => (
                <div
                  className="candidacy-row"
                  key={`${item.year}-${item.office}`}
                >
                  <strong>{item.year}</strong>
                  <span>{item.office}</span>
                  <span>{item.result}</span>
                  <SourcePill source={item.source} />
                </div>
              ))}
            </div>
          </section>
          <section className="dossier-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Atuação documentada</div>
                <h2>Indicadores compatíveis com o cargo</h2>
                <p>
                  Os valores não são uma nota geral; cada linha responde a uma
                  pergunta específica.
                </p>
              </div>
            </div>
            <div className="dossier-indicator-list">
              {dossier.indicators.map(item => (
                <div className="dossier-indicator" key={item.label}>
                  <div className="dossier-indicator-head">
                    <div>
                      <span>{item.label}</span>
                      <small>{item.detail}</small>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                  <ProgressBar
                    value={item.progress}
                    tone={item.label.includes("Despesas") ? "amber" : "blue"}
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="dossier-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Distribuição de esforço</div>
                <h2>Temas que aparecem nos registros</h2>
                <p>Recorte demonstrativo da atuação catalogada por tema.</p>
              </div>
            </div>
            <div className="dossier-theme-grid">
              {dossier.themes.map(theme => (
                <div className="dossier-theme-card" key={theme.label}>
                  <div className={`theme-bar ${theme.tone}`} />
                  <span>{theme.label}</span>
                  <strong>{theme.value}</strong>
                  <small>do recorte indexado</small>
                </div>
              ))}
            </div>
          </section>
          <section className="dossier-section" id="integridade">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Integridade e registros públicos</div>
                <h2>Leia o jurídico com contexto</h2>
                <p>
                  O sistema separa consulta, investigação, decisão e condenação
                  definitiva.
                </p>
              </div>
            </div>
            <div className="legal-record-list">
              {dossier.legalRecords.map(record => (
                <div className="legal-record" key={record.type}>
                  <div className="legal-record-icon">
                    <Scale size={17} />
                  </div>
                  <div>
                    <div className="legal-record-top">
                      <strong>{record.type}</strong>
                      <StatusBadge status={record.status} />
                    </div>
                    <p>{record.detail}</p>
                    <SourcePill source={record.source} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <aside className="dossier-side">
          <EvidenceNote>
            Este dossiê reúne registros demonstrativos e não produz uma
            classificação moral ou recomendação de voto.
          </EvidenceNote>
          <div className="side-card">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Patrimônio declarado</span>
                <h3>Valores por eleição</h3>
              </div>
              <Landmark size={19} />
            </div>
            <div className="asset-list">
              {dossier.assets.map(asset => (
                <div className="asset-row" key={asset.year}>
                  <span>{asset.year}</span>
                  <strong>{asset.value}</strong>
                  <small>{asset.status}</small>
                </div>
              ))}
            </div>
            <p className="dossier-footnote">
              Valores demonstrativos. Patrimônio declarado não é patrimônio
              atual nem avaliação de conduta.
            </p>
          </div>
          <div className="side-card side-card-muted">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Limites de escopo</span>
                <h3>O que este dossiê não informa</h3>
              </div>
              <ShieldCheck size={19} />
            </div>
            <ul className="plain-list">
              {dossier.limitations.map(item => (
                <li key={item}>
                  <span /> {item}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={`/politico/${politician.id}/promessas`}
            className="button button-secondary dossier-side-link"
          >
            Ver promessas acompanhadas <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
      <div className="dossier-footer-note">
        <CalendarDays size={17} />
        <span>
          Atualizado em 28 out. 2026 · Fontes demonstrativas ·{" "}
          <Link href="/metodologia">Ver metodologia e correções</Link>
        </span>
      </div>
    </PageShell>
  );
}
