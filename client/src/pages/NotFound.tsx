import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { PageShell, SearchBox } from "@/components/datademocracia/ui";

const ATALHOS = [
  {
    href: "/buscar",
    rotulo: "Deputados federais",
    nota: "Os 551 com voto em 2025",
  },
  {
    href: "/explorar/votacoes-2025.html",
    rotulo: "Painel de votações",
    nota: "429 votações nominais",
  },
  {
    href: "/comparar",
    rotulo: "Comparar deputados",
    nota: "Dois perfis lado a lado",
  },
  {
    href: "/metodologia",
    rotulo: "Metodologia",
    nota: "Fontes e limites dos dados",
  },
];

// Usada para rotas desconhecidas e para registros que não existem (ex.: /deputado/1).
export default function NotFound() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Página não encontrada · DataDemocracia";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <PageShell>
      <section className="not-found">
        <span className="eyebrow">Erro 404</span>
        <h1>404</h1>
        <p>
          Não encontramos esta página. O endereço pode estar errado ou o
          registro pode ter saído de uma coleta mais recente.
        </p>
        <SearchBox
          onSubmit={q => navigate(`/buscar?q=${encodeURIComponent(q)}`)}
        />
        <ul className="not-found-links">
          {ATALHOS.map(a => {
            const Tag = a.href.endsWith(".html") ? "a" : Link;
            return (
              <li key={a.href}>
                <Tag href={a.href}>
                  <strong>{a.rotulo}</strong>
                  <small>{a.nota}</small>
                  <ArrowRight size={16} />
                </Tag>
              </li>
            );
          })}
        </ul>
      </section>
    </PageShell>
  );
}
