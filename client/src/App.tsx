import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KeycloakProvider } from "@/contexts/KeycloakContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import LoginFigmaInspired from "@/pages/LoginFigmaInspired";
import Dashboard from "@/pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginFigmaInspired} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
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
