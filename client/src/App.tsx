import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/buscar" component={SearchPage} />
      <Route path="/politico/:id/dossie" component={Dossier} />
      <Route path="/politico/:id/radar" component={Radar} />
      <Route path="/politico/:id" component={PoliticianProfile} />
      <Route path="/politico/:id/promessas" component={Promises} />
      <Route path="/politico/:id/atuacao" component={PoliticianProfile} />
      <Route path="/politico/:id/integridade" component={PoliticianProfile} />
      <Route path="/promessas" component={Promises} />
      <Route path="/promessa/:id" component={PromiseDetail} />
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
