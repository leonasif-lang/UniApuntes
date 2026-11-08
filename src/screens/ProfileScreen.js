import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import DarkModeButton from '../components/DarkModeButton';
import TermsModal from '../components/TermsModal';
import DisclaimerModal from '../components/DisclaimerModal';
import OnboardingModal from '../components/OnboardingModal';
import ModerationModal from '../components/ModerationModal';
import { sendLocalNotification, registerForPushNotificationsAsync } from '../services/notifications';

export default function ProfileScreen({ onBack, onSelectPublication }) {
  const { user, logout } = useAuth();
  const { favorites, favoritesCount } = useFavorites();
  const { colors, isDarkMode } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);

  const handleTestPushNotification = async () => {
    try {
      await registerForPushNotificationsAsync();
      await sendLocalNotification({
        title: '🔔 Notificación Institucional UNP',
        body: '¡El canal de notificaciones push está 100% activo en Expo SDK 58!',
        data: { origin: 'profile_test' },
      });
      Alert.alert(
        'Notificación Enviada',
        'Se envió la notificación a tu teléfono. Verificá la barra superior de estado de tu dispositivo.'
      );
    } catch (e) {
      Alert.alert('Aviso', 'Notificación generada en el dispositivo.');
    }
  };

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const initial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.cardBg}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mi Perfil</Text>
        <DarkModeButton compact={true} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de Identidad del Estudiante */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>{user?.nombre || 'Estudiante'}</Text>
          <Text style={[styles.userCareer, { color: colors.textSecondary }]}>
            {user?.carrera || 'Tecnicatura en Desarrollo de Software'}
          </Text>

          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Ionicons name="school" size={14} color={colors.primary} />
              <Text style={styles.roleBadgeText}>
                {user?.isGuest ? 'Modo Invitado' : 'Estudiante Activo'}
              </Text>
            </View>
          </View>
        </View>

        {/* Métricas Académicas */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Ionicons name="heart" size={22} color={colors.red} />
            <Text style={styles.metricNumber}>{favoritesCount}</Text>
            <Text style={styles.metricLabel}>
              {favoritesCount === 1 ? 'Guardado' : 'Guardados'}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="book-outline" size={22} color={colors.primary} />
            <Text style={styles.metricNumber}>4</Text>
            <Text style={styles.metricLabel}>Consultados</Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="star-outline" size={22} color={colors.star} />
            <Text style={styles.metricNumber}>4.9</Text>
            <Text style={styles.metricLabel}>Reputación</Text>
          </View>
        </View>

        {/* Sección: Mis Recursos Guardados (Favoritos) */}
        <View style={styles.favoritesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Mis Apuntes Guardados</Text>
            <View style={styles.favCountBadge}>
              <Text style={styles.favCountText}>{favoritesCount}</Text>
            </View>
          </View>

          {favorites.length === 0 ? (
            <View style={styles.emptyFavorites}>
              <Ionicons name="heart-dislike-outline" size={32} color={colors.textSecondary} />
              <Text style={styles.emptyFavTitle}>No tenés apuntes guardados</Text>
              <Text style={styles.emptyFavSubtitle}>
                Tocá el botón ♡ GUARDAR en cualquier apunte o resumen para consultarlo acá en cualquier momento.
              </Text>
            </View>
          ) : (
            <View style={styles.favList}>
              {favorites.map((fav) => (
                <TouchableOpacity
                  key={fav.id}
                  style={styles.favCard}
                  onPress={() => onSelectPublication && onSelectPublication(fav)}
                  activeOpacity={0.7}
                >
                  <View style={styles.favIconWrapper}>
                    <Ionicons name="document-text" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.favInfo}>
                    <Text style={styles.favTitle} numberOfLines={1}>
                      {fav.titulo}
                    </Text>
                    <Text style={styles.favMeta}>
                      {fav.materia} • Por {fav.autor}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Información Académica */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Universitaria</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIconWrapper}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoLabel}>Correo Institucional</Text>
              <Text style={styles.infoValue}>{user?.email || 'estudiante@unp.edu.ar'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconWrapper}>
              <Ionicons name="business-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoLabel}>Institución</Text>
              <Text style={styles.infoValue}>
                {user?.universidad || 'Universidad Nacional del Pilar'}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconWrapper}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoLabel}>Año Lectivo / Cátedra</Text>
              <Text style={styles.infoValue}>2026 — Aplicaciones Móviles</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconWrapper}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoLabel}>Docente a cargo</Text>
              <Text style={styles.infoValue}>Prof. Ariel Bulacio</Text>
            </View>
          </View>
        </View>

        {/* Preferencias de la Aplicación */}
        <View style={[styles.infoSection, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Configuración de Apariencia</Text>
          <DarkModeButton compact={false} />
        </View>

        {/* Normas Universitarias y Documentación */}
        <View style={[styles.infoSection, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Normas e Información UNP</Text>
          
          {/* Términos */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setShowTermsModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.termsRowLeft}>
              <View style={[styles.termsIconCircle, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EEF2FF' }]}>
                <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.termsRowTitle, { color: colors.textPrimary }]}>
                  Términos y Condiciones
                </Text>
                <Text style={[styles.termsRowSubtitle, { color: colors.textSecondary }]}>
                  Gratuidad, autoría y pautas académicas
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.innerDivider, { backgroundColor: colors.border }]} />

          {/* Disclaimer */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setShowDisclaimerModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.termsRowLeft}>
              <View style={[styles.termsIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="information-circle-outline" size={18} color="#D97706" />
              </View>
              <View>
                <Text style={[styles.termsRowTitle, { color: colors.textPrimary }]}>
                  Aviso Académico (Disclaimer)
                </Text>
                <Text style={[styles.termsRowSubtitle, { color: colors.textSecondary }]}>
                  Proyecto de cátedra • No reemplaza SIU Guaraní
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.innerDivider, { backgroundColor: colors.border }]} />

          {/* Onboarding */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setShowOnboardingModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.termsRowLeft}>
              <View style={[styles.termsIconCircle, { backgroundColor: isDarkMode ? '#1E293B' : '#F3E8FF' }]}>
                <Ionicons name="sparkles" size={18} color="#8B5CF6" />
              </View>
              <View>
                <Text style={[styles.termsRowTitle, { color: colors.textPrimary }]}>
                  Ver Guía de Bienvenida
                </Text>
                <Text style={[styles.termsRowSubtitle, { color: colors.textSecondary }]}>
                  Repasar qué es y cómo usar UniApuntes
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.innerDivider, { backgroundColor: colors.border }]} />

          {/* Panel de Moderación Institucional (Prof. Ariel Bulacio / Cátedra UNP) */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setShowModerationModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.termsRowLeft}>
              <View style={[styles.termsIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="shield-checkmark" size={18} color="#123B8E" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.termsRowTitle, { color: colors.textPrimary }]}>
                    Panel de Moderación UNP
                  </Text>
                  <View style={styles.adminBadgePill}>
                    <Text style={styles.adminBadgePillText}>Docente</Text>
                  </View>
                </View>
                <Text style={[styles.termsRowSubtitle, { color: colors.textSecondary }]}>
                  Revisión de reportes, bajas y autoría de cátedra
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.innerDivider, { backgroundColor: colors.border }]} />

          {/* Prueba de Notificaciones Push */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={handleTestPushNotification}
            activeOpacity={0.7}
          >
            <View style={styles.termsRowLeft}>
              <View style={[styles.termsIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="notifications-outline" size={18} color="#15803D" />
              </View>
              <View>
                <Text style={[styles.termsRowTitle, { color: colors.textPrimary }]}>
                  Probar Notificación Push (SDK 58)
                </Text>
                <Text style={[styles.termsRowSubtitle, { color: colors.textSecondary }]}>
                  Disparar alerta en la barra de notificaciones del celular
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.innerDivider, { backgroundColor: colors.border }]} />

          {/* Backend Info */}
          <View style={styles.backendRow}>
            <View style={styles.backendDot} />
            <Text style={[styles.backendLabel, { color: colors.textSecondary }]}>
              Backend: Google Firebase (Cloud Firestore & Auth) Activo
            </Text>
          </View>
        </View>

        {/* Botón de Cierre de Sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogoutPress}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.red} />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal interactivo de Confirmación de Cierre de Sesión */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="log-out-outline" size={32} color={colors.red} />
            </View>

            <Text style={styles.modalTitle}>¿Cerrar Sesión?</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseás salir de tu cuenta en UniApuntes? Vas a poder volver a iniciar sesión cuando quieras.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Sí, Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modales Informativos, Normativa y Moderación */}
      <TermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <DisclaimerModal visible={showDisclaimerModal} onClose={() => setShowDisclaimerModal(false)} />
      <OnboardingModal visible={showOnboardingModal} onFinish={() => setShowOnboardingModal(false)} />
      <ModerationModal visible={showModerationModal} onClose={() => setShowModerationModal(false)} />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.small,
  },
  avatarInitial: {
    color: colors.white,
    fontSize: 32,
    fontWeight: typography.weights.bold,
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userCareer: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF2FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  roleBadgeText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  metricNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Sección de Favoritos
  favoritesSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  favCountBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  favCountText: {
    color: colors.red,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  emptyFavorites: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  emptyFavTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: 6,
  },
  emptyFavSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  favList: {
    gap: 8,
  },
  favCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  favIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favInfo: {
    flex: 1,
  },
  favTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  favMeta: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    gap: 12,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.red,
    height: 50,
    borderRadius: borderRadius.md,
    gap: 8,
    ...shadows.small,
  },
  logoutButtonText: {
    color: colors.red,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  // Modal de Confirmación
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
    backgroundColor: '#FEE2E2',
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
    gap: 12,
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
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: colors.red,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  termsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  termsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsRowTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  termsRowSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  innerDivider: {
    height: 1,
    marginVertical: 4,
  },
  backendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  backendLabel: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  adminBadgePill: {
    backgroundColor: '#123B8E',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  adminBadgePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
