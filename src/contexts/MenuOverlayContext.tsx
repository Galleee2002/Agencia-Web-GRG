"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MenuOverlayContextValue = {
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const MenuOverlayContext = createContext<MenuOverlayContextValue | null>(null);

export function MenuOverlayProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setMenuOpen = useCallback((open: boolean) => {
    setIsMenuOpen(open);
  }, []);

  const value = useMemo(
    () => ({ isMenuOpen, setMenuOpen }),
    [isMenuOpen, setMenuOpen],
  );

  return (
    <MenuOverlayContext.Provider value={value}>
      {children}
    </MenuOverlayContext.Provider>
  );
}

export function useMenuOverlay() {
  const ctx = useContext(MenuOverlayContext);
  if (!ctx) {
    throw new Error("useMenuOverlay must be used within MenuOverlayProvider");
  }
  return ctx;
}
