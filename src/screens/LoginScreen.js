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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, register, loginAsGuest } = useAuth();

  // Modo: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Campos de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Campos de Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCareer, setRegCareer] = useState('Tecnicatura en Desarrollo de Software');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Mensajes de error en formulario
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Por favor, ingresá tu correo electrónico.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Por favor, ingresá tu contraseña.');
      return;
    }

    // Validación básica de formato de correo
    if (!email.includes('@')) {
      setErrorMessage('Ingresá un correo válido (ej: estudiante@unp.edu.ar).');
      return;
    }

    login(email, password);
  };

  const handleRegisterSubmit = () => {
    setErrorMessage('');
    if (!regName.trim()) {
      setErrorMessage('Por favor, ingresá tu nombre y apellido.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Por favor, ingresá un correo universitario válido.');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 4) {
      setErrorMessage('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    register(regName, regEmail, regPassword, regCareer);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Contraseña',
      'Te enviamos un enlace de recuperación a tu correo institucional registrado.',
      [{ text: 'Entendido' }]
    );
  };

  const handleDemoLogin = () => {
    login('leonardo@unp.edu.ar', '123456');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo y Encabezado */}
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <Image
                source={require('../../assets/logo.jpg')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.brandTitle}>UniApuntes</Text>
            <Text style={styles.brandSlogan}>
              Compartí conocimiento. Encontrá lo que necesitás.
            </Text>
            <View style={styles.badgeContainer}>
              <Ionicons name="ribbon-outline" size={14} color={colors.primaryDark} />
              <Text style={styles.badgeText}>Universidad Nacional del Pilar — 2026</Text>
            </View>
          </View>

          {/* Tarjeta de Formulario */}
          <View style={styles.card}>
            {/* Pestañas Iniciar Sesión / Registrarse */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'login' && styles.tabButtonActive]}
                onPress={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.tabButtonText, activeTab === 'login' && styles.tabButtonTextActive]}
                >
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'register' && styles.tabButtonActive]}
                onPress={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.tabButtonText, activeTab === 'register' && styles.tabButtonTextActive]}
                >
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            {/* Mensaje de error si existe */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.red} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {activeTab === 'login' ? (
              /* FORMULARIO DE INICIO DE SESIÓN */
              <View style={styles.form}>
                <Text style={styles.inputLabel}>Correo electrónico o universitario</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="estudiante@unp.edu.ar"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <Text style={styles.inputLabel}>Contraseña</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Tu contraseña"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.forgotBtn}
                  onPress={handleForgotPassword}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleLoginSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>INICIAR SESIÓN</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              /* FORMULARIO DE REGISTRO */
              <View style={styles.form}>
                <Text style={styles.inputLabel}>Nombre y Apellido</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Leonardo Gómez"
                    placeholderTextColor={colors.textSecondary}
                    value={regName}
                    onChangeText={setRegName}
                  />
                </View>

                <Text style={styles.inputLabel}>Carrera</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="book-outline"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Tecnicatura en Desarrollo de Software"
                    placeholderTextColor={colors.textSecondary}
                    value={regCareer}
                    onChangeText={setRegCareer}
                  />
                </View>

                <Text style={styles.inputLabel}>Correo electrónico</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="estudiante@unp.edu.ar"
                    placeholderTextColor={colors.textSecondary}
                    value={regEmail}
                    onChangeText={setRegEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <Text style={styles.inputLabel}>Contraseña</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Creá una contraseña"
                    placeholderTextColor={colors.textSecondary}
                    value={regPassword}
                    onChangeText={setRegPassword}
                    secureTextEntry={!showRegPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowRegPassword(!showRegPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showRegPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleRegisterSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>CREAR CUENTA</Text>
                  <Ionicons name="checkmark" size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}

            {/* Divisor */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o probá la app con</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Accesos Rápidos para demostración */}
            <View style={styles.quickAccessSection}>
              <TouchableOpacity
                style={styles.demoButton}
                onPress={handleDemoLogin}
                activeOpacity={0.8}
              >
                <Ionicons name="finger-print-outline" size={20} color={colors.primary} />
                <Text style={styles.demoButtonText}>Ingresar como Leonardo (Demo)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.guestButton}
                onPress={loginAsGuest}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.guestButtonText}>Explorar como Invitado</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pie de pantalla institucional */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              UniApuntes — Aplicaciones Móviles 2026
            </Text>
            <Text style={styles.footerSubtext}>Docente: Ariel Bulacio</Text>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2.5,
    borderColor: '#D9E6FF',
    ...shadows.card,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  brandSlogan: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF2FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    marginTop: 10,
    gap: 6,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    color: colors.primaryDark,
    fontWeight: typography.weights.semibold,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.tagBg,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.white,
    ...shadows.small,
  },
  tabButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  tabButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
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
    flex: 1,
    fontWeight: typography.weights.medium,
  },
  form: {
    gap: 8,
  },
  inputLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 4,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 12,
  },
  forgotText: {
    fontSize: typography.sizes.xs,
    color: colors.secondary,
    fontWeight: typography.weights.semibold,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    ...shadows.small,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  quickAccessSection: {
    gap: 10,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    height: 46,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#D9E6FF',
    gap: 8,
  },
  demoButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tagBg,
    height: 44,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  guestButtonText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  footerSubtext: {
    fontSize: typography.sizes.xs,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
