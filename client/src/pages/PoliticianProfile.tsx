import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  Flag,
  GitCompareArrows,
  Landmark,
  Link2,
  MapPin,
  Scale,
  ShieldCheck,
  TrendingUp,
  Vote,
  WalletCards,
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPolitician } from "@/data/demo";
import {
  Breadcrumbs,
  AuditStamp,
  EvidenceNote,
  MetricTile,
  PageShell,
  ProgressBar,
  SectionHeading,
  SourcePill,
  StatusBadge,
  Timeline,
  ToastMessage,
} from "@/components/datademocracia/ui";

export default function PoliticianProfile() {
  const { id } = useParams<{ id: string }>();
  const politician = getPolitician(id)!; // a rota só renderiza com id válido
  const [location] = useLocation();
  // /atuacao e /integridade abrem o perfil já na seção correspondente.
  useEffect(() => {
    const section = location.split("/")[3];
    if (section) document.getElementById(section)?.scrollIntoView();
  }, [location]);
  const [tracked, setTracked] = useState(politician.tracked);
  const [showToast, setShowToast] = useState(false);
  const activePromises = politician.promisesList.filter(
    p => p.status === "Em andamento" || p.status === "Cumprida"
  );
  return (
    <PageShell>
      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Políticos", href: "/buscar" },
          { label: politician.shortName },
        ]}
      />
      <section className="profile-header">
        <div className="profile-person">
          <div
            className="profile-portrait"
            style={{ backgroundImage: `url(${politician.portrait})` }}
          >
            <span className="portrait-status">
              <i /> Registro demonstrativo
            </span>
          </div>
          <div>
            <div className="profile-kicker">
              <Badge variant="outline">
                {politician.type === "candidatura"
                  ? "Candidatura não eleita"
                  : "Em exercício"}
              </Badge>
              <span>{politician.period}</span>
            </div>
            <h1>{politician.name}</h1>
            <p className="profile-role">
              {politician.role} <span>·</span> {politician.party}
            </p>
            <p className="profile-location">
              <MapPin size={15} /> {politician.city}, {politician.state}
            </p>
            <p className="profile-summary">{politician.summary}</p>
          </div>
        </div>
        <div className="profile-actions">
          <Button
            className={tracked ? "button-tracked" : ""}
            onClick={() => {
              setTracked(value => !value);
              setShowToast(true);
            }}
          >
            <Bell size={16} /> {tracked ? "Acompanhando" : "Acompanhar"}
          </Button>
          <Link href="/comparar" className="button button-secondary">
            <GitCompareArrows size={16} /> Comparar
          </Link>
          <Link
            href={`/politico/${politician.id}/dossie`}
            className="button button-secondary"
          >
            Dossiê factual
          </Link>
          <Link
            href={`/politico/${politician.id}/radar`}
            className="button button-secondary"
          >
            Radar analítico
          </Link>
          <button className="icon-action" aria-label="Compartilhar perfil">
            <Link2 size={18} />
          </button>
        </div>
      </section>
      <div className="profile-context-line">
        <span>
          <ShieldCheck size={15} /> Fonte principal: TSE · registro
          demonstrativo
        </span>
        <span>
          <CalendarDays size={15} /> Atualizado em 28 out. 2026
        </span>
        <AuditStamp
          protocol="Registro demonstrativo"
          version="v0.4 demonstrativo"
          reviewedAt="28 out. 2026"
        />
        <Link href="/metodologia">
          Como ler este perfil <ArrowRight size={14} />
        </Link>
      </div>
      <section className="profile-metrics">
        {politician.stats.map((stat, index) => (
          <MetricTile
            key={stat.label}
            label={stat.label}
            value={stat.value}
            note={stat.note}
            icon={
              [CheckCircle2, FileText, Vote, WalletCards][index] ?? FileText
            }
          />
        ))}
      </section>
      <section className="profile-grid">
        <div className="profile-main-column">
          <SectionHeading
            eyebrow="Visão geral"
            title="Um retrato em camadas"
            description="Indicadores separados para que você veja o dado sem confundi-lo com uma avaliação total."
          />
          <div className="profile-overview-block">
            <div className="overview-progress">
              <div className="overview-progress-head">
                <div>
                  <span className="small-label">
                    Promessas com trajetória documentada
                  </span>
                  <strong>
                    {activePromises.length} de {politician.promises}
                  </strong>
                </div>
                <span className="overview-percentage">
                  {Math.round(
                    (activePromises.length / politician.promises) * 100
                  )}
                  %
                </span>
              </div>
              <ProgressBar
                value={Math.round(
                  (activePromises.length / politician.promises) * 100
                )}
                tone="teal"
              />
              <p>
                O número indica apenas a presença de registros de
                acompanhamento, não uma nota sobre o político.
              </p>
            </div>
            <div className="overview-facts">
              <div>
                <span>Eleições</span>
                <strong>{politician.elections}</strong>
                <small>{politician.wins} vitórias</small>
              </div>
              <div>
                <span>Mandatos</span>
                <strong>{politician.mandates}</strong>
                <small>com registro</small>
              </div>
              <div>
                <span>Promessas</span>
                <strong>{politician.promises}</strong>
                <small>no recorte</small>
              </div>
            </div>
          </div>
          <SectionHeading
            eyebrow="Compromissos"
            title="O que foi prometido"
            description="Comece pelo status. Abra cada item para ver a evidência, a competência e o prazo."
            action={
              <Link
                href={`/politico/${politician.id}/promessas`}
                className="text-link"
              >
                Ver todas <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="promise-preview-list">
            {politician.promisesList.slice(0, 3).map(promise => (
              <Link
                href={`/promessa/${promise.id}`}
                className="promise-preview"
                key={promise.id}
              >
                <div className="promise-preview-top">
                  <span className="promise-theme">{promise.theme}</span>
                  <StatusBadge status={promise.status} />
                </div>
                <h3>{promise.title}</h3>
                <div className="promise-progress-row">
                  <ProgressBar
                    value={promise.progress}
                    tone={promise.status === "Prazo crítico" ? "amber" : "teal"}
                  />
                  <span>{promise.progress}%</span>
                </div>
                <div className="promise-preview-foot">
                  <span>
                    <CalendarDays size={13} /> {promise.deadline}
                  </span>
                  <span>{promise.evidence}</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
          <SectionHeading
            id="atuacao"
            eyebrow="Atuação"
            title="O que aparece nos registros"
            description="Métricas compatíveis com o cargo e com o período consultado."
            action={
              <Link
                href={`/politico/${politician.id}/atuacao`}
                className="text-link"
              >
                Abrir atuação <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="activity-grid">
            <div className="activity-card">
              <div className="activity-card-top">
                <span>Presença em sessões</span>
                <Vote size={17} />
              </div>
              <strong>{politician.stats[0].value}</strong>
              <ProgressBar value={92} tone="blue" />
              <small>Legislatura atual · fonte demonstrativa</small>
            </div>
            <div className="activity-card">
              <div className="activity-card-top">
                <span>Proposições</span>
                <FileText size={17} />
              </div>
              <strong>{politician.stats[1].value}</strong>
              <div className="mini-bars">
                <i style={{ height: "42%" }} />
                <i style={{ height: "66%" }} />
                <i style={{ height: "52%" }} />
                <i style={{ height: "84%" }} />
                <i style={{ height: "71%" }} />
                <i style={{ height: "100%" }} />
              </div>
              <small>Distribuição por semestre</small>
            </div>
          </div>
          <SectionHeading
            eyebrow="Trajetória"
            title="O caminho até aqui"
            description="Eventos organizados por data e categoria, sempre ligados ao registro que os sustenta."
          />
          <div className="profile-timeline-wrap">
            <Timeline events={politician.timeline} />
          </div>
          <SectionHeading
            id="integridade"
            eyebrow="Integridade"
            title="Leia cada situação jurídica com precisão"
            description="A plataforma não transforma investigação, denúncia ou processo em condenação."
          />
          <div className="integrity-grid">
            <div className="integrity-card">
              <div className="integrity-card-icon">
                <Scale size={18} />
              </div>
              <div>
                <span>Status jurídico</span>
                <strong>
                  Sem decisão condenatória no recorte demonstrativo
                </strong>
                <small>
                  Esta linha só pode ser alterada com fonte processual
                  verificável.
                </small>
              </div>
            </div>
            <div className="integrity-card">
              <div className="integrity-card-icon amber">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span>Como interpretar</span>
                <strong>Processo não é prova de culpa</strong>
                <small>
                  Consulte número, tribunal, fase, decisão e data antes de
                  concluir.
                </small>
              </div>
            </div>
          </div>
        </div>
        <aside className="profile-side-column">
          <EvidenceNote>
            Este perfil combina registros de candidatura, mandato e documentos
            demonstrativos. Dados ausentes não significam resultado zero.
          </EvidenceNote>
          <div className="side-card">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Próximo marco</span>
                <h3>Mandato em acompanhamento</h3>
              </div>
              <TrendingUp size={19} />
            </div>
            <div className="mandate-progress">
              <div className="mandate-labels">
                <span>Início</span>
                <span>62% transcorrido</span>
                <span>Fim</span>
              </div>
              <div className="mandate-line">
                <i />
                <span />
              </div>
              <p>
                O tempo de mandato é um contexto, não uma previsão de entrega.
              </p>
            </div>
          </div>
          <div className="side-card">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Fontes principais</span>
                <h3>De onde vêm os dados</h3>
              </div>
              <BookOpen size={19} />
            </div>
            <div className="source-list">
              <SourcePill source="Tribunal Superior Eleitoral" />
              <SourcePill source="Câmara dos Deputados" />
              <SourcePill source="Documento de campanha" />
            </div>
            <Link href="/metodologia" className="side-card-link">
              Ver metodologia completa <ArrowRight size={15} />
            </Link>
          </div>
          <div className="side-card side-card-muted">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Integridade</span>
                <h3>Leia com contexto</h3>
              </div>
              <Scale size={19} />
            </div>
            <p>
              Processos, investigações e decisões aparecem em uma seção própria,
              com status jurídico e fonte. Uma relação política não é prova de
              participação em crime.
            </p>
            <Link
              href={`/politico/${politician.id}/integridade`}
              className="side-card-link"
            >
              Abrir integridade <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </section>
      {showToast && (
        <ToastMessage onClose={() => setShowToast(false)}>
          {tracked
            ? "Perfil adicionado ao seu monitoramento."
            : "Perfil removido do seu monitoramento."}
        </ToastMessage>
      )}
    </PageShell>
  );
}
