import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import DetailScreen from '../screens/DetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import PublishScreen from '../screens/PublishScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';
import BottomNavigation from '../components/BottomNavigation';
import { colors, typography, borderRadius, shadows } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  // Pila de navegación con historial para soportar "Volver"
  const [history, setHistory] = useState([{ screen: 'Home', params: {} }]);

  // Cuando cambia el estado de autenticación (ej: al iniciar sesión), reseteamos el historial a Home
  useEffect(() => {
    if (isAuthenticated) {
      setHistory([{ screen: 'Home', params: {} }]);
    }
  }, [isAuthenticated]);

  // Modal informativo para funcionalidades de etapas posteriores
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFeatureName, setModalFeatureName] = useState('');

  const currentRoute = history[history.length - 1] || { screen: 'Home', params: {} };
  const currentScreen = currentRoute.screen;
  const currentParams = currentRoute.params;

  const navigate = (screenName, params = {}) => {
    setHistory((prev) => [...prev, { screen: screenName, params }]);
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, prev.length - 1);
      }
      return prev;
    });
  };

  const handleTabNavigate = (tabName, params = {}) => {
    if (tabName === 'Home') {
      // Si va a Home desde la barra inferior, reseteamos la pila al Home
      setHistory([{ screen: 'Home', params: {} }]);
    } else if (tabName === 'Results') {
      // Si va a Buscar desde la barra inferior
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.screen === 'Results') return prev;
        return [...prev, { screen: 'Results', params: { query: 'Programación' } }];
      });
    } else if (tabName === 'Publish') {
      // Si va a Publicar desde la barra inferior
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.screen === 'Publish') return prev;
        return [...prev, { screen: 'Publish', params: {} }];
      });
    } else if (tabName === 'Messages') {
      // Si va a Mensajes desde la barra inferior
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.screen === 'Messages') return prev;
        return [...prev, { screen: 'Messages', params: {} }];
      });
    } else if (tabName === 'Profile') {
      // Si va a Perfil desde la barra inferior
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.screen === 'Profile') return prev;
        return [...prev, { screen: 'Profile', params: {} }];
      });
    }
  };

  const handleFeatureUnavailable = (featureName) => {
    setModalFeatureName(featureName);
    setModalVisible(true);
  };

  // Si el usuario no está autenticado, mostramos la pantalla de Login
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View style={styles.rootContainer}>
      {/* Contenedor de la pantalla activa */}
      <View style={styles.screenContainer}>
        {currentScreen === 'Home' && (
          <HomeScreen onNavigate={navigate} />
        )}

        {currentScreen === 'Results' && (
          <ResultsScreen
            query={currentParams.query || 'Programación'}
            onBack={goBack}
            onNavigate={navigate}
          />
        )}

        {currentScreen === 'Detail' && (
          <DetailScreen
            publication={currentParams.publication}
            onBack={goBack}
            onOpenChat={(conv) => navigate('Chat', { conversation: conv })}
          />
        )}

        {currentScreen === 'Publish' && (
          <PublishScreen
            onBack={history.length > 1 ? goBack : () => handleTabNavigate('Home')}
            onPublishSuccess={() => handleTabNavigate('Home')}
          />
        )}

        {currentScreen === 'Messages' && (
          <MessagesScreen
            onOpenChat={(conv) => navigate('Chat', { conversation: conv })}
          />
        )}

        {currentScreen === 'Chat' && (
          <ChatScreen
            conversation={currentParams.conversation}
            onBack={goBack}
          />
        )}

        {currentScreen === 'Profile' && (
          <ProfileScreen
            onBack={history.length > 1 ? goBack : null}
            onSelectPublication={(pub) => navigate('Detail', { publication: pub })}
          />
        )}
      </View>

      {/* Barra de navegación inferior siempre visible en el flujo autenticado */}
      <BottomNavigation
        currentScreen={currentScreen}
        onNavigate={handleTabNavigate}
        onFeatureUnavailable={handleFeatureUnavailable}
      />

      {/* Modal accesible e informativo para próximas funcionalidades */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name="construct-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>{modalFeatureName || 'Próximamente'}</Text>
            <Text style={styles.modalMessage}>
              Esta funcionalidad estará disponible próximamente.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 75, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...shadows.strong,
  },
  modalIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});
