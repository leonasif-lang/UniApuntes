import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

const STORAGE_KEY = '@uniapuntes_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos persistidos al iniciar
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error al cargar favoritos desde AsyncStorage:', error);
      }
    };
    loadFavorites();
  }, []);

  // Guardar en AsyncStorage cada vez que cambien los favoritos
  const saveFavoritesToStorage = async (updated) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error al guardar favoritos en AsyncStorage:', error);
    }
  };

  // Alternar favorito (agregar / quitar)
  const toggleFavorite = (publication) => {
    if (!publication) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => String(item.id) === String(publication.id));
      let updated;
      if (exists) {
        updated = prev.filter((item) => String(item.id) !== String(publication.id));
      } else {
        updated = [publication, ...prev];
      }
      saveFavoritesToStorage(updated);
      return updated;
    });
  };

  // Consultar si un recurso está guardado
  const isFavorite = (publicationId) => {
    return favorites.some((item) => String(item.id) === String(publicationId));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
}

export default FavoritesContext;
