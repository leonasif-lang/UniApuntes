import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import PrimaryButton from '../components/PrimaryButton';

export default function DetailScreen({ publication, onBack }) {
  // Estado local para la función Guardar / Favoritos
  const [isSaved, setIsSaved] = useState(false);
  // Estado local para feedback visual de Contactar
  const [contactFeedback, setContactFeedback] = useState(false);

  // Datos de respaldo por si no se reciben props
  const item = publication || {
    id: 1,
    titulo: 'Apuntes de Programación I',
    tipo: 'Apuntes',
    materia: 'Programación',
    autor: 'Daniela',
    rating: 4.9,
    precio: 'GRATIS',
    descripcion:
      'Material de apoyo para estudiantes que cursan Programación I. Incluye conceptos fundamentales, ejemplos y contenidos principales de la materia.',
  };

  const isGratis = item.precio.toUpperCase() === 'GRATIS';

  const handleToggleSave = () => {
    setIsSaved((prev) => !prev);
  };

  const handleContact = () => {
    setContactFeedback(true);
    // Mostrar Alerta estándar nativa
    Alert.alert(
      'Mensaje de UniApuntes',
      'Solicitud de contacto enviada.',
      [
        {
          text: 'Aceptar',
          onPress: () => {
            // Ocultar banner tras aceptar
            setTimeout(() => setContactFeedback(false), 2500);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Encabezado con botón Volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Volver a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de feedback si se envió contacto */}
        {contactFeedback && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color={colors.green} />
            <Text style={styles.successBannerText}>Solicitud de contacto enviada.</Text>
          </View>
        )}

        {/* Tarjeta Principal del Recurso */}
        <View style={styles.mainCard}>
          {/* Etiquetas superiores */}
          <View style={styles.tagRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.tipo}</Text>
            </View>
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectText}>{item.materia}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={15} color={colors.star} />
              <Text style={styles.ratingText}>{item.rating} ⭐</Text>
            </View>
          </View>

          {/* Título de la publicación */}
          <Text style={styles.title}>{item.titulo}</Text>

          {/* Sección del Autor */}
          <View style={styles.authorCard}>
            <View style={styles.authorAvatar}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorLabel}>Publicado por</Text>
              <Text style={styles.authorName}>{item.autor}</Text>
            </View>
          </View>

          {/* Sección de Acceso Gratuito */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Acceso:</Text>
            <Text style={[styles.priceValue, styles.priceGratis]}>
              GRATIS
            </Text>
          </View>

          {/* Separador */}
          <View style={styles.divider} />

          {/* Descripción */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionHeader}>Descripción</Text>
            <Text style={styles.descriptionText}>{item.descripcion}</Text>
          </View>
        </View>

        {/* Información adicional de confianza universitaria */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={styles.infoBoxText}>
            Recurso compartido por la comunidad estudiantil de UniApuntes.
          </Text>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtonsContainer}>
          {/* Botón CONTACTAR */}
          <PrimaryButton
            title="CONTACTAR"
            variant="primary"
            icon={<Ionicons name="chatbubbles-outline" size={20} color={colors.white} />}
            onPress={handleContact}
          />

          {/* Botón GUARDAR con Toggle */}
          <PrimaryButton
            title={isSaved ? '♥ GUARDADO' : '♡ GUARDAR'}
            variant={isSaved ? 'saved' : 'save'}
            icon={
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={20}
                color={isSaved ? colors.white : colors.red}
              />
            }
            onPress={handleToggleSave}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: 8,
  },
  successBannerText: {
    color: '#166534',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  typeBadge: {
    backgroundColor: '#EBF2FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  subjectBadge: {
    backgroundColor: colors.tagBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
  },
  subjectText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    marginLeft: 'auto',
  },
  ratingText: {
    color: '#92400E',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    gap: 12,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorDetails: {
    flex: 1,
  },
  authorLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  authorName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  priceLabel: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  priceValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  priceGratis: {
    color: colors.green,
  },
  pricePaid: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  descriptionSection: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.lg,
    gap: 10,
  },
  infoBoxText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.primaryDark,
    lineHeight: 18,
  },
  actionButtonsContainer: {
    gap: 12,
    marginTop: spacing.xs,
  },
});
