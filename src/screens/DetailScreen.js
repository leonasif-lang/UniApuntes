import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import PrimaryButton from '../components/PrimaryButton';
import DarkModeButton from '../components/DarkModeButton';
import { useFavorites } from '../context/FavoritesContext';
import { useMessages } from '../context/MessagesContext';
import { useTheme } from '../context/ThemeContext';

export default function DetailScreen({ publication, onBack, onOpenChat }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { startConversation } = useMessages();
  const { colors, isDarkMode } = useTheme();

  // Modal para la confirmación de contacto
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);

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

  const isSaved = isFavorite(item.id);

  const handleToggleSave = () => {
    toggleFavorite(item);
  };

  const handleContact = () => {
    const conv = startConversation(item);
    setActiveConversation(conv);
    setShowContactModal(true);
  };

  const handleGoToChat = () => {
    setShowContactModal(false);
    if (onOpenChat && activeConversation) {
      onOpenChat(activeConversation);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.cardBg}
      />

      {/* Encabezado con botón Volver y DarkModeButton */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Volver a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Volver</Text>
        </TouchableOpacity>
        <DarkModeButton compact={true} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta Principal del Recurso */}
        <View style={[styles.mainCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          {/* Etiquetas superiores */}
          <View style={styles.tagRow}>
            <View style={[styles.typeBadge, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EBF2FF' }]}>
              <Text style={[styles.typeText, { color: isDarkMode ? '#93C5FD' : colors.primary }]}>
                {item.tipo}
              </Text>
            </View>
            <View style={[styles.subjectBadge, { backgroundColor: isDarkMode ? '#334155' : colors.tagBg }]}>
              <Text style={[styles.subjectText, { color: colors.textSecondary }]}>
                {item.materia}
              </Text>
            </View>
            <View style={[styles.ratingBadge, { backgroundColor: isDarkMode ? '#78350F' : '#FEF3C7' }]}>
              <Ionicons name="star" size={15} color={isDarkMode ? '#FDE047' : colors.star} />
              <Text style={[styles.ratingText, { color: isDarkMode ? '#FEF08A' : '#92400E' }]}>
                {item.rating} ⭐
              </Text>
            </View>
          </View>

          {/* Título de la publicación */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>{item.titulo}</Text>

          {/* Sección del Autor */}
          <View style={[styles.authorCard, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>
            <View style={[styles.authorAvatar, { backgroundColor: isDarkMode ? '#334155' : '#EEF2FF' }]}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={styles.authorDetails}>
              <Text style={[styles.authorLabel, { color: colors.textSecondary }]}>Publicado por</Text>
              <Text style={[styles.authorName, { color: colors.textPrimary }]}>{item.autor}</Text>
            </View>
          </View>

          {/* Sección de Acceso Gratuito */}
          <View style={[styles.priceContainer, { borderTopColor: isDarkMode ? '#334155' : '#E5E7EB' }]}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Acceso:</Text>
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

          {/* Botón GUARDAR con Toggle Persistente */}
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

      {/* Modal de Contacto y Redirección a Chat */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showContactModal}
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="chatbubbles-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>¡Solicitud Enviada!</Text>
            <Text style={styles.modalMessage}>
              Se inició la consulta con <Text style={{ fontWeight: 'bold' }}>{item.autor}</Text> sobre "{item.titulo}". ¿Deseás abrir el chat directo ahora?
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowContactModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Seguir explorando</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleGoToChat}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Abrir Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Modal de Contacto
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 75, 0.5)',
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
  modalIconCircle: {
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
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: colors.tagBg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.xs,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
});
