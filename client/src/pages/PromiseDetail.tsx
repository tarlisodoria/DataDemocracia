import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileCheck2,
  FileText,
  Info,
  Landmark,
  Link2,
  MessageSquareQuote,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { allPromises, getPromiseAuditMeta } from "@/data/demo";
import {
  AuditStamp,
  Breadcrumbs,
  EvidenceNote,
  EvidenceChain,
  EvidenceStrengthBadge,
  PageShell,
  ProgressBar,
  ProvenancePanel,
  SourcePill,
  StatusBadge,
} from "@/components/datademocracia/ui";

export default function PromiseDetail() {
  const { id } = useParams<{ id: string }>();
  const promise = allPromises.find(item => item.id === id) ?? allPromises[0];
  const audit = getPromiseAuditMeta(promise);
  return (
    <PageShell>
      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Promessas", href: "/promessas" },
          { label: promise.title },
        ]}
      />
      <Link href="/promessas" className="back-link">
        <ArrowLeft size={15} /> Voltar para promessas
      </Link>
      <section className="promise-detail-header">
        <div>
          <span className="eyebrow">
            {promise.theme} · {promise.politician}
          </span>
          <h1>{promise.title}</h1>
          <p>
            Registro demonstrativo de compromisso de campanha, preparado para
            mostrar como uma promessa deve ser acompanhada.
          </p>
        </div>
        <div className="promise-detail-status">
          <StatusBadge status={promise.status} />
          <EvidenceStrengthBadge strength={audit.strength} />
          <AuditStamp
            protocol={audit.protocol}
            version={audit.version}
            reviewedAt={audit.reviewedAt}
          />
          <span>Atualizado em {promise.updated}</span>
        </div>
      </section>
      <section className="promise-detail-grid">
        <main>
          <div className="evidence-split">
            <section className="evidence-panel original">
              <div className="evidence-panel-label">
                <MessageSquareQuote size={16} /> O que foi prometido
              </div>
              <blockquote>
                “Ampliar a rede de atenção básica em municípios de pequeno
                porte, priorizando o acesso a atendimento especializado.”
              </blockquote>
              <div className="quote-meta">
                <SourcePill
                  source="Proposta de governo · página 18"
                  date="2022"
                />
                <button>
                  <Link2 size={14} /> Abrir documento
                </button>
              </div>
            </section>
            <section className="evidence-panel found">
              <div className="evidence-panel-label">
                <FileCheck2 size={16} /> O que foi encontrado
              </div>
              <div className="found-item">
                <CheckCircle2 size={17} />
                <div>
                  <strong>Registro de ação pública localizado</strong>
                  <p>
                    Publicação demonstrativa indica ampliação de convênio em 12
                    municípios. A relação com a meta original ainda é parcial.
                  </p>
                  <SourcePill
                    source="Ministério demonstrativo"
                    date="12 abr. 2026"
                  />
                </div>
              </div>
              <div className="found-item muted">
                <CircleAlert size={17} />
                <div>
                  <strong>Indicador final ainda não localizado</strong>
                  <p>
                    Não há, neste recorte, documento que confirme o alcance
                    total da meta.
                  </p>
                </div>
              </div>
            </section>
          </div>
          <EvidenceChain
            items={[
              {
                label: "Compromisso registrado",
                date: "2022",
                source: "TSE",
                description:
                  "Trecho localizado na proposta de governo demonstrativa.",
                state: "confirmed",
              },
              {
                label: "Ação ou proposição relacionada",
                date: "12 abr. 2026",
                source: "Órgão público",
                description:
                  "Registro de ação localizado; relação com a meta ainda é parcial.",
                state: "partial",
              },
              {
                label: "Execução orçamentária identificada",
                date: "Em revisão",
                source: "Portal público",
                description:
                  "O vínculo entre dotação e a meta ainda precisa de confirmação documental.",
                state: "pending",
              },
              {
                label: "Entrega ou resultado final",
                date: "Não localizado",
                source: "Busca demonstrativa",
                description:
                  "Nenhum documento confirma o alcance total da promessa neste recorte.",
                state: "absent",
              },
            ]}
          />
          <div className="evidence-strength-line">
            <EvidenceStrengthBadge strength={audit.strength} />
            <span>
              Força não é qualidade do resultado: indica apenas a solidez da
              documentação encontrada.
            </span>
          </div>
          <section className="promise-classification">
            <div className="classification-head">
              <div>
                <span className="evidence-panel-label">
                  <Scale size={16} /> Como o sistema classificou
                </span>
                <h2>Trajetória {promise.trajectory}</h2>
              </div>
              <div className="classification-score">
                {promise.progress}%<small>evidência de avanço</small>
              </div>
            </div>
            <ProgressBar value={promise.progress} tone="teal" />
            <p>
              Esta leitura considera o estágio documentado, o prazo e a
              competência indicada. Não é uma previsão exata nem substitui uma
              avaliação oficial.
            </p>
            <div className="classification-factors">
              <div>
                <span>Prazo</span>
                <strong>{promise.deadline}</strong>
              </div>
              <div>
                <span>Competência</span>
                <strong>{promise.competence}</strong>
              </div>
              <div>
                <span>Evidências</span>
                <strong>{promise.evidence}</strong>
              </div>
            </div>
          </section>
          <section className="evidence-history">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Linha de evidências</div>
                <h2>O que mudou ao longo do tempo</h2>
              </div>
              <button className="sort-button">
                Mais recente <ChevronDown size={15} />
              </button>
            </div>
            <div className="evidence-history-list">
              <div className="history-item">
                <span className="history-date">28 out. 2026</span>
                <div className="history-marker current">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h3>Classificação revisada</h3>
                  <p>
                    O status permaneceu em <strong>{promise.status}</strong>{" "}
                    após nova verificação.
                  </p>
                  <SourcePill source="Revisão DataDemocracia" />
                </div>
              </div>
              <div className="history-item">
                <span className="history-date">12 abr. 2026</span>
                <div className="history-marker">
                  <FileText size={14} />
                </div>
                <div>
                  <h3>Documento de execução localizado</h3>
                  <p>
                    Uma publicação oficial demonstrativa foi anexada ao
                    registro.
                  </p>
                  <SourcePill source="Ministério demonstrativo" />
                </div>
              </div>
              <div className="history-item">
                <span className="history-date">2022</span>
                <div className="history-marker">
                  <MessageSquareQuote size={14} />
                </div>
                <div>
                  <h3>Compromisso registrado</h3>
                  <p>Trecho extraído do documento original de campanha.</p>
                  <SourcePill source="TSE · proposta demonstrativa" />
                </div>
              </div>
            </div>
          </section>
          <div className="correction-callout">
            <ShieldCheck size={19} />
            <div>
              <strong>Encontrou uma nova evidência?</strong>
              <p>
                O envio passa por revisão e não altera automaticamente o dado
                publicado.
              </p>
            </div>
            <Link
              href="/metodologia#correcoes"
              className="button button-secondary"
            >
              Sugerir correção <ArrowRight size={15} />
            </Link>
          </div>
        </main>
        <aside className="promise-detail-side">
          <EvidenceNote>
            O status é uma classificação baseada em documentos e regras
            públicas. Dados ausentes não significam que a promessa não foi
            realizada.
          </EvidenceNote>
          <ProvenancePanel
            source={audit.source}
            sourceDetail={audit.sourceDetail}
            extractedAt={audit.extractedAt}
            reviewedAt={audit.reviewedAt}
            protocol={audit.protocol}
            license={audit.license}
          />
          <div className="side-card">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Metadados</span>
                <h3>Sobre este registro</h3>
              </div>
              <Info size={19} />
            </div>
            <dl className="metadata-list">
              <div>
                <dt>Tipo</dt>
                <dd>Meta / ação</dd>
              </div>
              <div>
                <dt>Prazo</dt>
                <dd>{promise.deadline}</dd>
              </div>
              <div>
                <dt>Órgão responsável</dt>
                <dd>{promise.competence}</dd>
              </div>
              <div>
                <dt>Última revisão</dt>
                <dd>{promise.updated}</dd>
              </div>
              <div>
                <dt>ID do registro</dt>
                <dd>DD-{promise.id.toUpperCase()}</dd>
              </div>
            </dl>
          </div>
          <div className="side-card side-card-muted">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Leitura rápida</span>
                <h3>O que este status não diz</h3>
              </div>
              <Landmark size={19} />
            </div>
            <ul className="plain-list">
              <li>
                <span /> Não mede a qualidade do resultado.
              </li>
              <li>
                <span /> Não atribui mérito exclusivo a uma pessoa.
              </li>
              <li>
                <span /> Não substitui o documento original.
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
