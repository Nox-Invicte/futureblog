import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { login, signup, getCurrentUser } from "../lib/auth";
import { useLocation } from "wouter";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type AuthFormData = {
  email: string;
  password: string;
  name?: string;
};

interface AuthFormProps {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<AuthFormData>({
    resolver: zodResolver(mode === "signup" ? signupSchema : signinSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  // Reset form fields when mode changes to prevent duplicate/missing fields
  React.useEffect(() => {
    form.reset({ email: "", password: "", name: "" });
  }, [mode]);


  const authMutation = useMutation({
    mutationFn: async (data: AuthFormData) => {
      if (mode === "signin") {
        console.log('[DEBUG] Sign in button clicked, sending sign in request', data);
        await login(data.email, data.password);
      } else {
        await signup(data.email, data.password, data.name || "");
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: mode === "signin" ? "Signed in successfully!" : "Account created successfully!",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });


  const onSubmit = (data: AuthFormData) => {
    console.log('[DEBUG] onSubmit called', data);
    authMutation.mutate(data);
  };


  return (
    <Card className="glass-card w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {mode === "signin" 
            ? "Sign in to your account to continue" 
            : "Join FutureBlogs and start sharing your stories"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={form.handleSubmit(
            onSubmit,
            (errors) => {
              console.log('[DEBUG] Validation failed', errors);
              console.log('[DEBUG] Current form values', form.getValues());
            }
          )}
          className="space-y-6"
        >
          {mode === "signup" && (
            <div>
              <Label className="text-foreground text-sm font-medium">Name</Label>
              <Input
                {...form.register("name")}
                type="text"
                placeholder="Enter your name"
                className="bg-input border-border focus-visible:ring-ring mt-2"
                data-testid="input-name"
              />
              {form.formState.errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          )}
          
          <div>
            <Label className="text-foreground text-sm font-medium">Email</Label>
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Enter your email"
              className="bg-input border-border focus-visible:ring-ring mt-2"
              data-testid="input-email"
            />
            {form.formState.errors.email && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          <div>
            <Label className="text-foreground text-sm font-medium">Password</Label>
            <Input
              {...form.register("password")}
              type="password"
              placeholder="Enter your password"
              className="bg-input border-border focus-visible:ring-ring mt-2"
              data-testid="input-password"
            />
            {form.formState.errors.password && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full floating-button"
            disabled={authMutation.isPending}
            data-testid="button-submit"
            onClick={() => console.log('[DEBUG] Submit button clicked')}
          >
            {authMutation.isPending 
              ? (mode === "signin" ? "Signing In..." : "Creating Account...") 
              : (mode === "signin" ? "Sign In" : "Create Account")
            }
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => onModeChange(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:text-primary/80 transition-smooth"
              data-testid="button-switch-mode"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
