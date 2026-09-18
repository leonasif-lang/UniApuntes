import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, shadows, spacing } from '../styles/theme';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'save' | 'saved' | 'outline'
  icon,
  style,
  textStyle,
}) {
  const isPrimary = variant === 'primary';
  const isSave = variant === 'save';
  const isSaved = variant === 'saved';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.buttonBase,
        isPrimary && styles.primaryBtn,
        isSave && styles.saveBtn,
        isSaved && styles.savedBtn,
        isOutline && styles.outlineBtn,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.contentRow}>
        {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
        <Text
          style={[
            styles.textBase,
            isPrimary && styles.primaryText,
            isSave && styles.saveText,
            isSaved && styles.savedText,
            isOutline && styles.outlineText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    ...shadows.small,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrapper: {
    marginRight: 2,
  },
  textBase: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  // Variants
  primaryBtn: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
  },
  saveBtn: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.red,
  },
  saveText: {
    color: colors.red,
  },
  savedBtn: {
    backgroundColor: colors.red,
  },
  savedText: {
    color: colors.white,
  },
  outlineBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
});
