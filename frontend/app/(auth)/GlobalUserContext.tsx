// contexts/GlobalUserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  uid: string;
  email?: string;
  displayName?: string;
};

type GlobalUserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const GlobalUserContext = createContext<GlobalUserContextType | undefined>(
  undefined
);

export function GlobalUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <GlobalUserContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalUserContext.Provider>
  );
}

export function useGlobalUser() {
  const context = useContext(GlobalUserContext);
  if (!context) {
    throw new Error("useGlobalUser must be used inside GlobalUserProvider");
  }
  return context;
}
