// src/components/GuessForm.jsx
// Formulario para ingresar o seleccionar el país a adivinar.
// Consume el Contexto (no recibe props del padre).

import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { normalizeText, SPANISH_TRANSLATIONS } from '../utils/countryNames';

export default function GuessForm() {
  const {
    guessCountry,
    nextCountry,
    countries,
    feedback,
    isLoading,
    isTimerRunning,
    gameMode,
  } = useGame();

  const [inputVal, setInputVal] = useState('');

  // Sugerencias de autocompletado basadas en lo que escribe el usuario
  const suggestions = useMemo(() => {
    const query = normalizeText(inputVal);
    if (!query || query.length < 2) return [];

    const matches = [];
    for (let c of countries) {
      if (matches.length >= 5) break;
      const originalNorm = normalizeText(c.name);
      const spanishNorm = normalizeText(SPANISH_TRANSLATIONS[originalNorm] || '');

      if (originalNorm.startsWith(query) || spanishNorm.startsWith(query)) {
        // Mostrar nombre en español si existe o nombre original
        const displayLabel = SPANISH_TRANSLATIONS[originalNorm]
          ? `${c.name} (${SPANISH_TRANSLATIONS[originalNorm]})`
          : c.name;
        matches.push({ raw: c.name, label: displayLabel });
      }
    }
    return matches;
  }, [inputVal, countries]);

  if (gameMode !== 'flags') return null;

  const handleSubmit = (overrideText) => {
    const textToGuess = overrideText || inputVal;
    if (!textToGuess.trim()) return;

    guessCountry(textToGuess);
    setInputVal('');
  };

  return (
    <View style={styles.container}>
      {/* Mensaje de Feedback (acierto, error, etc.) */}
      {feedback && (
        <View
          style={[
            styles.feedbackBox,
            feedback.type === 'success' && styles.feedbackSuccess,
            feedback.type === 'error' && styles.feedbackError,
            feedback.type === 'warning' && styles.feedbackWarning,
            feedback.type === 'info' && styles.feedbackInfo,
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              feedback.type === 'success' && styles.feedbackSuccessText,
              feedback.type === 'error' && styles.feedbackErrorText,
              feedback.type === 'warning' && styles.feedbackWarningText,
              feedback.type === 'info' && styles.feedbackInfoText,
            ]}
          >
            {feedback.message}
          </Text>
        </View>
      )}

      {/* Input de texto para arriesgar */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Escribe el nombre del país..."
          placeholderTextColor="#64748B"
          value={inputVal}
          onChangeText={setInputVal}
          onSubmitEditing={() => handleSubmit()}
          autoCapitalize="words"
          autoCorrect={false}
          editable={!isLoading && isTimerRunning}
          returnKeyType="done"
        />

        {inputVal.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setInputVal('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sugerencias de autocompletado tipo chips */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Sugerencias:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
            {suggestions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionChip}
                onPress={() => handleSubmit(item.raw)}
              >
                <Text style={styles.suggestionChipText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Botones de acción */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.submitButton, (!inputVal.trim() || !isTimerRunning) && styles.submitButtonDisabled]}
          onPress={() => handleSubmit()}
          disabled={!inputVal.trim() || !isTimerRunning}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Arriesgar País</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={nextCountry}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Pasar ⏭️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    marginVertical: 6,
    alignItems: 'center',
  },
  feedbackBox: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  feedbackError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  feedbackWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
  },
  feedbackInfo: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: '#6366F1',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  feedbackSuccessText: {
    color: '#34D399',
  },
  feedbackErrorText: {
    color: '#F87171',
  },
  feedbackWarningText: {
    color: '#FBBF24',
  },
  feedbackInfoText: {
    color: '#A5B4FC',
  },
  inputRow: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#1E293B',
    color: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    fontWeight: '500',
    paddingRight: 40,
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: 8,
  },
  suggestionsTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionsScroll: {
    gap: 6,
    paddingBottom: 4,
  },
  suggestionChip: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#475569',
  },
  suggestionChipText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 12,
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#4F46E5',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#334155',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  skipButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
});
