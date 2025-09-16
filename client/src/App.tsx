import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import FinancialReports from "@/pages/FinancialReportsClean";
import Upload from "@/pages/Upload";
import PlAccount from "@/pages/PlAccount";
import IoMapping from "@/pages/IoMapping";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/financial-reports" component={FinancialReports} />
      <Route path="/upload" component={Upload} />
      <Route path="/pl-account" component={PlAccount} />
      <Route path="/io-mapping" component={IoMapping} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
