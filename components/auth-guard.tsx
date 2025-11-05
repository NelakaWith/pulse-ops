"use client";

import { useUser } from "@/contexts/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type AuthGuardProps = {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  redirectToAuth?: boolean;
};

export function AuthGuard({
  children,
  loadingFallback,
  redirectToAuth = false,
}: AuthGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && redirectToAuth) {
      router.push("/auth");
    }
  }, [isLoading, user, redirectToAuth, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <>
        {loadingFallback || (
          <section className="w-full flex items-center justify-center min-h-[400px]">
            <div className="space-y-4">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-64 w-96" />
            </div>
          </section>
        )}
      </>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    if (redirectToAuth) {
      return null; // Will redirect via useEffect
    }

    return (
      <section className="w-full flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-lg mb-4">
              Please log in to view this content
            </p>
            <Link href="/auth">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    );
  }

  return <>{children}</>;
}
