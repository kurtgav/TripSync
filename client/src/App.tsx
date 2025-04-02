import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";

// Pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import FindRide from "@/pages/find-ride";
import OfferRide from "@/pages/offer-ride";
import Profile from "@/pages/profile";
import MessagesPage from "@/pages/messages";
import Universities from "@/pages/universities";
import Safety from "@/pages/safety";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/find-ride" component={FindRide} />
      <ProtectedRoute path="/offer-ride" component={OfferRide} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      <ProtectedRoute path="/messages/:userId" component={MessagesPage} />
      <Route path="/universities" component={Universities} />
      <Route path="/safety" component={Safety} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
