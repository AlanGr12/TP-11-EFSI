// src/components/CapitalOptions.jsx
// Muestra las 3 opciones de capitales en el Modo Capitales (Plus 4).
// Se elimina una opción errónea cada 5 segundos como pista.
// Consume el Contexto (no recibe props del padre).

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function CapitalOptions() {
  const {
    currentCountry,
    capitalOptions,
    hiddenCapitalOptions,
    guessCapital,
    requestHint,
    nextCountry,
    feedback,
    isTimerRunning,
    timeLeft,
    gameMode,
  } = useGame();

  if (gameMode !== 'capitals' || !currentCountry) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuál es la capital de {currentCountry.name}?</Text>

      {/* Mensaje de feedback */}
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

      {/* Las 3 opciones de capitales */}
      <View style={styles.optionsList}>
        {capitalOptions.map((capital, index) => {
          const isEliminated = hiddenCapitalOptions.includes(capital);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isEliminated && styles.optionEliminated,
                !isTimerRunning && styles.optionDisabled,
              ]}
              onPress={() => guessCapital(capital)}
              disabled={isEliminated || !isTimerRunning}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  isEliminated && styles.optionEliminatedText,
                ]}
              >
                {isEliminated ? `❌ ${capital}` : `🏛️ ${capital}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Barra de ayuda y controles de capitales */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.hintBtn, timeLeft <= 2 && styles.hintBtnDisabled]}
          onPress={requestHint}
          disabled={timeLeft <= 2 || !isTimerRunning}
          activeOpacity={0.7}
        >
          <Text style={styles.hintBtnText}>💡 Descartar opción (-2s)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={nextCountry} activeOpacity={0.7}>
          <Text style={styles.skipBtnText}>Pasar ⏭️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.autoHintNotice}>
        ℹ️ Cada 5s se descartará automáticamente una opción errónea.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    marginVertical: 8,
    alignItems: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  feedbackBox: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
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
  optionsList: {
    width: '100%',
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  optionEliminated: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    opacity: 0.35,
  },
  optionDisabled: {
    opacity: 0.7,
  },
  optionText: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },
  optionEliminatedText: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  bottomBar: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 14,
  },
  hintBtn: {
    flex: 2,
    backgroundColor: '#3730A3',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  hintBtnDisabled: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    opacity: 0.5,
  },
  hintBtnText: {
    color: '#E0E7FF',
    fontSize: 13,
    fontWeight: '700',
  },
  skipBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  skipBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  autoHintNotice: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
