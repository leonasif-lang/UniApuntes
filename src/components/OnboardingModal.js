import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, spacing, borderRadius, shadows } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

export default function OnboardingModal({ visible, onFinish }) {
  const { colors, isDarkMode } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      icon: 'school',
      iconColor: '#2563EB',
      badge: 'Universidad Nacional del Pilar (UNP)',
      title: '¡Te damos la bienvenida a UniApuntes!',
      subtitle: 'Comunidad Académica de la UNP',
      description:
        'La primera plataforma móvil diseñada para centralizar apuntes, resúmenes de cursada y guías prácticas entre estudiantes de la Universidad Nacional del Pilar.',
      bullet1: '🏛️ Creada para el ecosistema universitario de Pilar',
      bullet2: '🎯 Organizada por cátedras, carreras y materias reales',
    },
    {
      id: 2,
      icon: 'book',
      iconColor: '#10B981',
      badge: 'Material 100% Libre y Colaborativo',
      title: 'Encontrá y compartí apuntes GRATIS',
      subtitle: 'Sin cobros, sin intermediarios',
      description:
        'Accedé al instante a resúmenes para parciales, modelos de examen y guías de materias como Programación, Base de Datos, Psicología, Enfermería y Diseño de Paisaje.',
      bullet1: '📖 Descarga y consulta de material en PDF',
      bullet2: '⭐ Calificaciones y reseñas de compañeros de cursada',
    },
    {
      id: 3,
      icon: 'chatbubbles',
      iconColor: '#8B5CF6',
      badge: 'Mensajería Académica Segura',
      title: 'Conectate con tus compañeros',
      subtitle: 'Preguntá, coordiná y aprendé en grupo',
      description:
        'Escribile directamente a quien publicó el apunte para hacer consultas puntuales sobre la cursada, resolver dudas de ejercicios o armar grupos de estudio.',
      bullet1: '💬 Chats organizados por apunte y materia',
      bullet2: '⚡ Respuestas rápidas preconfiguradas con 1 toque',
    },
    {
      id: 4,
      icon: 'cloud-done',
      iconColor: '#F59E0B',
      badge: 'Cloud Sync en Tiempo Real',
      title: '¡Todo listo para empezar!',
      subtitle: 'Tu cursada organizada en tu bolsillo',
      description:
        'Tus publicaciones y favoritos se sincronizan automáticamente con la nube gracias a nuestro backend en Google Firebase. ¡Sumate a compartir conocimiento!',
      bullet1: '🔒 Autenticación institucional segura con UNP',
      bullet2: '🌙 Modo Oscuro y modo offline listos para estudiar',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    setCurrentSlide(0);
    if (onFinish) onFinish();
  };

  const slide = slides[currentSlide];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleComplete}
    >
      <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(11, 17, 32, 0.95)' : 'rgba(15, 23, 42, 0.8)' }]}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {/* Top Bar: Slide Indicator & Skip Button */}
            <View style={styles.topBar}>
              <View style={styles.dotsRow}>
                {slides.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      idx === currentSlide
                        ? [styles.activeDot, { backgroundColor: colors.primary }]
                        : [styles.inactiveDot, { backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }],
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleComplete}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Omitir bienvenida"
              >
                <Text style={[styles.skipText, { color: colors.textSecondary }]}>Omitir</Text>
              </TouchableOpacity>
            </View>

            {/* Slide Content */}
            <View style={styles.content}>
              <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1E293B' : '#EEF2FF' }]}>
                <Ionicons name={slide.icon} size={48} color={slide.iconColor} />
              </View>

              <View style={[styles.badge, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EBF2FF' }]}>
                <Ionicons name="sparkles" size={13} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.primary }]}>{slide.badge}</Text>
              </View>

              <Text style={[styles.title, { color: colors.textPrimary }]}>{slide.title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{slide.subtitle}</Text>

              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {slide.description}
              </Text>

              {/* Highlights Box */}
              <View style={[styles.highlightBox, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
                <Text style={[styles.highlightItem, { color: colors.textPrimary }]}>{slide.bullet1}</Text>
                <Text style={[styles.highlightItem, { color: colors.textPrimary }]}>{slide.bullet2}</Text>
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              {currentSlide > 0 ? (
                <TouchableOpacity
                  style={[styles.prevButton, { borderColor: colors.border }]}
                  onPress={handlePrev}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
                  <Text style={[styles.prevButtonText, { color: colors.textPrimary }]}>Anterior</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ flex: 0.4 }} />
              )}

              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: colors.primary }]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>
                  {currentSlide === slides.length - 1 ? '¡COMENZAR AHORA!' : 'Siguiente'}
                </Text>
                <Ionicons
                  name={currentSlide === slides.length - 1 ? 'rocket' : 'arrow-forward'}
                  size={18}
                  color="#FFFFFF"
                />
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
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    ...shadows.strong,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
  },
  inactiveDot: {
    width: 8,
  },
  skipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  content: {
    alignItems: 'center',
    textAlign: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.small,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  title: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.sizes.xs,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: 8,
  },
  highlightBox: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: 8,
    marginBottom: spacing.md,
  },
  highlightItem: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    marginTop: spacing.sm,
    gap: 12,
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: 6,
    flex: 0.45,
  },
  prevButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
    gap: 8,
    flex: 0.55,
    ...shadows.small,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});
