"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AuthPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [username, setUsername] = useState(user?.login || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setIsLoading(true);

    try {
      // Verify the GitHub user exists by making a simple API call
      const response = await fetch(`https://api.github.com/users/${username}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("GitHub user not found");
        } else {
          setError("Failed to verify GitHub user");
        }
        setIsLoading(false);
        return;
      }

      const userData = await response.json();

      // Update the user context with the GitHub user data
      setUser({
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
      });

      // Redirect to dashboard or home
      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            GitHub Authentication
          </CardTitle>
          <CardDescription>
            Enter your GitHub username to access your repositories and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">GitHub Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="octocat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Continue"}
            </Button>

            {user && (
              <p className="text-center text-sm text-muted-foreground">
                Currently signed in as:{" "}
                <span className="font-medium">{user.login}</span>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthPage;
