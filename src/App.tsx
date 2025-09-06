import React, { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { getCurrentUser } from "./lib/auth";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import PostDetail from "./pages/post-detail";
import Dashboard from "./pages/dashboard";
import Auth from "./pages/auth";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/post/:id" component={PostDetail} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/auth" component={Auth} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  useEffect(() => {
    getCurrentUser();
  }, []);

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
