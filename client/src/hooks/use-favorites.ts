import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "maratha_forts_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  }, []);

  // Save to localStorage when updated
  const toggleFavorite = useCallback((fortId: number) => {
    setFavorites((prev) => {
      const isFavorited = prev.includes(fortId);
      const updated = isFavorited 
        ? prev.filter((id) => id !== fortId)
        : [...prev, fortId];
      
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save favorites", e);
      }
      
      return updated;
    });
  }, []);

  const isFavorite = useCallback((fortId: number) => {
    return favorites.includes(fortId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
