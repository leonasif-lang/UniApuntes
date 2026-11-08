import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, spacing, borderRadius, shadows } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

export default function TermsModal({ visible, onClose }) {
  const { colors, isDarkMode } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)' }]}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {/* Header del Modal */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerTitleRow}>
                <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EEF2FF' }]}>
                  <Ionicons name="document-text" size={22} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Términos y Condiciones
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Comunidad Universitaria UniApuntes
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Cerrar términos y condiciones"
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Contenido con scroll */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              <View style={[styles.badgeContainer, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EBF2FF' }]}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  Universidad Nacional del Pilar — Cátedra Móviles 2026
                </Text>
              </View>

              <Text style={[styles.introText, { color: colors.textPrimary }]}>
                Bienvenido a <Text style={{ fontWeight: 'bold' }}>UniApuntes</Text>. Al registrarte o utilizar esta aplicación móvil, aceptás las siguientes normas y condiciones orientadas al aprendizaje colaborativo:
              </Text>

              {/* Artículo 1 */}
              <View style={styles.article}>
                <Text style={[styles.articleTitle, { color: colors.primary }]}>
                  1. Propósito Educativo y Colaborativo
                </Text>
                <Text style={[styles.articleText, { color: colors.textSecondary }]}>
                  UniApuntes es una plataforma académica creada para centralizar y facilitar el intercambio de apuntes, resúmenes, guías de estudio y consultas universitarias de forma abierta, rápida y accesible para toda la comunidad estudiantil.
                </Text>
              </View>

              {/* Artículo 2 */}
              <View style={styles.article}>
                <Text style={[styles.articleTitle, { color: colors.primary }]}>
                  2. Principio de Acceso Libre y Gratuito
                </Text>
                <Text style={[styles.articleText, { color: colors.textSecondary }]}>
                  Todos los materiales compartidos en UniApuntes son de acceso <Text style={{ fontWeight: 'bold', color: colors.green }}>GRATIS</Text>. Queda terminantemente prohibida la comercialización, venta o cobro por acceso a cualquier contenido publicado en la aplicación.
                </Text>
              </View>

              {/* Artículo 3 */}
              <View style={styles.article}>
                <Text style={[styles.articleTitle, { color: colors.primary }]}>
                  3. Integridad Académica y Autoría
                </Text>
                <Text style={[styles.articleText, { color: colors.textSecondary }]}>
                  Los estudiantes se comprometen a compartir material de producción propia (notas de clase, resúmenes de parciales, esquemas) o de circulación bibliográfica permitida. No se permite la difusión de evaluaciones activas confidenciales ni prácticas de plagio.
                </Text>
              </View>

              {/* Artículo 4 */}
              <View style={styles.article}>
                <Text style={[styles.articleTitle, { color: colors.primary }]}>
                  4. Convivencia y Mensajería Respetuosa
                </Text>
                <Text style={[styles.articleText, { color: colors.textSecondary }]}>
                  Los canales de chat y consulta entre pares deben regirse bajo principios de respeto mutuo, cordialidad, solidaridad estudiantil y un uso exclusivamente pedagógico.
                </Text>
              </View>

              {/* Artículo 5 */}
              <View style={styles.article}>
                <Text style={[styles.articleTitle, { color: colors.primary }]}>
                  5. Privacidad y Datos Institucionales
                </Text>
                <Text style={[styles.articleText, { color: colors.textSecondary }]}>
                  Los datos solicitados (correo institucional, carrera universitaria y nombre) se utilizan exclusivamente para validar la pertenencia académica y garantizar la personalización dentro del sistema. No se comparten con entidades comerciales externas.
                </Text>
              </View>

              {/* Artículo 6 */}
              <View style={styles.article}>
                <Text style={[styles.articleTitle, { color: colors.primary }]}>
                  6. Respaldo Académico
                </Text>
                <Text style={[styles.articleText, { color: colors.textSecondary }]}>
                  Proyecto desarrollado en el marco de la <Text style={{ fontWeight: 'bold' }}>Tecnicatura Universitaria en Desarrollo de Software</Text>, Cátedra <Text style={{ fontWeight: 'bold' }}>Aplicaciones Móviles</Text>, a cargo del <Text style={{ fontWeight: 'bold' }}>Prof. Ariel Bulacio</Text>.
                </Text>
              </View>
            </ScrollView>

            {/* Footer con Botón de Entendido */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.acceptButton, { backgroundColor: colors.primary }]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.acceptButtonText}>ENTENDIDO Y ACEPTAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  safeContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
  },
  modalContent: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    ...shadows.strong,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: 14,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  introText: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  article: {
    gap: 4,
  },
  articleTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  articleText: {
    fontSize: typography.sizes.xs,
    lineHeight: 18,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    gap: 8,
    ...shadows.small,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
});
