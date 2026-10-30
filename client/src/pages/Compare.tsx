import {
  ArrowRight,
  Check,
  FileText,
  GitCompareArrows,
  Info,
  Scale,
  Vote,
  WalletCards,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { politicians } from "@/data/demo";
import {
  Breadcrumbs,
  EvidenceNote,
  PageShell,
  SourcePill,
} from "@/components/datademocracia/ui";

const comparisonRows = [
  {
    label: "Presença em sessões",
    key: "presence",
    values: ["92%", "96%"],
    note: "Legislatura atual",
  },
  {
    label: "Proposições apresentadas",
    key: "proposals",
    values: ["38", "—"],
    note: "Desde o início do mandato",
  },
  {
    label: "Relatorias registradas",
    key: "rapporteur",
    values: ["7", "12"],
    note: "Com registro público",
  },
  {
    label: "Promessas acompanhadas",
    key: "promises",
    values: ["12", "9"],
    note: "No recorte demonstrativo",
  },
  {
    label: "Despesas no recorte",
    key: "expenses",
    values: ["R$ 184 mil", "R$ 96 mil"],
    note: "Ano de 2026",
  },
];

export default function Compare() {
  const [left, setLeft] = useState(politicians[0].id);
  const [right, setRight] = useState(politicians[2].id);
  const leftPerson = politicians.find(p => p.id === left) ?? politicians[0];
  const rightPerson = politicians.find(p => p.id === right) ?? politicians[2];
  return (
    <PageShell
      eyebrow="Análise"
      title="Compare sem transformar pessoas em placar"
      description="Veja registros lado a lado, com o período, o escopo e a fonte de cada métrica."
      actions={
        <Button variant="outline">
          <Scale size={16} /> Como comparar
        </Button>
      }
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Comparar" }]}
      />
      <div className="compare-warning">
        <Info size={17} />
        <p>
          A comparação só é válida quando cargo, período e fonte são
          compatíveis. Atividade não é sinônimo de qualidade total.
        </p>
        <Link href="/metodologia">
          Ver metodologia <ArrowRight size={14} />
        </Link>
      </div>
      <section className="compare-selectors">
        <div className="compare-person-selector">
          <span>Perfil A</span>
          <div className="compare-person-preview">
            <div
              className="compare-avatar"
              style={{ backgroundImage: `url(${leftPerson.portrait})` }}
            />
            <div>
              <strong>{leftPerson.name}</strong>
              <small>
                {leftPerson.role} · {leftPerson.state}
              </small>
            </div>
          </div>
          <select value={left} onChange={e => setLeft(e.target.value)}>
            {politicians.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="compare-symbol">
          <GitCompareArrows size={20} />
          <span>lado a lado</span>
        </div>
        <div className="compare-person-selector">
          <span>Perfil B</span>
          <div className="compare-person-preview">
            <div
              className="compare-avatar"
              style={{ backgroundImage: `url(${rightPerson.portrait})` }}
            />
            <div>
              <strong>{rightPerson.name}</strong>
              <small>
                {rightPerson.role} · {rightPerson.state}
              </small>
            </div>
          </div>
          <select value={right} onChange={e => setRight(e.target.value)}>
            {politicians.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="comparison-table-wrap">
        <div className="comparison-table-head">
          <div>
            <span className="eyebrow">Recorte demonstrativo</span>
            <h2>Indicadores em comum</h2>
          </div>
          <SourcePill source="Câmara · Senado · TSE" date="28 out. 2026" />
        </div>
        <div className="comparison-table">
          <div className="comparison-row comparison-heading">
            <div>Métrica</div>
            <div>
              <strong>{leftPerson.shortName}</strong>
              <small>{leftPerson.period}</small>
            </div>
            <div>
              <strong>{rightPerson.shortName}</strong>
              <small>{rightPerson.period}</small>
            </div>
          </div>
          {comparisonRows.map((row, index) => (
            <div className="comparison-row" key={row.key}>
              <div className="metric-label">
                <span className={`comparison-icon icon-${index}`}>
                  <IconFor index={index} />
                </span>
                <span>
                  {row.label}
                  <small>{row.note}</small>
                </span>
              </div>
              <div className="comparison-value">
                {row.values[0]}
                {index < 4 && (
                  <span className="comparison-bar">
                    <i style={{ width: `${[92, 68, 58, 72, 64][index]}%` }} />
                  </span>
                )}
              </div>
              <div className="comparison-value">
                {row.values[1]}
                {index < 4 && (
                  <span className="comparison-bar">
                    <i style={{ width: `${[96, 0, 83, 52, 48][index]}%` }} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="comparison-foot">
          <span>
            <FileText size={15} /> Dados ausentes aparecem como “—”, nunca como
            zero.
          </span>
          <Link href="/metodologia">
            Ver fórmulas e limitações <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <div className="compare-bottom-grid">
        <EvidenceNote>
          Esta tela oferece comparação factual. O DataDemocracia não atribui uma
          nota geral e não define quem é o “melhor político”.
        </EvidenceNote>
        <div className="side-card">
          <div className="side-card-head">
            <div>
              <span className="eyebrow">Próximos passos</span>
              <h3>Continue investigando</h3>
            </div>
            <Check size={18} />
          </div>
          <div className="quick-links">
            <Link href={`/politico/${leftPerson.id}`}>
              Abrir perfil de {leftPerson.shortName.split(" ")[0]}{" "}
              <ArrowRight size={15} />
            </Link>
            <Link href={`/politico/${rightPerson.id}`}>
              Abrir perfil de {rightPerson.shortName.split(" ")[0]}{" "}
              <ArrowRight size={15} />
            </Link>
            <Link href="/promessas">
              Comparar promessas <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function IconFor({ index }: { index: number }) {
  return index === 0 ? (
    <Vote size={14} />
  ) : index === 4 ? (
    <WalletCards size={14} />
  ) : (
    <FileText size={14} />
  );
}
