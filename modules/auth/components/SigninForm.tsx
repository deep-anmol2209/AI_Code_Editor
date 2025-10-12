"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {signIn} from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail } from "lucide-react";


export default function SigninForm() {
  const handleAuth = async (option: string) => {
    signIn(option)
  
  };

  return (
    <div className="flex min-h-screen items-center justify-center min-w-[50%]">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
        {/* Header */}
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to your account
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Provider buttons */}
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => handleAuth("google")}
            >
              <Mail className="w-4 h-4" />
              Sign in with Google
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => handleAuth("github")}
            >
              <Github className="w-4 h-4" />
              Sign in with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-muted" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-muted" />
          </div>

          {/* Email/password form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <Button className="w-full">Sign in</Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a
              href="/auth/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
