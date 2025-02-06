import React, { createContext, useContext, useState } from "react";

interface FunModeContextType {
  funMode: boolean;
  toggleFunMode: () => void;
}

const FunModeContext = createContext<FunModeContextType | undefined>(undefined);

export function FunModeProvider({ children }: { children: React.ReactNode }) {
  const [funMode, setFunMode] = useState(false);

  const toggleFunMode = () => {
    setFunMode((prev) => !prev);
  };

  return (
    <FunModeContext.Provider value={{ funMode, toggleFunMode }}>
      {children}
    </FunModeContext.Provider>
  );
}

export function useFunMode() {
  const context = useContext(FunModeContext);
  if (context === undefined) {
    throw new Error("useFunMode must be used within a FunModeProvider");
  }
  return context;
}