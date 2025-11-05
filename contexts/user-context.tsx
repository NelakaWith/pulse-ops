"use client";

import React, { createContext, useContext, useState } from "react";

type User = {
  login: string;
  name?: string;
  avatarUrl?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Initialize user from localStorage or default
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;

    const storedUser = localStorage.getItem("github_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("github_user");
      }
    }

    // Set default user for now
    const defaultUser = {
      login: "NelakaWith",
      name: "Nelaka With",
    };
    localStorage.setItem("github_user", JSON.stringify(defaultUser));
    return defaultUser;
  });

  const [isLoading] = useState(false);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("github_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("github_user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, isLoading }}>
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
