import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layout
import { Shell } from "@/components/layout/Shell";

// Pages
import Home from "@/pages/Home";
import Forts from "@/pages/Forts";
import FortDetail from "@/pages/FortDetail";
import Artifacts from "@/pages/Artifacts";
import Timeline from "@/pages/Timeline";
import Favorites from "@/pages/Favorites";

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/forts" component={Forts} />
        <Route path="/forts/:id" component={FortDetail} />
        <Route path="/artifacts" component={Artifacts} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/favorites" component={Favorites} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
