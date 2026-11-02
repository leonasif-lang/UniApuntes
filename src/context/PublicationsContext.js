import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initialPublications from '../data/publications';
import { db, collection, addDoc, onSnapshot, query, serverTimestamp } from '../services/firebase';

const PublicationsContext = createContext();

const STORAGE_KEY = '@uniapuntes_publications';

export function PublicationsProvider({ children }) {
  const [publications, setPublications] = useState(initialPublications);
  const [loading, setLoading] = useState(true);

  // Sincronización en tiempo real con Cloud Firestore
  useEffect(() => {
    let unsubscribe = () => {};

    const syncPublications = async () => {
      // 1. Cargar caché local primero para respuesta inmediata
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPublications(parsed);
          }
        }
      } catch (error) {
        console.warn('Error al leer caché local:', error);
      }

      // 2. Suscribirse a cambios en Firestore en tiempo real
      try {
        const pubRef = collection(db, 'publicaciones');
        const q = query(pubRef);

        unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            if (!snapshot.empty) {
              const cloudPubs = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  ...data,
                };
              });

              // Ordenar por timestamp (más recientes primero)
              cloudPubs.sort((a, b) => {
                const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.timestamp || 0);
                const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.timestamp || 0);
                return timeB - timeA;
              });

              setPublications(cloudPubs);
              AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudPubs)).catch(() => {});
            } else {
              // Si la colección está vacía en Firebase, sembramos las publicaciones iniciales
              console.log('Colección vacía. Sembrando datos iniciales en Firestore...');
              try {
                for (const item of initialPublications) {
                  await addDoc(collection(db, 'publicaciones'), {
                    ...item,
                    createdAt: serverTimestamp(),
                    timestamp: Date.now(),
                    fecha: new Date().toLocaleDateString('es-AR'),
                  });
                }
              } catch (seedErr) {
                console.warn('Aviso al sembrar publicaciones:', seedErr?.message);
              }
            }
            setLoading(false);
          },
          (error) => {
            console.warn('Aviso: Operando en modo local (Firestore offline):', error?.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.warn('Error al iniciar listener de Firestore:', err);
        setLoading(false);
      }
    };

    syncPublications();

    return () => unsubscribe();
  }, []);

  // Agregar una nueva publicación en Cloud Firestore y local
  const addPublication = async (newPub) => {
    const formattedPub = {
      titulo: newPub.titulo,
      tipo: newPub.tipo || 'Apuntes',
      materia: newPub.materia || 'General',
      autor: newPub.autor || 'Estudiante',
      rating: 5.0,
      precio: 'GRATIS',
      descripcion: newPub.descripcion || 'Sin descripción.',
      archivoAdjunto: newPub.archivoAdjunto || null,
      fecha: new Date().toLocaleDateString('es-AR'),
      timestamp: Date.now(),
    };

    // Actualización optimista local inmediata
    const tempId = `pub-${Date.now()}`;
    const optimisticPub = { id: tempId, ...formattedPub };
    setPublications((prev) => [optimisticPub, ...prev]);

    // Subida a Cloud Firestore
    try {
      const docRef = await addDoc(collection(db, 'publicaciones'), {
        ...formattedPub,
        createdAt: serverTimestamp(),
      });
      const persistedPub = { id: docRef.id, ...formattedPub };
      setPublications((prev) =>
        prev.map((p) => (p.id === tempId ? persistedPub : p))
      );
      return persistedPub;
    } catch (error) {
      console.warn('Guardando en almacenamiento local tras error en Firestore:', error?.message);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([optimisticPub, ...publications])).catch(() => {});
      return optimisticPub;
    }
  };

  return (
    <PublicationsContext.Provider
      value={{
        publications,
        addPublication,
        loading,
      }}
    >
      {children}
    </PublicationsContext.Provider>
  );
}

export function usePublications() {
  const context = useContext(PublicationsContext);
  if (!context) {
    throw new Error('usePublications debe usarse dentro de un PublicationsProvider');
  }
  return context;
}

export default PublicationsContext;
