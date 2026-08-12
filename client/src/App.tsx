import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { Head } from "./components/Head";
import Home from "./pages/Home";
import Trusts from "./pages/Trusts";
import TrustDetail from "./pages/TrustDetail";
import News from "./pages/News";
import Methodology from "./pages/Methodology";
import About from "./pages/About";
import Corrections from "./pages/Corrections";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import EmbedClock from "./pages/EmbedClock";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trusts" component={Trusts} />
          <Route path="/trusts/:slug" component={TrustDetail} />
      <Route path="/news" component={News} />
      <Route path="/methodology" component={Methodology} />
      <Route path="/about" component={About} />
  <Route path="/corrections" component={Corrections} />
          <Route path="/reports" component={Reports} />
          <Route path="/reports/:id" component={ReportDetail} />
      <Route path="/embed" component={EmbedLanding} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isEmbed = location.startsWith("/embed/clock");

  if (isEmbed) {
    return (
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Switch>
              <Route path="/embed/clock" component={EmbedClock} />
              <Route component={NotFound} />
            </Switch>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Head />
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <SiteNav />
            <main className="flex-1">
              <Router />
            </main>
            <SiteFooter />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
import EmbedLanding from "./pages/EmbedLanding";
