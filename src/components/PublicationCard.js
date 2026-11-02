import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, borderRadius, shadows, spacing } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

export default function PublicationCard({ publication, onPress }) {
  const { colors, isDarkMode } = useTheme();
  const isGratis = (publication.precio || 'GRATIS').toUpperCase() === 'GRATIS';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${publication.titulo}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: isDarkMode ? '#1E3A8A' : '#EBF2FF' },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                { color: isDarkMode ? '#93C5FD' : colors.primary },
              ]}
            >
              {publication.tipo}
            </Text>
          </View>
          <View
            style={[
              styles.subjectBadge,
              { backgroundColor: isDarkMode ? '#334155' : colors.tagBg },
            ]}
          >
            <Text style={[styles.subjectText, { color: colors.textSecondary }]}>
              {publication.materia}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.ratingContainer,
            { backgroundColor: isDarkMode ? '#78350F' : '#FEF3C7' },
          ]}
        >
          <Ionicons name="star" size={14} color={isDarkMode ? '#FDE047' : colors.star} />
          <Text
            style={[
              styles.ratingText,
              { color: isDarkMode ? '#FEF08A' : '#92400E' },
            ]}
          >
            {publication.rating}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.title, { color: colors.textPrimary }]}
        numberOfLines={2}
      >
        {publication.titulo}
      </Text>

      <View
        style={[
          styles.footerRow,
          { borderTopColor: isDarkMode ? '#334155' : '#F0F2F5' },
        ]}
      >
        <View style={styles.authorContainer}>
          <Ionicons
            name="person-circle-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={[styles.authorText, { color: colors.textSecondary }]}>
            {publication.autor}
          </Text>
        </View>

        <View
          style={[
            styles.priceBadge,
            isGratis
              ? isDarkMode
                ? styles.priceGratisDark
                : styles.priceGratis
              : styles.pricePaid,
          ]}
        >
          <Text
            style={[
              styles.priceText,
              isGratis ? styles.priceTextGratis : styles.priceTextPaid,
            ]}
          >
            {publication.precio}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  typeBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  subjectBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  subjectText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  ratingText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
    lineHeight: 22,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  authorText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  priceBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
  },
  priceGratis: {
    backgroundColor: '#DCFCE7',
  },
  priceGratisDark: {
    backgroundColor: '#064E3B',
  },
  pricePaid: {
    backgroundColor: '#EEF2FF',
  },
  priceText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  priceTextGratis: {
    color: '#10B981',
  },
  priceTextPaid: {
    color: '#3B82F6',
  },
});
