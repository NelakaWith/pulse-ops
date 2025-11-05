"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

type User = {
  login: string;
  name?: string;
  avatarUrl?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Always initialize to null on both server and client to avoid hydration mismatch
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(false);

  // Load user from localStorage after hydration
  // This effect runs once on mount to hydrate user state from localStorage
  // The setState calls here are intentional and don't cause cascading renders
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
    setIsLoading(false);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (mountedRef.current) {
      if (newUser) {
        localStorage.setItem("github_user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("github_user");
      }
    }
  };

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

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
