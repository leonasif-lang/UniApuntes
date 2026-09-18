import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, shadows, spacing } from '../styles/theme';

export default function PublicationCard({ publication, onPress }) {
  const isGratis = publication.precio.toUpperCase() === 'GRATIS';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${publication.titulo}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{publication.tipo}</Text>
          </View>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectText}>{publication.materia}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color={colors.star} />
          <Text style={styles.ratingText}>{publication.rating}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {publication.titulo}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.authorContainer}>
          <Ionicons name="person-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.authorText}>{publication.autor}</Text>
        </View>

        <View style={[styles.priceBadge, isGratis ? styles.priceGratis : styles.pricePaid]}>
          <Text style={[styles.priceText, isGratis ? styles.priceTextGratis : styles.priceTextPaid]}>
            {publication.precio}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: '#EBF2FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  subjectBadge: {
    backgroundColor: colors.tagBg,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  subjectText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  ratingText: {
    color: '#92400E',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 12,
    lineHeight: 22,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  authorText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
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
  pricePaid: {
    backgroundColor: '#EEF2FF',
  },
  priceText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  priceTextGratis: {
    color: colors.green,
  },
  priceTextPaid: {
    color: colors.primary,
  },
});
