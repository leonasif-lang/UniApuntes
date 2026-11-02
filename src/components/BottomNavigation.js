import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, shadows, spacing } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

export default function BottomNavigation({ currentScreen, onNavigate, onFeatureUnavailable }) {
  const { colors, isDarkMode } = useTheme();

  const tabs = [
    {
      key: 'Home',
      label: 'Inicio',
      iconActive: 'home',
      iconInactive: 'home-outline',
      available: true,
    },
    {
      key: 'Results',
      label: 'Buscar',
      iconActive: 'search',
      iconInactive: 'search-outline',
      available: true,
    },
    {
      key: 'Publish',
      label: 'Publicar',
      iconActive: 'add-circle',
      iconInactive: 'add-circle-outline',
      available: true,
    },
    {
      key: 'Messages',
      label: 'Mensajes',
      iconActive: 'chatbubble',
      iconInactive: 'chatbubble-outline',
      available: true,
    },
    {
      key: 'Profile',
      label: 'Perfil',
      iconActive: 'person',
      iconInactive: 'person-outline',
      available: true,
    },
  ];

  const handleTabPress = (tab) => {
    if (!tab.available) {
      if (onFeatureUnavailable) {
        onFeatureUnavailable(tab.label);
      } else {
        Alert.alert(
          tab.label,
          'Esta funcionalidad estará disponible próximamente.',
          [{ text: 'Entendido' }]
        );
      }
      return;
    }

    if (tab.key === 'Home') {
      onNavigate('Home');
    } else if (tab.key === 'Results') {
      onNavigate('Results', { query: '' });
    } else if (tab.key === 'Publish') {
      onNavigate('Publish');
    } else if (tab.key === 'Messages') {
      onNavigate('Messages');
    } else if (tab.key === 'Profile') {
      onNavigate('Profile');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#1E293B' : '#E5E7EB',
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.key;
        const iconName = isActive ? tab.iconActive : tab.iconInactive;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isActive ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? colors.primary : colors.textSecondary },
                isActive && styles.labelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 24 : spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...shadows.card,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: typography.sizes.xs,
    marginTop: 3,
    fontWeight: typography.weights.medium,
  },
  labelActive: {
    fontWeight: typography.weights.bold,
  },
});
