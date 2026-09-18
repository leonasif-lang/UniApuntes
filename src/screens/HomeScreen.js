import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import PublicationCard from '../components/PublicationCard';
import publications from '../data/publications';

export default function HomeScreen({ onNavigate }) {
  const [searchText, setSearchText] = useState('');

  const categories = [
    { id: '1', title: 'Apuntes', icon: '📚' },
    { id: '2', title: 'Asesorías', icon: '🎓' },
    { id: '3', title: 'Cursos', icon: '📖' },
    { id: '4', title: 'Resúmenes', icon: '📝' },
  ];

  const popularSubjects = [
    'Programación',
    'Matemática Discreta',
    'Base de Datos',
    'Desarrollo Web',
  ];

  // Mostramos las primeras 3 publicaciones para "Publicaciones recientes"
  const recentPublications = publications.slice(0, 3);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Superior */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>UniApuntes</Text>
            <Text style={styles.brandSlogan}>Compartí conocimiento. Encontrá lo que necesitás.</Text>
          </View>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>L</Text>
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hola, Leonardo 👋</Text>
          <Text style={styles.greetingSubtext}>¿Qué material universitario necesitás hoy?</Text>
        </View>

        {/* Barra de Búsqueda */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearch}
          placeholder="¿Qué estás buscando?"
        />

        {/* Sección: Explorá por categoría */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Explorá por categoría</Text>
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

        {/* Sección: Materias populares */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Materias populares</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {popularSubjects.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => handleSubjectPress(subject)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Materia ${subject}`}
            >
              <Text style={styles.chipText}>{subject}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sección: Publicaciones recientes */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Publicaciones recientes</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
  brandTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  brandSlogan: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  greetingSection: {
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  greetingSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionHeaderRow: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
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
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    color: colors.primaryDark,
    fontWeight: typography.weights.medium,
  },
  recentList: {
    marginTop: spacing.xs,
  },
});
