// src/components/Leaderboard.jsx
// Tabla de jugadores y posiciones persistida en localStorage (Plus 2).
// Consume el Contexto (no recibe props del padre).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { leaderboard, clearLeaderboard, playerName, score, savePlayerScoreToLeaderboard } = useGame();

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🏆 Tabla de Posiciones</Text>
          <Text style={styles.subtitle}>Ranking de los mejores puntajes</Text>
        </View>

        {score > 0 && (
          <TouchableOpacity style={styles.saveBtn} onPress={savePlayerScoreToLeaderboard} activeOpacity={0.7}>
            <Text style={styles.saveBtnText}>💾 Guardar actual</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de posiciones */}
      {leaderboard.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyTitle}>Sin puntuaciones registradas</Text>
          <Text style={styles.emptyDesc}>
            ¡Comienza a jugar y suma puntos para aparecer en el podio!
          </Text>
        </View>
      ) : (
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colHeader, styles.colRank]}>Pos</Text>
            <Text style={[styles.colHeader, styles.colPlayer]}>Jugador</Text>
            <Text style={[styles.colHeader, styles.colMode]}>Modo</Text>
            <Text style={[styles.colHeader, styles.colScore]}>Puntaje</Text>
          </View>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {leaderboard.map((item, index) => {
              const isCurrentPlayer = item.name.toLowerCase() === playerName.toLowerCase();

              return (
                <View
                  key={item.id || index}
                  style={[
                    styles.row,
                    index < 3 && styles.podiumRow,
                    isCurrentPlayer && styles.currentPlayerRow,
                  ]}
                >
                  <Text style={[styles.colCell, styles.colRank, styles.rankBadge]}>
                    {getRankBadge(index)}
                  </Text>

                  <View style={[styles.colPlayer, styles.playerInfo]}>
                    <Text style={[styles.playerNameText, isCurrentPlayer && styles.highlightText]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.date ? <Text style={styles.dateText}>{item.date}</Text> : null}
                  </View>

                  <Text style={[styles.colCell, styles.colMode, styles.modeTag]}>
                    {item.mode === 'capitals' ? '🏛️ Cap' : '🎌 Band'}
                  </Text>

                  <Text style={[styles.colCell, styles.colScore, styles.scoreValue]}>
                    {item.score} pts
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.clearBtn} onPress={clearLeaderboard} activeOpacity={0.7}>
            <Text style={styles.clearBtnText}>🗑️ Limpiar Ranking</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 440,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#ECFDF5',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyDesc: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
  tableCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  colHeader: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scrollList: {
    maxHeight: 260,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#33415522',
  },
  podiumRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  currentPlayerRow: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
  },
  colRank: {
    width: 40,
    textAlign: 'center',
  },
  colPlayer: {
    flex: 2,
    paddingLeft: 6,
  },
  colMode: {
    width: 70,
    textAlign: 'center',
  },
  colScore: {
    width: 75,
    textAlign: 'right',
  },
  colCell: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  rankBadge: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  playerInfo: {
    justifyContent: 'center',
  },
  playerNameText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  highlightText: {
    color: '#818CF8',
  },
  dateText: {
    color: '#64748B',
    fontSize: 10,
  },
  modeTag: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  scoreValue: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
  },
  clearBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
});
