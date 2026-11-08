import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, spacing, borderRadius, shadows } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import { sendAccountRecoveryEmail } from '../services/firebase';

export default function ForgotPasswordModal({ visible, onClose }) {
  const { colors, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    setResultMessage('');

    if (!email.trim()) {
      setErrorMessage('Por favor, ingresá tu correo electrónico universitario.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Ingresá un formato de correo válido (ej: estudiante@unp.edu.ar).');
      return;
    }

    setLoading(true);
    try {
      const res = await sendAccountRecoveryEmail(email);
      setIsSuccess(true);
      setResultMessage(
        res.message ||
          `Enviamos un enlace seguro de recuperación a ${email}. Revisá tu casilla institucional y la carpeta de spam.`
      );
    } catch (err) {
      setIsSuccess(false);
      setErrorMessage(
        err.message || 'No se pudo procesar la solicitud. Verificá el correo ingresado.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setErrorMessage('');
    setResultMessage('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)' }]}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EEF2FF' }]}>
                  <Ionicons name="key" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Recuperar Cuenta
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Restablecer usuario o contraseña
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                style={[styles.closeBtn, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <View style={styles.body}>
              {isSuccess ? (
                /* Estado Exitoso */
                <View style={styles.successContainer}>
                  <View style={[styles.successIconCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="mail-unread" size={36} color="#15803D" />
                  </View>
                  <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                    ¡Instrucciones Enviadas!
                  </Text>
                  <Text style={[styles.successText, { color: colors.textSecondary }]}>
                    {resultMessage}
                  </Text>
                  <View style={[styles.infoBanner, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}>
                    <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                    <Text style={[styles.infoBannerText, { color: colors.textSecondary }]}>
                      Si no lo ves en tu bandeja de entrada, revisá la sección de Spam o contactá con el soporte de la UNP.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    onPress={handleClose}
                  >
                    <Text style={styles.primaryButtonText}>VOLVER AL INICIO DE SESIÓN</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* Formulario de Solicitud */
                <View style={styles.form}>
                  <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                    Ingresá el correo universitario con el que te registraste en UniApuntes. Te enviaremos un enlace oficial de Firebase para restablecer tu contraseña.
                  </Text>

                  {errorMessage ? (
                    <View style={styles.errorBox}>
                      <Ionicons name="alert-circle" size={18} color="#991B1B" />
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                  ) : null}

                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                    Correo Institucional
                  </Text>
                  <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF', borderColor: colors.border }]}>
                    <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                      style={[styles.input, { color: colors.textPrimary }]}
                      placeholder="estudiante@unp.edu.ar"
                      placeholderTextColor={colors.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <View style={[styles.securityNotice, { backgroundColor: isDarkMode ? '#1E293B' : '#EFF6FF', borderColor: isDarkMode ? '#334155' : '#BFDBFE' }]}>
                    <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                    <Text style={[styles.securityNoticeText, { color: colors.primary }]}>
                      Sincronizado con Firebase Authentication y UNP
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="send" size={16} color="#FFFFFF" />
                        <Text style={styles.primaryButtonText}>ENVIAR ENLACE DE RECUPERACIÓN</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
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
    maxWidth: 480,
  },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.strong,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
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
  body: {
    padding: spacing.lg,
  },
  form: {
    gap: 12,
  },
  instructionText: {
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.sm,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  securityNoticeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: borderRadius.md,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: '#991B1B',
    flex: 1,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.md,
    gap: 8,
    marginTop: 8,
    ...shadows.small,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  successText: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: 6,
  },
  infoBannerText: {
    fontSize: typography.sizes.xs,
    flex: 1,
    lineHeight: 16,
  },
});
