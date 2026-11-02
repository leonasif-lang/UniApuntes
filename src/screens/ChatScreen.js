import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { useMessages } from '../context/MessagesContext';

export default function ChatScreen({ conversation, onBack }) {
  const { conversations, sendMessage } = useMessages();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  // Obtener la conversación actualizada desde el contexto
  const currentChat =
    conversations.find((c) => c.id === conversation?.id) || conversation || {
      id: 'default',
      authorName: 'Compañero',
      authorInitial: 'C',
      resourceTitle: 'Recurso Académico',
      messages: [],
    };

  const quickReplies = [
    '¿Tenés el apunte en PDF?',
    '¿En qué aula o sede cursás?',
    '¿Está actualizado para este cuatrimestre?',
    '¡Muchas gracias!',
  ];

  const handleSend = (textToSend) => {
    const message = (textToSend || inputText).trim();
    if (!message) return;

    sendMessage(currentChat.id, message);
    setInputText('');
  };

  useEffect(() => {
    // Desplazar al final al recibir un nuevo mensaje
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [currentChat.messages]);

  const renderMessageBubble = ({ item }) => {
    const isMe = item.sender === 'me';

    return (
      <View style={[styles.bubbleWrapper, isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperOther]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeOther]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header del Chat */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primaryDark} />
        </TouchableOpacity>

        <View style={styles.headerAvatarCircle}>
          <Text style={styles.headerAvatarInitial}>{currentChat.authorInitial}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{currentChat.authorName}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>En línea • Comunidad UNP</Text>
          </View>
        </View>
      </View>

      {/* Banner de Referencia del Apunte */}
      <View style={styles.referenceBanner}>
        <Ionicons name="document-text-outline" size={16} color={colors.primary} />
        <Text style={styles.referenceText} numberOfLines={1}>
          Consulta sobre: <Text style={styles.referenceHighlight}>{currentChat.resourceTitle}</Text>
        </Text>
      </View>

      {/* Lista de Mensajes */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={currentChat.messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageBubble}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Sugerencias de Respuestas Rápidas */}
        <View style={styles.quickRepliesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesScroll}>
            {quickReplies.map((reply, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickReplyChip}
                onPress={() => handleSend(reply)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Barra de Entrada de Texto */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribí un mensaje..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend(inputText)}
            returnKeyType="send"
          />

          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSend(inputText)}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="paper-plane" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarInitial: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.green,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  referenceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D9E6FF',
    gap: 8,
  },
  referenceText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    flex: 1,
  },
  referenceHighlight: {
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bubbleWrapperMe: {
    justifyContent: 'flex-end',
  },
  bubbleWrapperOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...shadows.small,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  messageTextMe: {
    color: colors.white,
  },
  messageTextOther: {
    color: colors.textPrimary,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeMe: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  messageTimeOther: {
    color: colors.textSecondary,
  },
  quickRepliesContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 6,
  },
  quickRepliesScroll: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  quickReplyChip: {
    backgroundColor: colors.tagBg,
    borderRadius: borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickReplyText: {
    fontSize: typography.sizes.xs,
    color: colors.primaryDark,
    fontWeight: typography.weights.medium,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.tagBg,
    borderRadius: borderRadius.full,
    paddingHorizontal: 16,
    height: 42,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  sendButtonDisabled: {
    backgroundColor: '#A0AEC0',
    opacity: 0.6,
  },
});
