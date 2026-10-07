// src/components/Timer.jsx
// Componente de cuenta regresiva (15s por bandera).
// Si el jugador acierta antes de que termine, los segundos restantes se suman al puntaje.
// Consume el Contexto (no recibe props del padre).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Timer() {
  const { timeLeft, maxTime, isTimerRunning } = useGame();

  // Porcentaje del tiempo restante (0 a 100%)
  const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  // Color dinámico según la urgencia del reloj
  const getColor = () => {
    if (timeLeft > 7) return '#10B981'; // Verde
    if (timeLeft > 3) return '#F59E0B'; // Amarillo / Ámbar
    return '#EF4444'; // Rojo urgente
  };

  const timerColor = getColor();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.badgeLeft}>
          <Text style={styles.icon}>⏱️</Text>
          <Text style={styles.label}>Tiempo</Text>
        </View>

        <View style={[styles.secondsPill, { backgroundColor: `${timerColor}22`, borderColor: timerColor }]}>
          <Text style={[styles.secondsText, { color: timerColor }]}>
            {timeLeft}s
          </Text>
        </View>
      </View>

      {/* Barra de progreso animada */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: timerColor,
            },
          ]}
        />
      </View>

      <Text style={styles.hintText}>
        {isTimerRunning
          ? `¡Bonus: Sumarás +${timeLeft} pts extras si aciertas ahora!`
          : 'Tiempo pausado'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  secondsPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondsText: {
    fontSize: 15,
    fontWeight: '800',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  hintText: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
});
