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

export default function DisclaimerModal({ visible, onClose }) {
  const { colors, isDarkMode } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)' }]}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerTitleRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="information-circle" size={24} color="#D97706" />
                </View>
                <View>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Aviso Académico y Disclaimer
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Deslinde de Responsabilidad Institucional
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <View style={[styles.institutionBadge, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EFF6FF', borderColor: colors.primary }]}>
                <Ionicons name="school" size={16} color={colors.primary} />
                <Text style={[styles.institutionText, { color: colors.primary }]}>
                  Universidad Nacional del Pilar (UNP) • Sede Pilar Centro
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                  1. Naturaleza del Proyecto
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                  <Text style={{ fontWeight: 'bold' }}>UniApuntes</Text> es un desarrollo de software concebido con propósitos estrictamente educativos y pedagógicos en el marco de la <Text style={{ fontWeight: 'bold' }}>Tecnicatura Universitaria en Desarrollo de Software</Text>, cátedra de <Text style={{ fontWeight: 'bold' }}>Aplicaciones Móviles</Text>, a cargo del <Text style={{ fontWeight: 'bold' }}>Prof. Ariel Bulacio</Text>.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                  2. Diferenciación de Sistemas Oficiales
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                  Esta aplicación móvil es una iniciativa comunitaria de estudiantes y <Text style={{ fontWeight: 'bold' }}>no reemplaza</Text> los sistemas oficiales de gestión universitaria de la Universidad Nacional del Pilar (tales como SIU Guaraní, Campus Virtual o Secretaría Académica). Todo trámite de regularidad o examen debe canalizarse por los medios oficiales de la UNP.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                  3. Responsabilidad sobre el Contenido Compartido
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                  Los apuntes, resúmenes, esquemas y archivos compartidos reflejan interpretaciones de estudio de los propios alumnos. Los autores y desarrolladores no se responsabilizan por imprecisiones temáticas en los resúmenes ni garantizan la aprobación académica.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                  4. Política de Cero Lucro
                </Text>
                <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
                  El servicio es libre y sin fines comerciales. No se cobra comisión ni existe pasarela de pagos. Los recursos están identificados con acceso <Text style={{ color: colors.green, fontWeight: 'bold' }}>GRATIS</Text>.
                </Text>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.understoodBtn, { backgroundColor: colors.primary }]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                <Text style={styles.understoodBtnText}>HE LEÍDO Y COMPRENDO EL AVISO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  safeContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
  },
  card: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  closeBtn: {
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
  institutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: 4,
  },
  institutionText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  section: {
    gap: 4,
  },
  sectionHeading: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  paragraph: {
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    textAlign: 'justify',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  understoodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    gap: 8,
    ...shadows.small,
  },
  understoodBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
});
