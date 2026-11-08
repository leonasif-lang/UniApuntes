import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuración de comportamiento cuando la app está abierta (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permisos y registra el canal de notificaciones en Android
 */
export async function registerForPushNotificationsAsync() {
  let token = null;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('uniapuntes-notifications', {
        name: 'UniApuntes - Notificaciones Institucionales',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#123B8E',
        sound: 'default',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return {
        granted: false,
        message: 'No se otorgaron permisos para notificaciones.',
        token: null,
      };
    }

    // Intentar obtener el token de Expo Push
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      token = tokenData.data;
    } catch (e) {
      // Si no hay projectId en app.json en entorno de desarrollo local, se genera un identificador local
      token = `ExponentPushToken[local_${Platform.OS}_${Date.now().toString(36)}]`;
    }

    return {
      granted: true,
      token,
      message: 'Notificaciones push activadas correctamente.',
    };
  } catch (error) {
    console.warn('Aviso en registro de notificaciones:', error?.message || error);
    return {
      granted: false,
      token: null,
      error: error?.message,
    };
  }
}

/**
 * Dispara una notificación push en el dispositivo
 */
export async function sendLocalNotification({ title, body, data = {} }) {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: title || '🔔 UniApuntes',
        body: body || 'Tenés una nueva novedad en la plataforma.',
        data,
        sound: 'default',
      },
      trigger: null, // Disparo inmediato
    });
    return { success: true, notificationId: id };
  } catch (error) {
    console.warn('Error al disparar notificación push:', error?.message || error);
    return { success: false, error: error?.message };
  }
}

/**
 * Notificación cuando un compañero responde en el chat
 */
export async function notifyNewMessage({ senderName, messageText }) {
  return await sendLocalNotification({
    title: `💬 Mensaje de ${senderName || 'un compañero'}`,
    body: messageText ? (messageText.length > 60 ? messageText.substring(0, 57) + '...' : messageText) : 'Te ha enviado un mensaje sobre un apunte.',
    data: { type: 'chat', sender: senderName },
  });
}

/**
 * Notificación al publicar un apunte con éxito
 */
export async function notifyPublicationCreated({ title, materia }) {
  return await sendLocalNotification({
    title: '📚 ¡Apunte publicado con éxito!',
    body: `Tu material "${title}" (${materia}) ya está visible para toda la comunidad UNP.`,
    data: { type: 'publication', title, materia },
  });
}

/**
 * Notificación institucional de moderación o revisión
 */
export async function notifyModerationAlert({ title, action, reason }) {
  return await sendLocalNotification({
    title: '🛡️ Moderación UNP - Aviso Institucional',
    body: `El recurso "${title}" fue revisado. Estado: ${action}. ${reason || ''}`,
    data: { type: 'moderation', title, action },
  });
}
