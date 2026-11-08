import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { typography, spacing, borderRadius, shadows } from '../styles/theme';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import PublicationCard from '../components/PublicationCard';
import DarkModeButton from '../components/DarkModeButton';
import OnboardingModal from '../components/OnboardingModal';
import DisclaimerModal from '../components/DisclaimerModal';
import { useAuth } from '../context/AuthContext';
import { usePublications } from '../context/PublicationsContext';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ onNavigate }) {
  const { user } = useAuth();
  const { publications } = usePublications();
  const { isDarkMode, colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const categories = [
    { id: '1', title: 'Apuntes', icon: '📚' },
    { id: '2', title: 'Asesorías', icon: '🎓' },
    { id: '3', title: 'Cursos', icon: '📖' },
    { id: '4', title: 'Resúmenes', icon: '📝' },
  ];

  // Lista enriquecida con las nuevas materias solicitadas
  const popularSubjects = [
    'Programación',
    'Matemática Discreta',
    'Base de Datos',
    'Psicología',
    'Enfermería',
    'Diseño de Paisaje',
  ];

  // Mostramos publicaciones recientes
  const recentPublications = publications.slice(0, 4);

  const handleSearch = (query) => {
    const term = (query !== undefined ? query : searchText).trim();
    onNavigate('Results', { query: term || 'Programación' });
  };

  const handleCategoryPress = (categoryTitle) => {
    onNavigate('Results', { query: categoryTitle, filterType: categoryTitle });
  };

  const handleSubjectPress = (subject) => {
    onNavigate('Results', { query: subject });
  };

  const handlePublicationPress = (publication) => {
    onNavigate('Detail', { publication });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Superior con Logotipo y Botones de Acción */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={[styles.headerLogoWrapper, { borderColor: isDarkMode ? '#334155' : '#D9E6FF' }]}>
              <Image
                source={require('../../assets/logo.jpg')}
                style={styles.headerLogo}
                resizeMode="cover"
              />
            </View>
            <View style={styles.brandTextContainer}>
              <Text style={[styles.brandTitle, { color: colors.primary }]}>UniApuntes</Text>
              <Text style={[styles.brandSlogan, { color: colors.textSecondary }]}>
                Compartí conocimiento. Encontrá lo que necesitás.
              </Text>
            </View>
          </View>

          {/* Acciones del encabezado: Modo Oscuro y Perfil */}
          <View style={styles.headerActions}>
            <DarkModeButton compact={true} />
            <TouchableOpacity
              style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}
              onPress={() => onNavigate('Profile')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Ver mi perfil"
            >
              <Text style={styles.avatarText}>
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greetingSection}>
          <View style={[styles.institutionHeaderPill, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EFF6FF' }]}>
            <Ionicons name="school" size={12} color={colors.primary} />
            <Text style={[styles.institutionHeaderPillText, { color: colors.primary }]}>
              UNP Pilar • Ciclo Académico 2026
            </Text>
          </View>

          <Text style={[styles.greeting, { color: colors.textPrimary }]}>
            Hola, {user?.nombre || 'Leonardo'} 👋
          </Text>
          <Text style={[styles.greetingSubtext, { color: colors.textSecondary }]}>
            ¿Qué material universitario necesitás hoy?
          </Text>

          {/* Banner de Bienvenida / Reseña de la App */}
          <TouchableOpacity
            style={[styles.welcomeBanner, { backgroundColor: isDarkMode ? '#1E293B' : '#EEF4FF', borderColor: isDarkMode ? '#334155' : '#D9E6FF' }]}
            onPress={() => setShowOnboarding(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Ver reseña de qué trata la app"
          >
            <View style={styles.welcomeBannerLeft}>
              <View style={[styles.sparkleCircle, { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' }]}>
                <Ionicons name="sparkles" size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.welcomeBannerTitle, { color: colors.textPrimary }]}>
                  ¿Cómo funciona UniApuntes?
                </Text>
                <Text style={[styles.welcomeBannerSubtitle, { color: colors.textSecondary }]}>
                  Tocá para ver la reseña y pautas de la comunidad
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Barra de Búsqueda */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearch}
          placeholder="¿Qué estás buscando? (ej: Psicología, Programación)"
        />

        {/* Sección: Explorá por categoría */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Explorá por categoría
          </Text>
        </View>
        <View style={styles.categoriesRow}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              title={cat.title}
              onPress={() => handleCategoryPress(cat.title)}
            />
          ))}
        </View>

        {/* Sección: Materias populares con las nuevas carreras agregadas */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Materias populares
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {popularSubjects.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleSubjectPress(subject)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Materia ${subject}`}
            >
              <Text style={[styles.chipText, { color: colors.textPrimary }]}>
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sección: Publicaciones recientes */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Publicaciones recientes
          </Text>
        </View>

        <View style={styles.recentList}>
          {recentPublications.map((item) => (
            <PublicationCard
              key={item.id}
              publication={item}
              onPress={() => handlePublicationPress(item)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Modales de Onboarding y Disclaimer */}
      <OnboardingModal visible={showOnboarding} onFinish={() => setShowOnboarding(false)} />
      <DisclaimerModal visible={showDisclaimer} onClose={() => setShowDisclaimer(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerLogoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    ...shadows.small,
  },
  headerLogo: {
    width: '100%',
    height: '100%',
  },
  brandTextContainer: {
    flex: 1,
  },
  brandTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
  },
  brandSlogan: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  greetingSection: {
    marginBottom: spacing.sm,
  },
  institutionHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  institutionHeaderPillText: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
  },
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: 10,
    ...shadows.small,
  },
  welcomeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sparkleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeBannerTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  welcomeBannerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  greetingSubtext: {
    fontSize: typography.sizes.sm,
    marginTop: 4,
  },
  sectionHeaderRow: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    ...shadows.small,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  recentList: {
    marginTop: spacing.xs,
  },
});
