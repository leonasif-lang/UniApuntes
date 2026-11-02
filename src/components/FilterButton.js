import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, borderRadius, spacing } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

export default function FilterButton({ label, icon, isSelected, onPress }) {
  const { colors, isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isSelected
            ? colors.primary
            : isDarkMode
            ? '#1E293B'
            : '#FFFFFF',
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Filtro ${label}`}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={isSelected ? '#FFFFFF' : colors.textSecondary}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          styles.text,
          { color: isSelected ? '#FFFFFF' : colors.textPrimary },
          isSelected && styles.textSelected,
        ]}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-down"
        size={12}
        color={isSelected ? '#FFFFFF' : colors.textSecondary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: spacing.sm,
  },
  icon: {
    marginRight: 4,
  },
  chevron: {
    marginLeft: 4,
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  textSelected: {
    fontWeight: typography.weights.semibold,
  },
});
