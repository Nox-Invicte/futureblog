import { useState, useEffect } from "react";
import { getCurrentUser, getSession } from "../lib/auth";
import { useLocation } from "wouter";
import AuthForm from "../components/auth-form";

export default function Auth() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([getCurrentUser(), getSession()]).then(([u, session]) => {
      // Debug logging
      // eslint-disable-next-line no-console
      console.debug('[AUTH PAGE] getCurrentUser:', u, 'getSession:', session);
      // Only set authenticated if user and session are both valid
      setIsAuthenticated(!!u && !!session);
      setIsLoading(false);
    });
  }, []);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Redirect if already authenticated (using useEffect to avoid setState during render)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <main className="pt-20">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="pt-20">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-2xl">✦</span>
                </div>
                <h1 className="text-2xl font-bold text-gradient">FutureBlogs</h1>
              </div>
            </div>
          </div>
          
          <AuthForm mode={mode} onModeChange={setMode} />
        </div>
      </div>
    </main>
  );
}
