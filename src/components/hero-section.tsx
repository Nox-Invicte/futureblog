import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Rocket, BookOpen } from "lucide-react";
import { useAuthStore } from "../lib/auth";

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Futuristic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Future</span>
            <span className="text-foreground">Blogs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover amazing stories, share your thoughts, and connect with writers from around the world in our modern blogging platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="floating-button px-8 py-3" data-testid="button-start-writing">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Writing
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button className="floating-button px-8 py-3" data-testid="button-get-started">
                  <Rocket className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            )}
            <Button 
              variant="outline" 
              className="glass-card hover-glow px-8 py-3"
              data-testid="button-explore-posts"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Explore Posts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
