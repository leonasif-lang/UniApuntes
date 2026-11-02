import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { usePublications } from '../context/PublicationsContext';
import { useTheme } from '../context/ThemeContext';

export default function PublishScreen({ onBack, onPublishSuccess }) {
  const { user } = useAuth();
  const { addPublication } = usePublications();
  const { colors, isDarkMode } = useTheme();

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Apuntes');
  const [materia, setMateria] = useState('Programación');
  const [materiaPersonalizada, setMateriaPersonalizada] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivoAdjunto, setArchivoAdjunto] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const categorias = [
    { key: 'Apuntes', label: 'Apuntes', icon: '📚' },
    { key: 'Asesoría', label: 'Asesoría', icon: '🎓' },
    { key: 'Cursos', label: 'Curso', icon: '📖' },
    { key: 'Resúmenes', label: 'Resumen', icon: '📝' },
  ];

  const materiasSugeridas = [
    'Programación',
    'Matemática Discreta',
    'Base de Datos',
    'Desarrollo Web',
    'Psicología',
    'Enfermería',
    'Diseño de Paisaje',
    'Otra',
  ];

  const handleAttachFile = () => {
    // Simulación de selector de archivo PDF
    if (archivoAdjunto) {
      setArchivoAdjunto(null);
    } else {
      setArchivoAdjunto({
        nombre: `${titulo ? titulo.toLowerCase().replace(/\s+/g, '_') : 'material_academico'}.pdf`,
        peso: '2.4 MB',
      });
      Alert.alert('Archivo Adjuntado', 'Se cargó el archivo correctamente en formato PDF.', [
        { text: 'Aceptar' },
      ]);
    }
  };

  const handleSubmit = () => {
    setErrorMessage('');

    if (!titulo.trim()) {
      setErrorMessage('Por favor, ingresá un título para la publicación.');
      return;
    }

    const materiaFinal =
      materia === 'Otra'
        ? materiaPersonalizada.trim() || 'General'
        : materia;

    if (!descripcion.trim()) {
      setErrorMessage('Por favor, agregá una breve descripción del material.');
      return;
    }

    // Registrar la publicación en el contexto
    addPublication({
      titulo: titulo.trim(),
      tipo,
      materia: materiaFinal,
      autor: user?.nombre || 'Leonardo',
      descripcion: descripcion.trim(),
      archivoAdjunto: archivoAdjunto ? archivoAdjunto.nombre : 'material_adjunto.pdf',
    });

    Alert.alert(
      '¡Publicación Exitosa!',
      'Tu recurso ya está disponible para toda la comunidad universitaria.',
      [
        {
          text: 'Ver en Inicio',
          onPress: () => {
            if (onPublishSuccess) {
              onPublishSuccess();
            } else if (onBack) {
              onBack();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primaryDark} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <Text style={styles.headerTitle}>Publicar Recurso</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Banner de Autor */}
          <View style={styles.authorBanner}>
            <View style={styles.authorIconWrapper}>
              <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorLabel}>Publicando como:</Text>
              <Text style={styles.authorName}>
                {user?.nombre || 'Leonardo'} • {user?.carrera || 'Tecnicatura en Desarrollo de Software'}
              </Text>
            </View>
          </View>

          {/* Mensaje de Error */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.red} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Tarjeta de Formulario */}
          <View style={styles.card}>
            {/* Campo: Título */}
            <Text style={styles.label}>Título de la publicación *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ej: Resumen Completo de Algoritmos I"
                placeholderTextColor={colors.textSecondary}
                value={titulo}
                onChangeText={setTitulo}
              />
            </View>

            {/* Campo: Categoría / Tipo */}
            <Text style={styles.label}>Tipo de recurso *</Text>
            <View style={styles.categoriesGrid}>
              {categorias.map((cat) => {
                const isSelected = tipo === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
                    onPress={() => setTipo(cat.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text
                      style={[styles.categoryLabel, isSelected && styles.categoryLabelActive]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Campo: Materia */}
            <Text style={styles.label}>Materia correspondiente *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {materiasSugeridas.map((mat) => {
                const isSelected = materia === mat;
                return (
                  <TouchableOpacity
                    key={mat}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => setMateria(mat)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {mat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {materia === 'Otra' && (
              <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Escribí el nombre de la materia"
                  placeholderTextColor={colors.textSecondary}
                  value={materiaPersonalizada}
                  onChangeText={setMateriaPersonalizada}
                />
              </View>
            )}

            {/* Campo: Descripción */}
            <Text style={styles.label}>Descripción y contenidos *</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Explicá brevemente qué temas incluye tu apunte, unidad o examen..."
                placeholderTextColor={colors.textSecondary}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Adjuntar Archivo */}
            <Text style={styles.label}>Archivo de estudio (PDF / Imágenes)</Text>
            <TouchableOpacity
              style={[styles.attachButton, archivoAdjunto && styles.attachButtonSuccess]}
              onPress={handleAttachFile}
              activeOpacity={0.8}
            >
              <Ionicons
                name={archivoAdjunto ? 'document-attach' : 'cloud-upload-outline'}
                size={22}
                color={archivoAdjunto ? colors.green : colors.primary}
              />
              <View style={styles.attachTextContainer}>
                <Text style={[styles.attachTitle, archivoAdjunto && styles.attachTitleSuccess]}>
                  {archivoAdjunto ? archivoAdjunto.nombre : 'Subir archivo del apunte'}
                </Text>
                <Text style={styles.attachSubtitle}>
                  {archivoAdjunto
                    ? `Tamaño: ${archivoAdjunto.peso} (Tocar para remover)`
                    : 'Formatos soportados: PDF, JPG, PNG'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Distintivo de Acceso Gratuito */}
            <View style={styles.freeBadgeContainer}>
              <Ionicons name="checkmark-circle" size={16} color={colors.green} />
              <Text style={styles.freeBadgeText}>
                Acceso Libre y Gratuito para toda la comunidad UNP
              </Text>
            </View>

            {/* Botón de Publicación */}
            <TouchableOpacity
              style={styles.publishButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Ionicons name="paper-plane-outline" size={20} color={colors.white} />
              <Text style={styles.publishButtonText}>PUBLICAR AHORA</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardContainer: {
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
  authorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: 12,
  },
  authorIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D9E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  authorName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: 8,
  },
  errorText: {
    color: '#991B1B',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  textAreaWrapper: {
    height: 96,
    paddingVertical: 8,
  },
  textArea: {
    height: '100%',
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  categoryBtn: {
    flex: 1,
    backgroundColor: colors.tagBg,
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryBtnActive: {
    backgroundColor: '#EEF2FF',
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  categoryLabelActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: 12,
  },
  attachButtonSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: colors.green,
    borderStyle: 'solid',
  },
  attachTextContainer: {
    flex: 1,
  },
  attachTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  attachTitleSuccess: {
    color: colors.green,
  },
  attachSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  freeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: borderRadius.sm,
    marginTop: 16,
    gap: 6,
  },
  freeBadgeText: {
    fontSize: typography.sizes.xs,
    color: '#166534',
    fontWeight: typography.weights.semibold,
  },
  publishButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    ...shadows.small,
  },
  publishButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
});
