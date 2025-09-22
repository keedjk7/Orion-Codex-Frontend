import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KeycloakProvider } from "@/contexts/KeycloakContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import FinancialReports from "@/pages/FinancialReportsClean";
import Upload from "@/pages/Upload";
import PlAccount from "@/pages/PlAccount";
import IoMapping from "@/pages/IoMapping";
import CompanyAccount from "@/pages/CompanyAccount";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes - ไม่ต้อง login */}
      <Route path="/" component={Home} />
      
      {/* Protected routes - ต้อง login ก่อน */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/financial-reports">
        <ProtectedRoute>
          <FinancialReports />
        </ProtectedRoute>
      </Route>
      
      <Route path="/upload">
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      </Route>
      
      <Route path="/pl-account">
        <ProtectedRoute>
          <PlAccount />
        </ProtectedRoute>
      </Route>
      
      <Route path="/io-mapping">
        <ProtectedRoute>
          <IoMapping />
        </ProtectedRoute>
      </Route>
      
      <Route path="/company-account">
        <ProtectedRoute>
          <CompanyAccount />
        </ProtectedRoute>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
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
