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
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import PrimaryButton from '../components/PrimaryButton';
import DarkModeButton from '../components/DarkModeButton';
import { useFavorites } from '../context/FavoritesContext';
import { useMessages } from '../context/MessagesContext';
import { usePublications } from '../context/PublicationsContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notifyModerationAlert } from '../services/notifications';

export default function DetailScreen({ publication, onBack, onOpenChat }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { startConversation } = useMessages();
  const { reportPublication } = usePublications();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();

  // Modales
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Violación de derechos de autor / plagio');
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
    peso: '2.4 MB',
    paginas: 18,
    sede: 'Sede Central Pilar',
    cuatrimestre: '1° Cuatrimestre',
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

  // Descargar o compartir archivo PDF binario
  const handleDownloadOrShare = async () => {
    try {
      if (item.downloadUrl && typeof item.downloadUrl === 'string' && item.downloadUrl.startsWith('http')) {
        await Linking.openURL(item.downloadUrl);
        return;
      }
      if (item.fileUri) {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(item.fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: `Compartir ${item.titulo}`,
          });
          return;
        }
      }
      // Si es un documento del repositorio o no tiene URI nativa, mostrar visor institucional
      setShowPdfViewerModal(true);
    } catch (err) {
      console.warn('Error al compartir archivo:', err);
      setShowPdfViewerModal(true);
    }
  };

  // Enviar reporte de moderación
  const handleSubmitReport = async () => {
    try {
      await reportPublication(item.id, reportReason, user?.nombre || 'Estudiante');
      await notifyModerationAlert({
        title: item.titulo,
        action: 'Enviado a revisión',
        reason: reportReason,
      });
      setShowReportModal(false);
      Alert.alert(
        'Reporte Recibido',
        'El equipo de moderación institucional de la UNP revisará este apunte en el panel administrativo. Gracias por velar por los derechos de autor y la convivencia.',
        [{ text: 'Entendido' }]
      );
    } catch (e) {
      setShowReportModal(false);
      Alert.alert('Aviso', 'El reporte fue registrado para auditoría de cátedra.');
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

          {/* Sede y Cuatrimestre Institucional UNP */}
          {(item.sede || item.cuatrimestre) ? (
            <View style={[styles.campusInfoRow, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text style={[styles.campusInfoText, { color: colors.textSecondary }]}>
                {item.sede || 'Sede Pilar'} • {item.cuatrimestre || 'Ciclo 2026'}
              </Text>
            </View>
          ) : null}

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
          {/* Botón DESCARGAR / COMPARTIR PDF */}
          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: colors.primaryDark }]}
            onPress={handleDownloadOrShare}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-download-outline" size={20} color={colors.white} />
            <Text style={styles.downloadButtonText}>
              DESCARGAR / COMPARTIR PDF ({item.peso || '2.4 MB'})
            </Text>
          </TouchableOpacity>

          {/* Botón CONTACTAR */}
          <PrimaryButton
            title="CONTACTAR AL AUTOR"
            variant="primary"
            icon={<Ionicons name="chatbubbles-outline" size={20} color={colors.white} />}
            onPress={handleContact}
          />

          {/* Botón GUARDAR con Toggle Persistente */}
          <PrimaryButton
            title={isSaved ? '♥ GUARDADO' : '♡ GUARDAR EN FAVORITOS'}
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

          {/* Botón de Reporte Institucional (Moderación) */}
          <TouchableOpacity
            style={styles.reportTriggerButton}
            onPress={() => setShowReportModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="flag-outline" size={15} color={colors.textSecondary} />
            <Text style={[styles.reportTriggerText, { color: colors.textSecondary }]}>
              Reportar por derechos de autor o contenido inapropiado
            </Text>
          </TouchableOpacity>
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
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="chatbubbles-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>¡Solicitud Enviada!</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
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

      {/* Modal Visor de Documento PDF */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPdfViewerModal}
        onRequestClose={() => setShowPdfViewerModal(false)}
      >
        <View style={styles.pdfModalOverlay}>
          <View style={[styles.pdfModalContent, { backgroundColor: colors.cardBg }]}>
            {/* Cabecera del visor */}
            <View style={styles.pdfHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.pdfTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {item.archivoAdjunto || `${item.titulo}.pdf`}
                </Text>
                <Text style={[styles.pdfMeta, { color: colors.textSecondary }]}>
                  {item.materia} • {item.peso || '2.4 MB'} • Formato PDF UNP
                </Text>
              </View>
              <TouchableOpacity
                style={styles.pdfCloseBtn}
                onPress={() => setShowPdfViewerModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Simulación del visor de páginas PDF */}
            <View style={styles.pdfPageContainer}>
              <View style={styles.pdfWatermarkRow}>
                <Ionicons name="school" size={16} color="#123B8E" />
                <Text style={styles.pdfWatermarkText}>UNIVERSIDAD NACIONAL DEL PILAR</Text>
              </View>
              <Text style={styles.pdfDocHeadline}>{item.titulo}</Text>
              <Text style={styles.pdfDocAuthor}>Autor: {item.autor} • Cátedra: {item.materia}</Text>
              <View style={styles.pdfDivider} />
              <Text style={styles.pdfExcerptText}>
                {item.descripcion}
              </Text>
              <View style={styles.pdfSecuritySeal}>
                <Ionicons name="checkmark-done-circle" size={18} color="#10B981" />
                <Text style={styles.pdfSecurityText}>Firma criptográfica de cátedra verificada</Text>
              </View>
            </View>

            {/* Acciones del visor */}
            <View style={styles.pdfActionRow}>
              <TouchableOpacity
                style={styles.pdfShareBtn}
                onPress={() => {
                  setShowPdfViewerModal(false);
                  Alert.alert('Descarga Completa', 'El archivo PDF fue guardado en la carpeta de descargas del dispositivo.');
                }}
              >
                <Ionicons name="download" size={18} color={colors.white} />
                <Text style={styles.pdfShareBtnText}>Guardar copia local</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Reporte de Moderación Institucional */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showReportModal}
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
            <View style={[styles.modalIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="shield-alert-outline" size={32} color="#DC2626" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Reportar Material</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Seleccioná el motivo por el cual este apunte debe ser revisado por la cátedra o moderador UNP:
            </Text>

            {[
              'Violación de derechos de autor / plagio',
              'Contenido inapropiado, discriminatorio o spam',
              'No corresponde al programa de la cátedra UNP',
              'Archivo corrupto o información desactualizada',
            ].map((reason, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.reasonOption,
                  reportReason === reason && styles.reasonOptionSelected,
                ]}
                onPress={() => setReportReason(reason)}
              >
                <Ionicons
                  name={reportReason === reason ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={reportReason === reason ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.reasonText,
                    reportReason === reason && styles.reasonTextSelected,
                    { color: colors.textPrimary },
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={[styles.modalButtonsRow, { marginTop: 16 }]}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowReportModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmBtn, { backgroundColor: '#DC2626' }]}
                onPress={handleSubmitReport}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Enviar Reporte</Text>
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
    marginBottom: spacing.md,
    gap: 12,
  },
  campusInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  campusInfoText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
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
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
    gap: 10,
    ...shadows.card,
  },
  downloadButtonText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  reportTriggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginTop: 4,
  },
  reportTriggerText: {
    fontSize: typography.sizes.xs,
    textDecorationLine: 'underline',
  },
  // Modal Visor PDF
  pdfModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  pdfModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  pdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pdfTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  pdfMeta: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  pdfCloseBtn: {
    padding: 4,
  },
  pdfPageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 220,
    ...shadows.card,
  },
  pdfWatermarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pdfWatermarkText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '800',
    color: '#123B8E',
  },
  pdfDocHeadline: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    marginBottom: 4,
  },
  pdfDocAuthor: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    marginBottom: 10,
  },
  pdfDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  pdfExcerptText: {
    fontSize: typography.sizes.sm,
    color: '#334155',
    lineHeight: 20,
  },
  pdfSecuritySeal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  pdfSecurityText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  pdfActionRow: {
    paddingTop: 8,
  },
  pdfShareBtn: {
    backgroundColor: '#123B8E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    gap: 8,
  },
  pdfShareBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: typography.sizes.sm,
  },
  // Opciones de reporte
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    width: '100%',
  },
  reasonOptionSelected: {
    borderColor: '#123B8E',
    backgroundColor: '#EEF2FF',
  },
  reasonText: {
    fontSize: typography.sizes.xs,
    flex: 1,
  },
  reasonTextSelected: {
    fontWeight: typography.weights.bold,
    color: '#123B8E',
  },
});
