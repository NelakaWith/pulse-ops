"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

/**
 * Represents a GitHub user in the application.
 * Currently stores basic user info from GitHub API validation.
 */
type User = {
  login: string; // GitHub username
  name?: string; // Full name (optional)
  avatarUrl?: string; // Profile picture URL (optional)
};

/**
 * Context value providing user state and authentication actions.
 */
type UserContextType = {
  user: User | null; // Current authenticated user, null if not logged in
  setUser: (user: User | null) => void; // Set user and persist to localStorage
  logout: () => void; // Clear user and localStorage
  isLoading: boolean; // True during initial hydration from localStorage
};

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider manages global authentication state.
 *
 * Features:
 * - Hydration-safe: Initializes to null to prevent server/client mismatches
 * - Persists user to localStorage on login
 * - Restores user from localStorage after mount
 * - Provides isLoading flag for protected routes to show loading states
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  // Initialize to null on both server and client to avoid hydration mismatch
  const [user, setUserState] = useState<User | null>(null);

  // Track loading state during initial localStorage hydration
  const [isLoading, setIsLoading] = useState(true);

  // Track if component is mounted to prevent localStorage access during SSR
  const mountedRef = useRef(false);

  // Hydrate user from localStorage after mount (client-side only)
  // Note: setState in useEffect is intentional here for initial hydration from localStorage.
  // This pattern is necessary to avoid SSR hydration mismatches while still persisting auth state.
  useEffect(() => {
    mountedRef.current = true;
    const storedUser = localStorage.getItem("github_user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserState(parsed);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("github_user");
      }
    }

    // Mark loading complete regardless of whether user was found
    setIsLoading(false);
  }, []);

  /**
   * Set user and sync to localStorage.
   * Only accesses localStorage after component mount to avoid SSR issues.
   */
  const setUser = (newUser: User | null) => {
    setUserState(newUser);

    // Only sync to localStorage if component is mounted (client-side)
    if (mountedRef.current) {
      if (newUser) {
        localStorage.setItem("github_user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("github_user");
      }
    }
  };

  /**
   * Clear user state and remove from localStorage.
   * Used by logout functionality in the sidebar.
   */
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, logout: handleLogout, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to access user context.
 * Must be used within a UserProvider.
 *
 * @throws Error if used outside of UserProvider
 * @returns UserContextType with user state and actions
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
