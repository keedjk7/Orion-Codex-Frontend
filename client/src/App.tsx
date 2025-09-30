import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KeycloakProvider } from "@/contexts/KeycloakContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import HomePage from "@/pages/HomePage";
import LoginFigmaInspired from "@/pages/LoginFigmaInspired";
import CEDashboardPage from "@/pages/CEDashboardPage";
import FNDashboardPage from "@/pages/FNDashboardPage";
import InteractiveFeaturesDemo from "@/pages/InteractiveFeaturesDemo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home">
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      </Route>
      <Route path="/login" component={LoginFigmaInspired} />
      <Route path="/ce-dashboard">
        <ProtectedRoute>
          <CEDashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/fn-dashboard">
        <ProtectedRoute>
          <FNDashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/demo" component={InteractiveFeaturesDemo} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <KeycloakProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </KeycloakProvider>
  );
}

export default App;