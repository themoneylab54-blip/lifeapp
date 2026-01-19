import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import NotificationPrompt from "./components/NotificationPrompt";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { FirebaseAuthProvider } from "./contexts/FirebaseAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavDock from "./components/NavDock";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Chrono from "./pages/Chrono";
import Vision from "./pages/Vision";
import Journal from "./pages/Journal";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <ProtectedRoute>
          <Dashboard />
          <NavDock />
        </ProtectedRoute>
      </Route>
      <Route path="/agenda">
        <ProtectedRoute>
          <Agenda />
          <NavDock />
        </ProtectedRoute>
      </Route>
      <Route path="/chrono">
        <ProtectedRoute>
          <Chrono />
          <NavDock />
        </ProtectedRoute>
      </Route>
      <Route path="/vision">
        <ProtectedRoute>
          <Vision />
          <NavDock />
        </ProtectedRoute>
      </Route>
      <Route path="/journal">
        <ProtectedRoute>
          <Journal />
          <NavDock />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <FirebaseAuthProvider>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
          <TooltipProvider>
            <Toaster />
            {/* <NotificationPrompt /> */}
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </FirebaseAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
