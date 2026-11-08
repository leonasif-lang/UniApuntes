import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import SearchBar from '../components/SearchBar';
import PublicationCard from '../components/PublicationCard';
import FilterButton from '../components/FilterButton';
import DarkModeButton from '../components/DarkModeButton';
import { usePublications } from '../context/PublicationsContext';
import { useTheme } from '../context/ThemeContext';

export default function ResultsScreen({ query = 'Programación', onBack, onNavigate }) {
  const { publications } = usePublications();
  const { colors, isDarkMode } = useTheme();
  const [currentQuery, setCurrentQuery] = useState(query || 'Programación');
  const [activeFilter, setActiveFilter] = useState(null);

  // Filtrado de publicaciones según término de búsqueda
  const results = useMemo(() => {
    const q = (currentQuery || '').toLowerCase().trim();
    if (!q) {
      return publications;
    }
    const filtered = publications.filter((p) => {
      return (
        p.titulo.toLowerCase().includes(q) ||
        p.materia.toLowerCase().includes(q) ||
        p.tipo.toLowerCase().includes(q) ||
        p.autor.toLowerCase().includes(q)
      );
    });
    // Si no encuentra nada, mantenemos al menos los resultados de la materia o lista general para mejor UX
    return filtered.length > 0 ? filtered : publications;
  }, [currentQuery]);

  const handleSearch = (newQuery) => {
    setCurrentQuery(newQuery);
  };

  const toggleFilter = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  const handleSelectPublication = (publication) => {
    onNavigate('Detail', { publication });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.cardBg}
      />

      {/* Barra superior con botón volver y Modo Oscuro */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Volver a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Resultados</Text>
        <DarkModeButton compact={true} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Buscador editable */}
        <SearchBar
          value={currentQuery}
          onChangeText={setCurrentQuery}
          onSearch={handleSearch}
          placeholder="Buscar publicaciones, materias..."
        />

        {/* Indicador de resultados */}
        <View style={styles.queryIndicatorContainer}>
          <Text style={styles.queryLabel}>Resultados para:</Text>
          <Text style={styles.queryHighlight}>"{currentQuery || 'Todos'}"</Text>
        </View>

        {/* Barra de Filtros Visuales */}
        <View style={styles.filtersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
            <FilterButton
              label="Materia"
              icon="book-outline"
              isSelected={activeFilter === 'Materia'}
              onPress={() => toggleFilter('Materia')}
            />
            <FilterButton
              label="Tipo"
              icon="layers-outline"
              isSelected={activeFilter === 'Tipo'}
              onPress={() => toggleFilter('Tipo')}
            />
            <FilterButton
              label="Acceso Libre"
              icon="checkmark-circle-outline"
              isSelected={activeFilter === 'Acceso Libre'}
              onPress={() => toggleFilter('Acceso Libre')}
            />
          </ScrollView>
        </View>

        {/* Contador de resultados */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {results.length} {results.length === 1 ? 'publicación encontrada' : 'publicaciones encontradas'}
          </Text>
        </View>

        {/* Lista de Resultados */}
        <View style={styles.resultsList}>
          {results.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              onPress={() => handleSelectPublication(publication)}
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
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  queryIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    gap: 4,
  },
  queryLabel: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  queryHighlight: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  filtersWrapper: {
    marginBottom: spacing.md,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  countRow: {
    marginBottom: spacing.md,
  },
  countText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  resultsList: {
    marginTop: spacing.xs,
  },
});
