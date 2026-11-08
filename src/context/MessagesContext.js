import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, collection, doc, setDoc, onSnapshot, query, serverTimestamp } from '../services/firebase';
import { notifyNewMessage } from '../services/notifications';

const MessagesContext = createContext();
const STORAGE_KEY = '@uniapuntes_messages';

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    authorName: 'Daniela',
    authorInitial: 'D',
    resourceTitle: 'Apuntes de Programación I',
    resourceSubject: 'Programación',
    lastMessage: '¡Hola! Te compartí los temas de la unidad 1 y 2.',
    lastMessageTime: '14:25',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        text: 'Hola Daniela, vi tus apuntes de Programación I en UniApuntes.',
        sender: 'me',
        time: '14:20',
      },
      {
        id: 'm2',
        text: '¡Hola! Te compartí los temas de la unidad 1 y 2. Si necesitás algo más de la cursada avisame.',
        sender: 'other',
        time: '14:25',
      },
    ],
  },
  {
    id: 'conv-2',
    authorName: 'Maycol',
    authorInitial: 'M',
    resourceTitle: 'Resumen de Matemática Discreta',
    resourceSubject: 'Matemática',
    lastMessage: 'Hola, ¿te sirve para el parcial de esta semana?',
    lastMessageTime: 'Ayer',
    unreadCount: 0,
    messages: [
      {
        id: 'm3',
        text: 'Hola Maycol, ¿el resumen de Matemática Discreta incluye relaciones de equivalencia?',
        sender: 'me',
        time: 'Ayer 18:10',
      },
      {
        id: 'm4',
        text: 'Hola, sí, incluye toda la unidad de relaciones y grafos. ¿Te sirve para el parcial de esta semana?',
        sender: 'other',
        time: 'Ayer 18:14',
      },
    ],
  },
];

export function MessagesProvider({ children }) {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);

  // Sincronización con Firestore y almacenamiento local
  useEffect(() => {
    let unsubscribe = () => {};

    const syncMessages = async () => {
      // 1. Cargar almacenamiento local
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConversations(parsed);
          }
        }
      } catch (err) {
        console.warn('Error leyendo caché de mensajes:', err);
      }

      // 2. Suscribirse a Cloud Firestore
      try {
        const convRef = collection(db, 'conversaciones');
        const q = query(convRef);

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const cloudConvs = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              }));
              setConversations(cloudConvs);
              AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudConvs)).catch(() => {});
            }
          },
          (err) => {
            console.warn('Operando mensajería en modo local:', err?.message);
          }
        );
      } catch (err) {
        console.warn('Error iniciando listener de mensajes:', err);
      }
    };

    syncMessages();
    return () => unsubscribe();
  }, []);

  // Iniciar o encontrar una conversación asociada a una publicación
  const startConversation = (publication) => {
    const existing = conversations.find(
      (c) =>
        c.authorName.toLowerCase() === (publication.autor || '').toLowerCase() &&
        c.resourceTitle.toLowerCase() === (publication.titulo || '').toLowerCase()
    );

    if (existing) {
      return existing;
    }

    const newConversation = {
      id: `conv-${Date.now()}`,
      authorName: publication.autor || 'Estudiante',
      authorInitial: publication.autor ? publication.autor.charAt(0).toUpperCase() : 'E',
      resourceTitle: publication.titulo || 'Recurso académico',
      resourceSubject: publication.materia || 'General',
      lastMessage: 'Solicitud de contacto enviada.',
      lastMessageTime: 'Ahora',
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          text: `¡Hola! Me interesó tu publicación "${publication.titulo}". ¿Podrías compartirme más información?`,
          sender: 'me',
          time: 'Ahora',
        },
      ],
    };

    setConversations((prev) => {
      const updated = [newConversation, ...prev];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    // Guardar en Cloud Firestore
    try {
      setDoc(doc(db, 'conversaciones', newConversation.id), {
        ...newConversation,
        updatedAt: serverTimestamp(),
      }).catch((e) => console.warn('Error guardando conversación en Firestore:', e?.message));
    } catch (e) {}

    return newConversation;
  };

  // Enviar un mensaje dentro de una conversación
  const sendMessage = (conversationId, text) => {
    if (!text || !text.trim()) return;

    const trimmedText = text.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updatedConv = null;

    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            text: trimmedText,
            sender: 'me',
            time: nowTime,
          };
          updatedConv = {
            ...c,
            lastMessage: trimmedText,
            lastMessageTime: nowTime,
            messages: [...c.messages, newMsg],
          };
          return updatedConv;
        }
        return c;
      });

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    // Sincronizar en Cloud Firestore
    if (updatedConv) {
      try {
        setDoc(doc(db, 'conversaciones', conversationId), {
          ...updatedConv,
          updatedAt: serverTimestamp(),
        }).catch((e) => console.warn('Aviso guardando mensaje en Firestore:', e?.message));
      } catch (e) {}
    }

    // Simulación de respuesta automática de cortesía (1.8 seg) para demostraciones
    setTimeout(() => {
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id === conversationId) {
            const replies = [
              '¡Dale, genial! Ahora te paso el archivo.',
              'De una, cualquier duda que tengas avisame por acá.',
              'Sí, está todo actualizado para la cursada de este año.',
              'Genial, nos vemos en la facultad.',
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const autoMsg = {
              id: `msg-${Date.now() + 1}`,
              text: randomReply,
              sender: 'other',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            const withReply = {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: autoMsg.time,
              messages: [...c.messages, autoMsg],
            };

            // Disparar Notificación Push en el dispositivo
            notifyNewMessage({
              senderName: c.authorName || 'Compañero UNP',
              messageText: randomReply,
            }).catch(() => {});

            // Sincronizar respuesta en Firestore
            try {
              setDoc(doc(db, 'conversaciones', conversationId), {
                ...withReply,
                updatedAt: serverTimestamp(),
              }).catch(() => {});
            } catch (e) {}

            return withReply;
          }
          return c;
        });

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
        return updated;
      });
    }, 1800);
  };

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        startConversation,
        sendMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages debe usarse dentro de un MessagesProvider');
  }
  return context;
}

export default MessagesContext;
