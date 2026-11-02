import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { typography, borderRadius } from '../styles/theme';

export default function DarkModeButton({ compact = true, style }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactButton,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#EEF2FF',
            borderColor: isDarkMode ? '#334155' : '#D9E6FF',
          },
          style,
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <Ionicons
          name={isDarkMode ? 'sunny' : 'moon'}
          size={18}
          color={isDarkMode ? '#FBBF24' : '#123B8E'}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.fullButton,
        {
          backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
          borderColor: isDarkMode ? '#334155' : '#E2E8F0',
        },
        style,
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDarkMode }}
      accessibilityLabel="Alternar modo oscuro"
    >
      <View style={styles.leftRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: isDarkMode ? '#334155' : '#E0E7FF' },
          ]}
        >
          <Ionicons
            name={isDarkMode ? 'moon' : 'sunny'}
            size={18}
            color={isDarkMode ? '#60A5FA' : '#F59E0B'}
          />
        </View>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Modo Oscuro
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isDarkMode ? 'Activado (Descanso visual)' : 'Desactivado (Tema claro)'}
          </Text>
        </View>
      </View>

      {/* Switch pill indicador */}
      <View
        style={[
          styles.switchPill,
          { backgroundColor: isDarkMode ? '#2563EB' : '#CBD5E1' },
        ]}
      >
        <View
          style={[
            styles.switchCircle,
            isDarkMode ? styles.switchCircleActive : styles.switchCircleInactive,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compactButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginVertical: 4,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  switchPill: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  switchCircleActive: {
    alignSelf: 'flex-end',
  },
  switchCircleInactive: {
    alignSelf: 'flex-start',
  },
});
