// Cabeçalho e rodapé do site no painel de votações, que é uma página fora do app.
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/datademocracia/ui";
import "@/index.css";

// Os links levam ao app em outra página: navegação completa, sem pushState.
const navegacaoCompleta = (): [string, (to: string) => void] => [
  location.pathname,
  to => location.assign(to),
];

for (const [id, Componente] of [
  ["site-header", SiteHeader],
  ["site-footer", SiteFooter],
] as const) {
  createRoot(document.getElementById(id)!).render(
    <Router hook={navegacaoCompleta}>
      <Componente />
    </Router>
  );
}
