// src/components/ScoreBoard.jsx
// Muestra el puntaje actual en todo momento, racha, ronda, jugador y selector de modo.
// Consume el Contexto (no recibe props del padre).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '../context/GameContext';

export default function ScoreBoard() {
  const {
    score,
    streak,
    round,
    playerName,
    gameMode,
    switchMode,
    resetScore,
    openPlayerModal,
  } = useGame();

  return (
    <View style={styles.container}>
      {/* Barra superior: Jugador y Modos de Juego */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.playerBadge}
          onPress={openPlayerModal}
          activeOpacity={0.7}
        >
          <Text style={styles.playerIcon}>👤</Text>
          <Text style={styles.playerName} numberOfLines={1}>
            {playerName}
          </Text>
          <Text style={styles.editHint}>✎</Text>
        </TouchableOpacity>

        {/* Selector de Modo: Bandera vs Capitales (Plus 4) */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, gameMode === 'flags' && styles.modeTabActive]}
            onPress={() => switchMode('flags')}
          >
            <Text style={[styles.modeTabText, gameMode === 'flags' && styles.modeTabTextActive]}>
              🎌 Bandera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, gameMode === 'capitals' && styles.modeTabActive]}
            onPress={() => switchMode('capitals')}
          >
            <Text style={[styles.modeTabText, gameMode === 'capitals' && styles.modeTabTextActive]}>
              🏛️ Capitales
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tarjeta central de estadísticas */}
      <View style={styles.statsCard}>
        {/* Puntos Actuales */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Puntos</Text>
          <Text style={styles.scoreNumber}>{score}</Text>
        </View>

        <View style={styles.divider} />

        {/* Racha de Aciertos */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Racha</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakFire}>{streak > 0 ? '🔥' : '❄️'}</Text>
            <Text style={styles.streakNumber}>{streak}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Ronda */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Ronda</Text>
          <Text style={styles.roundNumber}>#{round}</Text>
        </View>
      </View>

      {/* Reglas breves de puntuación */}
      <View style={styles.rulesRow}>
        <Text style={styles.ruleBadgeSuccess}>+10 Acierto</Text>
        <Text style={styles.ruleBadgeBonus}>+Segundos Bonus</Text>
        <Text style={styles.ruleBadgeError}>-1 Fallo</Text>
        <TouchableOpacity onPress={resetScore} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    marginVertical: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    maxWidth: 150,
  },
  playerIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  playerName: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 13,
  },
  editHint: {
    color: '#818CF8',
    marginLeft: 6,
    fontSize: 12,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modeTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  modeTabActive: {
    backgroundColor: '#6366F1',
  },
  modeTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  scoreNumber: {
    color: '#38BDF8',
    fontSize: 26,
    fontWeight: '900',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#334155',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  streakFire: {
    fontSize: 18,
  },
  streakNumber: {
    color: '#F97316',
    fontSize: 22,
    fontWeight: '900',
  },
  roundNumber: {
    color: '#E2E8F0',
    fontSize: 22,
    fontWeight: '800',
  },
  rulesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 6,
    flexWrap: 'wrap',
  },
  ruleBadgeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ruleBadgeBonus: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ruleBadgeError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#F87171',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
});
