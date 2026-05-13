import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layout
import { Shell } from "@/components/layout/Shell";
import { FavoritesProvider } from "@/contexts/favorites-context";

// Pages
import Home from "@/pages/Home";
import Forts from "@/pages/Forts";
import FortDetail from "@/pages/FortDetail";
import Artifacts from "@/pages/Artifacts";
import ArtifactDetail from "@/pages/ArtifactDetail";
import Stories from "@/pages/Stories";
import StoryDetail from "@/pages/StoryDetail";
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
        <Route path="/artifacts/:id" component={ArtifactDetail} />
        <Route path="/stories" component={Stories} />
        <Route path="/stories/:id" component={StoryDetail} />
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
        <FavoritesProvider>
          <Toaster />
          <Router />
        </FavoritesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
