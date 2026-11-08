import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePublications } from '../context/PublicationsContext';
import { useTheme } from '../context/ThemeContext';
import { notifyModerationAlert } from '../services/notifications';

export default function ModerationModal({ visible, onClose }) {
  const { 
    allPublications, 
    reportedPublications, 
    moderationLogs, 
    moderatePublication 
  } = usePublications();
  const { colors, isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState('reported'); // 'reported' | 'all' | 'logs'
  const [selectedNote, setSelectedNote] = useState('');

  const handleAction = async (pub, action) => {
    const actionLabel = action === 'delete' ? 'dar de baja definitiva' : (action === 'hide' ? 'ocultar del feed' : 'aprobar');
    Alert.alert(
      'Confirmar Acción de Moderación',
      `¿Confirmás que deseás ${actionLabel} el recurso "${pub.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: action === 'delete' ? 'destructive' : 'default',
          onPress: async () => {
            await moderatePublication(
              pub.id, 
              action, 
              action === 'delete' ? 'Baja por incumplimiento de normas de cátedra' : (action === 'hide' ? 'Ocultamiento preventivo' : 'Aprobado tras revisión'),
              'Prof. Ariel Bulacio (Moderador Cátedra)'
            );
            await notifyModerationAlert({
              title: pub.titulo,
              action: action === 'delete' ? 'Baja definitiva' : (action === 'hide' ? 'Ocultado' : 'Aprobado'),
              reason: 'Revisión por cátedra UNP completada.',
            });
            Alert.alert('Acción Registrada', 'El estado del recurso y el registro de auditoría han sido actualizados en la base de datos.');
          },
        },
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>
        {/* Cabecera del Panel */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderBottomColor: isDarkMode ? '#334155' : '#E2E8F0' }]}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.shieldIconWrapper}>
              <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Panel de Moderación Institucional
              </Text>
              <Text style={styles.headerSubtitle}>
                Universidad Nacional del Pilar • Cátedra Aplicaciones Móviles
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={isDarkMode ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        </View>

        {/* Métricas Resumen */}
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.metricVal, { color: '#DC2626' }]}>{reportedPublications.length}</Text>
            <Text style={styles.metricLabel}>Reportados</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.metricVal, { color: '#10B981' }]}>{allPublications.length}</Text>
            <Text style={styles.metricLabel}>Total Recursos</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.metricVal, { color: '#3B82F6' }]}>{moderationLogs.length}</Text>
            <Text style={styles.metricLabel}>Auditorías</Text>
          </View>
        </View>

        {/* Pestañas de Navegación */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'reported' && styles.tabBtnActive]}
            onPress={() => setActiveTab('reported')}
          >
            <Ionicons
              name="alert-circle"
              size={16}
              color={activeTab === 'reported' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.tabText, activeTab === 'reported' && styles.tabTextActive]}>
              Reportados ({reportedPublications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all')}
          >
            <Ionicons
              name="library"
              size={16}
              color={activeTab === 'all' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              Todos ({allPublications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'logs' && styles.tabBtnActive]}
            onPress={() => setActiveTab('logs')}
          >
            <Ionicons
              name="time"
              size={16}
              color={activeTab === 'logs' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.tabText, activeTab === 'logs' && styles.tabTextActive]}>
              Historial ({moderationLogs.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TAB 1: REPORTADOS */}
          {activeTab === 'reported' && (
            <View>
              {reportedPublications.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="checkmark-done-circle" size={48} color="#10B981" />
                  <Text style={[styles.emptyTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    Sin reportes pendientes
                  </Text>
                  <Text style={styles.emptyDesc}>
                    Todos los apuntes y recursos publicados cumplen con las pautas de cátedra y convivencia UNP.
                  </Text>
                </View>
              ) : (
                reportedPublications.map((pub) => (
                  <View
                    key={pub.id}
                    style={[styles.reportCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
                  >
                    <View style={styles.reportBadgeHeader}>
                      <View style={styles.reportBadge}>
                        <Ionicons name="warning" size={14} color="#DC2626" />
                        <Text style={styles.reportBadgeText}>
                          {pub.reportCount || 1} {pub.reportCount === 1 ? 'Reporte' : 'Reportes'}
                        </Text>
                      </View>
                      <Text style={styles.reportMateria}>{pub.materia}</Text>
                    </View>

                    <Text style={[styles.reportTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {pub.titulo}
                    </Text>
                    <Text style={styles.reportAuthor}>
                      Autor: {pub.autor} • Sede: {pub.sede || 'Pilar'}
                    </Text>

                    {pub.reports && pub.reports.length > 0 && (
                      <View style={styles.reportReasonsList}>
                        <Text style={styles.reportReasonHeader}>Motivo señalado por estudiantes:</Text>
                        {pub.reports.map((r, i) => (
                          <Text key={i} style={styles.reportReasonItem}>
                            • "{r.reason}" (Denunciado el {r.date})
                          </Text>
                        ))}
                      </View>
                    )}

                    {/* Botones de Acción de Moderación */}
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => handleAction(pub, 'approve')}
                      >
                        <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Aprobar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, styles.hideBtn]}
                        onPress={() => handleAction(pub, 'hide')}
                      >
                        <Ionicons name="eye-off" size={16} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Ocultar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, styles.deleteBtn]}
                        onPress={() => handleAction(pub, 'delete')}
                      >
                        <Ionicons name="trash" size={16} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Dar de Baja</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* TAB 2: TODOS */}
          {activeTab === 'all' && (
            <View>
              {allPublications.map((pub) => (
                <View
                  key={pub.id}
                  style={[styles.simplePubCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.simplePubTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {pub.titulo}
                    </Text>
                    <Text style={styles.simplePubMeta}>
                      {pub.materia} • {pub.autor} • Estado: {pub.moderationStatus || 'approved'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.simpleDeleteBtn}
                    onPress={() => handleAction(pub, 'delete')}
                  >
                    <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: HISTORIAL DE AUDITORÍA */}
          {activeTab === 'logs' && (
            <View>
              {moderationLogs.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="file-tray" size={44} color="#94A3B8" />
                  <Text style={[styles.emptyTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    Sin acciones registradas aún
                  </Text>
                  <Text style={styles.emptyDesc}>
                    Las decisiones tomadas sobre los recursos reportados se registrarán aquí con sello temporal para auditoría de cátedra.
                  </Text>
                </View>
              ) : (
                moderationLogs.map((log) => (
                  <View
                    key={log.id}
                    style={[styles.logCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
                  >
                    <View style={styles.logHeader}>
                      <View style={[styles.logActionChip, log.action === 'delete' ? styles.chipRed : (log.action === 'hide' ? styles.chipYellow : styles.chipGreen)]}>
                        <Text style={styles.logActionText}>{log.action.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.logDate}>{log.date}</Text>
                    </View>
                    <Text style={[styles.logTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      Recurso: {log.pubTitle}
                    </Text>
                    <Text style={styles.logModerator}>
                      Moderador: {log.moderatorName}
                    </Text>
                    {log.moderatorNote ? (
                      <Text style={styles.logNote}>Nota: {log.moderatorNote}</Text>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  shieldIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#123B8E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#123B8E',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  reportCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  reportBadgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  reportBadgeText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  reportMateria: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  reportAuthor: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  reportReasonsList: {
    backgroundColor: '#FFF1F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  reportReasonHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9F1239',
    marginBottom: 4,
  },
  reportReasonItem: {
    fontSize: 11,
    color: '#BE123C',
    lineHeight: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  hideBtn: {
    backgroundColor: '#F59E0B',
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  simplePubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  simplePubTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  simplePubMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  simpleDeleteBtn: {
    padding: 8,
  },
  logCard: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  logActionChip: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  chipRed: { backgroundColor: '#FEE2E2' },
  chipYellow: { backgroundColor: '#FEF3C7' },
  chipGreen: { backgroundColor: '#D1FAE5' },
  logActionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
  },
  logDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  logTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  logModerator: {
    fontSize: 11,
    color: '#64748B',
  },
  logNote: {
    fontSize: 11,
    color: '#334155',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
