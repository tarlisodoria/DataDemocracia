import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { getPolitician, getRadarData } from "@/data/demo";
import { Button } from "@/components/ui/button";
import {
  AuditStamp,
  Breadcrumbs,
  EvidenceNote,
  PageShell,
  ProgressBar,
  SourcePill,
} from "@/components/datademocracia/ui";

const chartSize = 420;
const center = chartSize / 2;
const radius = 145;

function pointFor(index: number, value: number, total: number, scale = radius) {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / total;
  const distance = (value / 100) * scale;
  return [
    center + Math.cos(angle) * distance,
    center + Math.sin(angle) * distance,
  ];
}

function pointsString(values: number[], scale = radius) {
  return values
    .map((value, index) =>
      pointFor(index, value, values.length, scale).join(",")
    )
    .join(" ");
}

export default function Radar() {
  const { id } = useParams<{ id: string }>();
  const politician = getPolitician(id)!; // a rota só renderiza com id válido
  const [period, setPeriod] = useState("2023–2026");
  const data = useMemo(
    () => getRadarData(politician, period),
    [politician, period]
  );
  const values = data.dimensions.map(dimension => dimension.value);

  return (
    <PageShell>
      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Políticos", href: "/buscar" },
          { label: politician.shortName, href: `/politico/${politician.id}` },
          { label: "Radar analítico" },
        ]}
      />
      <Link href={`/politico/${politician.id}`} className="back-link">
        <ArrowLeft size={15} /> Voltar ao perfil
      </Link>
      <section className="radar-header">
        <div>
          <span className="eyebrow">
            <BarChart3 size={14} /> Radar analítico · leitura comparável
          </span>
          <h1>Como a atuação aparece nos dados</h1>
          <p>
            Seis dimensões independentes para contextualizar o registro público
            de {politician.shortName}. Nenhuma delas representa uma nota geral.
          </p>
          <AuditStamp
            protocol="Registro demonstrativo"
            version="v0.4 demonstrativo"
            reviewedAt="28 out. 2026"
          />
        </div>
        <div className="radar-controls">
          <label htmlFor="radar-period">
            <CalendarDays size={14} /> Período consultado
          </label>
          <select
            id="radar-period"
            value={period}
            onChange={event => setPeriod(event.target.value)}
          >
            <option>2023–2026</option>
            <option>2025–2026</option>
            <option>Mandato atual</option>
          </select>
          <Button variant="outline" asChild>
            <Link href={`/politico/${politician.id}/dossie`}>
              Ver dossiê factual
            </Link>
          </Button>
        </div>
      </section>
      <div className="radar-layout">
        <main>
          <section className="radar-chart-card">
            <div className="radar-card-heading">
              <div>
                <span className="eyebrow">Mapa de dimensões</span>
                <h2>Um retrato, não um ranking</h2>
              </div>
              <span className="radar-period-badge">{data.period}</span>
            </div>
            <div className="radar-chart-wrap">
              <svg
                viewBox={`0 0 ${chartSize} ${chartSize}`}
                role="img"
                aria-label={`Radar analítico de ${politician.shortName} no período ${data.period}`}
              >
                {[25, 50, 75, 100].map(level => (
                  <polygon
                    key={level}
                    points={pointsString(data.dimensions.map(() => level))}
                    className="radar-grid"
                  />
                ))}
                {data.dimensions.map((dimension, index) => {
                  const [x, y] = pointFor(index, 100, data.dimensions.length);
                  return (
                    <g key={dimension.key}>
                      <line
                        x1={center}
                        y1={center}
                        x2={x}
                        y2={y}
                        className="radar-axis"
                      />
                      <text
                        x={x}
                        y={y}
                        className="radar-label"
                        textAnchor={
                          x < center - 10
                            ? "end"
                            : x > center + 10
                              ? "start"
                              : "middle"
                        }
                        dominantBaseline={y < center ? "auto" : "hanging"}
                      >
                        {dimension.label}
                      </text>
                    </g>
                  );
                })}
                <polygon
                  points={pointsString(values)}
                  className="radar-value-area"
                />
                {values.map((value, index) => {
                  const [x, y] = pointFor(index, value, values.length);
                  return (
                    <circle
                      key={`${value}-${index}`}
                      cx={x}
                      cy={y}
                      r="4"
                      className="radar-value-dot"
                    />
                  );
                })}
                <text
                  x={center}
                  y={center - 5}
                  textAnchor="middle"
                  className="radar-center-label"
                >
                  6 dimensões
                </text>
                <text
                  x={center}
                  y={center + 13}
                  textAnchor="middle"
                  className="radar-center-note"
                >
                  sem nota geral
                </text>
              </svg>
            </div>
            <div className="radar-legend">
              <span>
                <i className="legend-area" /> Registro demonstrativo
              </span>
              <span>
                <i className="legend-ring" /> Escala normalizada 0–100
              </span>
              <span>
                <Info size={12} /> Despesas: leitura descritiva
              </span>
            </div>
          </section>
          <section className="radar-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Leitura por dimensão</div>
                <h2>O que cada número quer dizer</h2>
                <p>
                  Os valores são acompanhados de unidade, período e fonte para
                  evitar comparações sem contexto.
                </p>
              </div>
            </div>
            <div className="radar-dimension-list">
              {data.dimensions.map(dimension => (
                <div className="radar-dimension" key={dimension.key}>
                  <div className="radar-dimension-head">
                    <div>
                      <strong>{dimension.label}</strong>
                      <small>{dimension.detail}</small>
                    </div>
                    <b>
                      {dimension.value}
                      <em>{dimension.unit}</em>
                    </b>
                  </div>
                  <ProgressBar
                    value={dimension.value}
                    tone={dimension.direction === "lower" ? "amber" : "blue"}
                  />
                  <div className="radar-dimension-foot">
                    <SourcePill source={dimension.source} />
                    <span>
                      {dimension.period} ·{" "}
                      {dimension.direction === "lower"
                        ? "menor pode indicar menor uso relativo"
                        : "maior indica maior registro"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <aside className="radar-side">
          <EvidenceNote>
            O radar organiza indicadores públicos. Ele não mede caráter,
            qualidade da política pública, intenção nem resultado social
            sozinho.
          </EvidenceNote>
          <div className="side-card">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Como interpretar</span>
                <h3>Antes de comparar</h3>
              </div>
              <Info size={19} />
            </div>
            <ul className="plain-list">
              {data.methodology.map(item => (
                <li key={item}>
                  <span /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="side-card side-card-muted">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Fontes do recorte</span>
                <h3>De onde vêm os dados</h3>
              </div>
              <ShieldCheck size={19} />
            </div>
            <div className="radar-sources">
              {data.sources.map(source => (
                <SourcePill key={source} source={source} />
              ))}
            </div>
            <Link href="/metodologia" className="radar-method-link">
              Abrir metodologia completa →
            </Link>
          </div>
        </aside>
      </div>
      <div className="radar-footer-note">
        <ShieldCheck size={16} /> Atualizado em 28 out. 2026 · Registro
        demonstrativo · <Link href="/metodologia">Sugerir correção</Link>
      </div>
    </PageShell>
  );
}
