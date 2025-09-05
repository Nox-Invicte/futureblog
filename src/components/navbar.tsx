import React from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, User, PenTool, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="fixed top-0 w-full z-50 nav-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center">
                <PenTool className="text-primary text-2xl mr-3" />
                <h1 className="text-xl font-bold text-gradient">FutureBlogs</h1>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/" data-testid="nav-home">
                <span className={`transition-smooth ${
                  location === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                  Home
                </span>
              </Link>
              {isAuthenticated && (
                <Link href="/dashboard" data-testid="nav-dashboard">
                  <span className={`transition-smooth ${
                    location === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}>
                    Dashboard
                  </span>
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* ...search bar removed... */}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild data-testid="button-user-menu">
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar || undefined} alt={user.user_metadata?.name || user.email} />
                      <AvatarFallback>{(user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.name || user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" data-testid="link-dashboard">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    data-testid="button-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <Button className="floating-button" data-testid="button-signin">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" className="md:hidden" data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
