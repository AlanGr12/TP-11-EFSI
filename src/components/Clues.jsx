// src/components/Clues.jsx
// Muestra las pistas de letras reveladas en modo bandera.
// Consume el Contexto (no recibe props del padre).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Clues() {
  const { maskedCountryName, requestHint, timeLeft, gameMode } = useGame();

  if (gameMode !== 'flags') return null;

  return (
    <View style={styles.container}>
      {/* Visualización de letras descubiertas */}
      <View style={styles.maskedBox}>
        <Text style={styles.maskedTitle}>Pista de letras:</Text>
        <Text style={styles.maskedLetters}>{maskedCountryName || '_ _ _ _'}</Text>
      </View>

      {/* Botón para solicitar una pista */}
      <TouchableOpacity
        style={[styles.hintButton, timeLeft <= 2 && styles.hintButtonDisabled]}
        onPress={requestHint}
        disabled={timeLeft <= 2}
        activeOpacity={0.7}
      >
        <Text style={styles.hintButtonText}>💡 Revelar letra (-2s)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 380,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  maskedBox: {
    flex: 1,
  },
  maskedTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  maskedLetters: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  hintButton: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  hintButtonDisabled: {
    backgroundColor: '#1E293B',
    borderColor: '#475569',
    opacity: 0.5,
  },
  hintButtonText: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '700',
  },
});
