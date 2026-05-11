import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const FAVORITES_KEY = "maratha_forts_favorites";

interface FavoritesContextValue {
  favorites: number[];
  toggleFavorite: (fortId: number) => void;
  isFavorite: (fortId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

async function loadFavorites(): Promise<number[]> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key: FAVORITES_KEY });
      return value ? JSON.parse(value) : [];
    } else {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  } catch {
    return [];
  }
}

async function saveFavorites(ids: number[]): Promise<void> {
  try {
    const serialized = JSON.stringify(ids);
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key: FAVORITES_KEY, value: serialized });
    } else {
      localStorage.setItem(FAVORITES_KEY, serialized);
    }
  } catch (e) {
    console.error("Failed to persist favorites", e);
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadFavorites().then((ids) => {
      setFavorites(ids);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveFavorites(favorites);
  }, [favorites, loaded]);

  const toggleFavorite = useCallback((fortId: number) => {
    setFavorites((prev) =>
      prev.includes(fortId) ? prev.filter((id) => id !== fortId) : [...prev, fortId]
    );
  }, []);

  const isFavorite = useCallback(
    (fortId: number) => favorites.includes(fortId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return ctx;
}
