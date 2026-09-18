import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../styles/theme';

export default function FilterButton({ label, icon, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.button, isSelected && styles.buttonSelected]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Filtro ${label}`}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={isSelected ? colors.white : colors.textSecondary}
          style={styles.icon}
        />
      ) : null}
      <Text style={[styles.text, isSelected && styles.textSelected]}>{label}</Text>
      <Ionicons
        name="chevron-down"
        size={12}
        color={isSelected ? colors.white : colors.textSecondary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: spacing.sm,
  },
  buttonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    marginRight: 4,
  },
  chevron: {
    marginLeft: 4,
  },
  text: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  textSelected: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
});
