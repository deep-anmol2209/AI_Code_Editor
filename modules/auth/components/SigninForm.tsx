"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    <div className="flex items-center justify-center min-w-[50%]">
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

          
     
        </CardContent>

 <CardFooter>
<p className="text-sm text-center text-gray-500 dark:text-gray-400 w-full">
  By signing in, you agree to our{" "}
  <a href="#" className="underline hover:text-primary">
    Terms of Service
  </a>{" "}
  and{" "}
  <a href="#" className="underline hover:text-primary">
    Privacy Policy
  </a>
  .
</p>
</CardFooter> 
      </Card>
    </div>
  );
}


