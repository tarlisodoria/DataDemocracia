import {
  ArrowRight,
  Bell,
  BellRing,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDot,
  Flag,
  Plus,
  Settings2,
  SlidersHorizontal,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { politicians, updates } from "@/data/demo";
import {
  Breadcrumbs,
  PageShell,
  SectionHeading,
  SourcePill,
  StatusBadge,
  ToastMessage,
} from "@/components/datademocracia/ui";

export default function Monitoring() {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [frequency, setFrequency] = useState("Semanal");
  return (
    <PageShell
      eyebrow="Seu espaço"
      title="Meu monitoramento"
      description="Uma rota pessoal para acompanhar pessoas, temas e evidências sem precisar voltar ao ponto zero."
      actions={
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Adicionar monitoramento
        </Button>
      }
    >
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Meu monitoramento" }]}
      />
      <section className="monitoring-summary">
        <div className="monitoring-summary-copy">
          <span className="eyebrow">Seu recorte atual</span>
          <h2>
            Você está acompanhando <em>2 perfis</em> e 3 temas.
          </h2>
          <p>
            Os alertas são baseados em atualizações verificadas. Você escolhe o
            que entra na sua rota.
          </p>
        </div>
        <div className="monitoring-summary-stats">
          <div>
            <strong>12</strong>
            <span>atualizações no mês</span>
          </div>
          <div>
            <strong>02</strong>
            <span>perfis seguidos</span>
          </div>
          <div>
            <strong>03</strong>
            <span>temas seguidos</span>
          </div>
        </div>
      </section>
      <div className="monitoring-grid">
        <main>
          <SectionHeading
            eyebrow="Perfis acompanhados"
            title="O que você escolheu observar"
            action={
              <button
                className="text-button"
                onClick={() => setShowModal(true)}
              >
                <Plus size={15} /> Adicionar
              </button>
            }
          />
          <div className="tracked-list">
            {politicians
              .filter(p => p.tracked || p.id === "helena-costa")
              .map(politician => (
                <div className="tracked-row" key={politician.id}>
                  <div
                    className="tracked-avatar"
                    style={{ backgroundImage: `url(${politician.portrait})` }}
                  />
                  <div className="tracked-info">
                    <div>
                      <h3>{politician.name}</h3>
                      <span>
                        {politician.role} · {politician.state}
                      </span>
                    </div>
                    <div className="tracked-update">
                      <CircleDot size={13} /> 2 atualizações recentes
                    </div>
                  </div>
                  <Link
                    href={`/politico/${politician.id}`}
                    className="icon-link"
                    aria-label={`Abrir ${politician.name}`}
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              ))}
          </div>
          <SectionHeading
            eyebrow="Alertas recentes"
            title="O que mudou na sua rota"
            action={<button className="text-button">Marcar como lidos</button>}
          />
          <div className="alert-list">
            {updates.map((update, index) => (
              <div className="alert-row" key={update.title}>
                <div className={`alert-icon alert-${index}`}>
                  <BellRing size={16} />
                </div>
                <div>
                  <div className="alert-meta">
                    <span>{update.date}</span>
                    <span>{update.type}</span>
                  </div>
                  <h3>{update.title}</h3>
                  <SourcePill source={update.source} />
                </div>
                <ChevronRight size={17} />
              </div>
            ))}
          </div>
        </main>
        <aside>
          <div className="side-card">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Temas acompanhados</span>
                <h3>Seu radar</h3>
              </div>
              <SlidersHorizontal size={18} />
            </div>
            <div className="radar-list">
              <div>
                <span className="topic-marker teal" />
                <span>Transparência</span>
                <strong>8 alertas</strong>
              </div>
              <div>
                <span className="topic-marker coral" />
                <span>Saúde pública</span>
                <strong>5 alertas</strong>
              </div>
              <div>
                <span className="topic-marker amber" />
                <span>Educação</span>
                <strong>3 alertas</strong>
              </div>
            </div>
            <button
              className="side-card-link"
              onClick={() => setShowModal(true)}
            >
              Ajustar temas <ArrowRight size={15} />
            </button>
          </div>
          <div className="side-card">
            <div className="side-card-head">
              <div>
                <span className="eyebrow">Preferências</span>
                <h3>Como receber</h3>
              </div>
              <Settings2 size={18} />
            </div>
            <div className="preference-row">
              <div>
                <strong>Frequência</strong>
                <small>Resumo de atualizações</small>
              </div>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
              >
                <option>Diária</option>
                <option>Semanal</option>
                <option>Mensal</option>
              </select>
            </div>
            <div className="preference-row">
              <div>
                <strong>Fonte</strong>
                <small>Apenas atualizações verificadas</small>
              </div>
              <span className="toggle-on">
                <Check size={13} />
              </span>
            </div>
          </div>
          <div className="side-card support-card">
            <Bell size={19} />
            <h3>Transparência também é sobre controle.</h3>
            <p>
              Você pode pausar, editar ou remover qualquer acompanhamento a
              qualquer momento.
            </p>
            <button className="text-button" onClick={() => setToast(true)}>
              Entendi <ArrowRight size={15} />
            </button>
          </div>
        </aside>
      </div>
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="monitor-modal"
            onClick={event => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <span className="eyebrow">Novo monitoramento</span>
            <h2>O que você quer acompanhar?</h2>
            <p>
              Escolha um recorte. Você poderá alterar suas preferências depois.
            </p>
            <div className="monitor-options">
              <button
                onClick={() => {
                  setShowModal(false);
                  setToast(true);
                }}
              >
                <UsersRound size={18} />
                <span>
                  <strong>Um político</strong>
                  <small>Receba atualizações sobre trajetória e atuação.</small>
                </span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setToast(true);
                }}
              >
                <Flag size={18} />
                <span>
                  <strong>Uma promessa</strong>
                  <small>Observe mudanças de status e novas evidências.</small>
                </span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setToast(true);
                }}
              >
                <CalendarClock size={18} />
                <span>
                  <strong>Um tema ou cidade</strong>
                  <small>Encontre mudanças em um recorte específico.</small>
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <ToastMessage onClose={() => setToast(false)}>
          Monitoramento atualizado. Você pode editar quando quiser.
        </ToastMessage>
      )}
    </PageShell>
  );
}
