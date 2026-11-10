import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  BarChart3,
  BadgeCheck,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  CircleCheck,
  CircleDotDashed,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileText,
  Flag,
  GitCompareArrows,
  Landmark,
  LockKeyhole,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  EvidenceStrength,
  PromiseStatus,
  TimelineEvent,
} from "@/data/demo";

export const navItems = [
  { label: "Explorar", href: "/", icon: Search },
  { label: "Políticos", href: "/buscar", icon: UsersRound },
  { label: "Promessas", href: "/promessas", icon: Flag },
  { label: "Comparar", href: "/comparar", icon: GitCompareArrows },
  { label: "Votações", href: "/explorar/votacoes-2025.html", icon: BarChart3 },
  { label: "Monitoramento", href: "/monitoramento", icon: Bell },
  { label: "Metodologia", href: "/metodologia", icon: BookOpen },
];

const isStaticPage = (href: string) => href.endsWith(".html");

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label="DataDemocracia, página inicial"
    >
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {!compact && (
        <span className="wordmark">
          Data<span>Democracia</span>
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map(item => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? location === "/"
                : location.startsWith(item.href.replace(/\.html$/, ""));
            // Painéis em /explorar são páginas estáticas, fora do roteador do app.
            const NavTag = isStaticPage(item.href) ? "a" : Link;
            return (
              <NavTag
                key={item.href}
                href={item.href}
                className={cn("nav-link", active && "active")}
              >
                <Icon size={15} /> {item.label}
              </NavTag>
            );
          })}
        </nav>
        <div className="header-actions">
          <Link
            href="/monitoramento"
            className="header-monitor"
            aria-label="Meu monitoramento"
          >
            <Bell size={17} />
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="header-login"
            disabled
            title="Contas de usuário chegam com o monitoramento persistente"
          >
            <UserRound size={15} /> Entrar
          </Button>
          <button
            className="mobile-menu"
            onClick={() => setOpen(value => !value)}
            aria-label="Abrir menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-nav container">
          {navItems.map(item => {
            const Icon = item.icon;
            const NavTag = isStaticPage(item.href) ? "a" : Link;
            return (
              <NavTag
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="mobile-nav-link"
              >
                <Icon size={17} /> {item.label}
              </NavTag>
            );
          })}
        </div>
      )}
    </header>
  );
}

export function PageShell({
  children,
  eyebrow,
  title,
  description,
  actions,
}: {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="app-shell">
      <div className="demo-notice" role="note">
        Perfis, promessas e evidências são <strong>demonstrativos</strong>. As{" "}
        <a href="/explorar/votacoes-2025.html">votações da Câmara</a> e a busca
        de deputados usam dados oficiais.
      </div>
      <SiteHeader />
      <main className="container page-main">
        {title && (
          <div className="page-intro">
            <div>
              {eyebrow && <div className="eyebrow">{eyebrow}</div>}
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
            {actions && <div className="page-actions">{actions}</div>}
          </div>
        )}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            Dados, contexto e evidências para entender a política brasileira.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/metodologia">Metodologia</Link>
          <Link href="/metodologia#fontes">Fontes</Link>
          <a href="/explorar/votacoes-2025.html">Votações da Câmara em 2025</a>
          <Link href="/metodologia">Apoie e conheça o projeto</Link>
          <span className="footer-credit">
            Projeto criado por Tarliso Doria
          </span>
        </div>
      </div>
    </footer>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="section-heading" id={id}>
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function SourcePill({
  source,
  date,
  tone = "default",
}: {
  source: string;
  date?: string;
  tone?: "default" | "quiet";
}) {
  return (
    <span className={cn("source-pill", tone === "quiet" && "quiet")}>
      <FileCheck2 size={13} /> {source}
      {date ? ` · ${date}` : ""}
    </span>
  );
}

export function AuditStamp({
  protocol,
  version,
  reviewedAt,
}: {
  protocol: string;
  version: string;
  reviewedAt: string;
}) {
  return (
    <span className="audit-stamp" title={`Registro ${protocol}`}>
      <BadgeCheck size={13} />
      <span>{protocol}</span>
      <i />
      <span>{version}</span>
      <i />
      <span>revisado {reviewedAt}</span>
    </span>
  );
}

export function EvidenceStrengthBadge({
  strength,
}: {
  strength: EvidenceStrength;
}) {
  const tone =
    strength === "Forte"
      ? "strong"
      : strength === "Parcial"
        ? "partial"
        : "insufficient";
  return (
    <span className={cn("evidence-strength", tone)}>
      <span className="strength-dot" /> Força da evidência:{" "}
      <strong>{strength}</strong>
    </span>
  );
}

export function ProvenancePanel({
  source,
  sourceDetail,
  extractedAt,
  reviewedAt,
  protocol,
  license,
}: {
  source: string;
  sourceDetail: string;
  extractedAt: string;
  reviewedAt: string;
  protocol: string;
  license: string;
}) {
  return (
    <div className="provenance-panel">
      <div className="provenance-head">
        <div>
          <span className="eyebrow">
            <LockKeyhole size={13} /> Proveniência
          </span>
          <h3>De onde este registro veio</h3>
        </div>
        <BadgeCheck size={19} />
      </div>
      <div className="provenance-source">
        <span className="provenance-source-mark">
          <FileCheck2 size={16} />
        </span>
        <div>
          <strong>{source}</strong>
          <small>{sourceDetail}</small>
        </div>
      </div>
      <dl className="provenance-meta">
        <div>
          <dt>Extração</dt>
          <dd>{extractedAt}</dd>
        </div>
        <div>
          <dt>Revisão</dt>
          <dd>{reviewedAt}</dd>
        </div>
        <div>
          <dt>Protocolo</dt>
          <dd>{protocol}</dd>
        </div>
        <div>
          <dt>Licença</dt>
          <dd>{license}</dd>
        </div>
      </dl>
      <p className="provenance-note">
        Registros demonstrativos não têm protocolo. Na integração com as fontes
        oficiais, este campo mostra o identificador do documento original.
      </p>
    </div>
  );
}

export type EvidenceChainItem = {
  label: string;
  date: string;
  source: string;
  description: string;
  state: "confirmed" | "partial" | "pending" | "absent";
};

export function EvidenceChain({ items }: { items: EvidenceChainItem[] }) {
  return (
    <section className="evidence-chain-card">
      <div className="evidence-chain-heading">
        <div>
          <span className="eyebrow">
            <CircleDotDashed size={14} /> Cadeia de evidências
          </span>
          <h2>Do texto original ao que foi encontrado</h2>
        </div>
        <span>4 marcos de auditoria</span>
      </div>
      <div className="evidence-chain-track">
        {items.map((item, index) => (
          <div
            className={cn("evidence-chain-item", item.state)}
            key={item.label}
          >
            <div className="chain-node">
              {item.state === "confirmed" ? (
                <CircleCheck size={14} />
              ) : item.state === "absent" ? (
                <CircleAlert size={14} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="chain-item-body">
              <div className="chain-item-meta">
                <span>{item.date}</span>
                <span>{item.source}</span>
              </div>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StatusBadge({ status }: { status: PromiseStatus | string }) {
  const icon =
    status === "Cumprida" ? (
      <Check size={12} />
    ) : status === "Prazo crítico" ? (
      <CircleAlert size={12} />
    ) : status === "Sem evidência suficiente" ? (
      <Clock3 size={12} />
    ) : status === "Fora da competência direta" ? (
      <Landmark size={12} />
    ) : (
      <Sparkles size={12} />
    );
  const tone =
    status === "Cumprida"
      ? "success"
      : status === "Prazo crítico"
        ? "warning"
        : status === "Sem evidência suficiente"
          ? "neutral"
          : status === "Fora da competência direta"
            ? "slate"
            : "info";
  return (
    <span className={cn("status-badge", tone)}>
      {icon}
      {status}
    </span>
  );
}

export function MetricTile({
  label,
  value,
  note,
  icon: Icon = FileText,
}: {
  label: string;
  value: string;
  note: string;
  icon?: typeof FileText;
}) {
  return (
    <div className="metric-tile">
      <div className="metric-icon">
        <Icon size={16} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

export function EvidenceNote({
  children,
  source = "Registro demonstrativo",
  date = "28 out. 2026",
}: {
  children: ReactNode;
  source?: string;
  date?: string;
}) {
  return (
    <div className="evidence-note">
      <div className="evidence-note-icon">
        <ShieldCheck size={17} />
      </div>
      <div>
        <strong>Leitura com evidência</strong>
        <p>{children}</p>
        <SourcePill source={source} date={date} tone="quiet" />
      </div>
    </div>
  );
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div className="timeline-item" key={`${event.year}-${event.title}`}>
          <div className={cn("timeline-dot", `kind-${event.kind}`)}>
            {index === 0 ? <Flag size={13} /> : <span />}
          </div>
          <div className="timeline-card">
            <div className="timeline-meta">
              <span>{event.year}</span>
              <span className="timeline-kind">{event.kind}</span>
            </div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <SourcePill source={event.source} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "blue",
}: {
  value: number;
  tone?: "blue" | "teal" | "amber";
}) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}%`}
    >
      <span
        className={`progress-fill ${tone}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <div className="breadcrumbs">
      {items.map((item, index) => (
        <span key={item.label}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {index < items.length - 1 && <ChevronRight size={14} />}
        </span>
      ))}
    </div>
  );
}

export function SearchBox({
  compact = false,
  defaultValue = "",
  onSubmit,
}: {
  compact?: boolean;
  defaultValue?: string;
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <form
      className={cn("search-box", compact && "compact")}
      onSubmit={event => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Search size={compact ? 17 : 21} />
      <input
        value={value}
        onChange={event => setValue(event.target.value)}
        placeholder="Busque um político, cidade, partido, tema ou promessa"
        aria-label="Buscar no DataDemocracia"
      />
      <button type="submit" aria-label="Pesquisar">
        {compact ? <ArrowUpRight size={17} /> : "Pesquisar"}
      </button>
    </form>
  );
}

export function ToastMessage({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="toast-message" role="status">
      <Check size={17} />
      <span>{children}</span>
      <button onClick={onClose} aria-label="Fechar">
        <X size={15} />
      </button>
    </div>
  );
}
