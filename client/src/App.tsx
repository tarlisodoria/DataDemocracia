import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { allPromises, getPolitician } from "./data/demo";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SearchPage from "./pages/Search";
import PoliticianProfile from "./pages/PoliticianProfile";
import Promises from "./pages/Promises";
import PromiseDetail from "./pages/PromiseDetail";
import Compare from "./pages/Compare";
import Monitoring from "./pages/Monitoring";
import Methodology from "./pages/Methodology";
import Dossier from "./pages/Dossier";
import Radar from "./pages/Radar";

const TITLES: [string, string][] = [
  ["/buscar", "Políticos"],
  ["/promessa", "Promessas"],
  ["/comparar", "Comparar"],
  ["/monitoramento", "Monitoramento"],
  ["/metodologia", "Metodologia"],
  ["/politico", "Perfil"],
];

function usePageTitle() {
  const [location] = useLocation();
  useEffect(() => {
    const match = TITLES.find(([prefix]) => location.startsWith(prefix));
    document.title = match
      ? `${match[1]} · DataDemocracia`
      : "DataDemocracia — política brasileira sem ruído";
  }, [location]);
}

function Router() {
  usePageTitle();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/buscar" component={SearchPage} />
      <Route path="/politico/:id/dossie">
        {p => (getPolitician(p.id) ? <Dossier /> : <NotFound />)}
      </Route>
      <Route path="/politico/:id/radar">
        {p => (getPolitician(p.id) ? <Radar /> : <NotFound />)}
      </Route>
      <Route path="/politico/:id/promessas">
        {p => (getPolitician(p.id) ? <Promises /> : <NotFound />)}
      </Route>
      <Route path="/politico/:id">
        {p => (getPolitician(p.id) ? <PoliticianProfile /> : <NotFound />)}
      </Route>
      <Route path="/politico/:id/atuacao">
        {p => (getPolitician(p.id) ? <PoliticianProfile /> : <NotFound />)}
      </Route>
      <Route path="/politico/:id/integridade">
        {p => (getPolitician(p.id) ? <PoliticianProfile /> : <NotFound />)}
      </Route>
      <Route path="/promessas" component={Promises} />
      <Route path="/promessa/:id">
        {p =>
          allPromises.some(item => item.id === p.id) ? (
            <PromiseDetail />
          ) : (
            <NotFound />
          )
        }
      </Route>
      <Route path="/comparar" component={Compare} />
      <Route path="/monitoramento" component={Monitoring} />
      <Route path="/metodologia" component={Methodology} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
