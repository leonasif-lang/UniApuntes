import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { typography, borderRadius, shadows } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

export default function CategoryCard({ icon, title, onPress, isSelected = false }) {
  const { colors, isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isSelected
            ? isDarkMode
              ? '#1E3A8A'
              : '#EEF4FF'
            : colors.cardBg,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Categoría ${title}`}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isSelected
              ? isDarkMode
                ? '#2563EB'
                : '#D9E6FF'
              : isDarkMode
              ? '#334155'
              : colors.tagBg,
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text
        style={[
          styles.title,
          { color: isSelected ? colors.primary : colors.textPrimary },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minWidth: 76,
    flex: 1,
    ...shadows.card,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
});
