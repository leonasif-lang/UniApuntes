import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initialPublications from '../data/publications';
import { db, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, serverTimestamp } from '../services/firebase';

const PublicationsContext = createContext();

const STORAGE_KEY = '@uniapuntes_publications';
const MODERATION_LOGS_KEY = '@uniapuntes_moderation_logs';

export function PublicationsProvider({ children }) {
  const [publications, setPublications] = useState(initialPublications);
  const [moderationLogs, setModerationLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sincronización en tiempo real con Cloud Firestore
  useEffect(() => {
    let unsubscribe = () => {};

    const syncPublications = async () => {
      // 1. Cargar caché local y logs de moderación primero para respuesta inmediata
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPublications(parsed);
          }
        }
        const logsStored = await AsyncStorage.getItem(MODERATION_LOGS_KEY);
        if (logsStored) {
          setModerationLogs(JSON.parse(logsStored));
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
              console.log('Colección vacía. Sembrando datos iniciales en Firestore...');
              try {
                for (const item of initialPublications) {
                  await addDoc(collection(db, 'publicaciones'), {
                    ...item,
                    createdAt: serverTimestamp(),
                    timestamp: Date.now(),
                    fecha: new Date().toLocaleDateString('es-AR'),
                    moderationStatus: 'approved',
                    reportCount: 0,
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
      fileUri: newPub.fileUri || null,
      downloadUrl: newPub.downloadUrl || null,
      peso: newPub.peso || '2.1 MB',
      sede: newPub.sede || 'Sede Pilar',
      cuatrimestre: newPub.cuatrimestre || '1° Cuatrimestre',
      fecha: new Date().toLocaleDateString('es-AR'),
      timestamp: Date.now(),
      moderationStatus: 'approved',
      reportCount: 0,
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

  // Reportar una publicación por derechos de autor o contenido inapropiado
  const reportPublication = async (pubId, reason = 'Violación de derechos de autor', reporter = 'Estudiante') => {
    const reportData = {
      reason,
      reporter,
      date: new Date().toLocaleDateString('es-AR') + ' ' + new Date().toLocaleTimeString('es-AR'),
      timestamp: Date.now(),
    };

    setPublications((prev) =>
      prev.map((p) => {
        if (p.id === pubId) {
          const currentReports = p.reports || [];
          return {
            ...p,
            reported: true,
            reportCount: (p.reportCount || 0) + 1,
            reports: [...currentReports, reportData],
            moderationStatus: 'pending_review',
          };
        }
        return p;
      })
    );

    // Intentar actualizar en Firestore
    try {
      const pubDocRef = doc(db, 'publicaciones', pubId);
      await updateDoc(pubDocRef, {
        reported: true,
        reportCount: (publications.find((p) => p.id === pubId)?.reportCount || 0) + 1,
        moderationStatus: 'pending_review',
      });
    } catch (e) {
      console.warn('Aviso al actualizar reporte en Firestore (guardado local):', e?.message);
    }
  };

  // Moderar publicación (aprobar, ocultar, o dar de baja definitiva)
  const moderatePublication = async (pubId, action, moderatorNote = '', moderatorName = 'Prof. Ariel Bulacio (UNP)') => {
    const targetPub = publications.find((p) => p.id === pubId);
    const logEntry = {
      id: `log-${Date.now()}`,
      pubId,
      pubTitle: targetPub?.titulo || 'Recurso',
      action, // 'approve', 'hide', 'delete'
      moderatorNote,
      moderatorName,
      date: new Date().toLocaleDateString('es-AR') + ' ' + new Date().toLocaleTimeString('es-AR'),
      timestamp: Date.now(),
    };

    const newLogs = [logEntry, ...moderationLogs];
    setModerationLogs(newLogs);
    AsyncStorage.setItem(MODERATION_LOGS_KEY, JSON.stringify(newLogs)).catch(() => {});

    if (action === 'delete') {
      // Eliminar de las publicaciones
      setPublications((prev) => prev.filter((p) => p.id !== pubId));
      try {
        await deleteDoc(doc(db, 'publicaciones', pubId));
      } catch (e) {
        console.warn('Aviso: Eliminado localmente tras error en Firestore:', e?.message);
      }
    } else {
      // Modificar el estado ('approved' o 'hidden')
      const newStatus = action === 'approve' ? 'approved' : 'hidden';
      setPublications((prev) =>
        prev.map((p) => {
          if (p.id === pubId) {
            return {
              ...p,
              reported: action === 'approve' ? false : p.reported,
              moderationStatus: newStatus,
              moderatedAt: Date.now(),
              moderatorNote,
            };
          }
          return p;
        })
      );

      try {
        const pubDocRef = doc(db, 'publicaciones', pubId);
        await updateDoc(pubDocRef, {
          reported: action === 'approve' ? false : true,
          moderationStatus: newStatus,
          moderatorNote,
        });
      } catch (e) {
        console.warn('Aviso al moderar en Firestore:', e?.message);
      }
    }

    return logEntry;
  };

  // Publicaciones visibles para estudiantes (excluye las ocultas o eliminadas)
  const publicPublications = publications.filter(
    (p) => p.moderationStatus !== 'hidden' && p.moderationStatus !== 'deleted'
  );

  // Publicaciones reportadas para el panel de moderación
  const reportedPublications = publications.filter(
    (p) => p.reported || (p.reportCount && p.reportCount > 0) || p.moderationStatus === 'pending_review'
  );

  return (
    <PublicationsContext.Provider
      value={{
        publications: publicPublications,
        allPublications: publications,
        reportedPublications,
        moderationLogs,
        addPublication,
        reportPublication,
        moderatePublication,
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
