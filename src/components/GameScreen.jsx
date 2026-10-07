// src/components/GameScreen.jsx
// Pantalla principal del juego que reúne e integra todos los componentes.
// Consume el Contexto (GameContext). Todo en JavaScript puro y fácil de entender.

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useGame } from '../context/GameContext';
import Flag from './Flag';
import Timer from './Timer';
import ScoreBoard from './ScoreBoard';
import GuessForm from './GuessForm';
import CapitalOptions from './CapitalOptions';
import Clues from './Clues';
import Leaderboard from './Leaderboard';
import PlayerModal from './PlayerModal';

export default function GameScreen() {
  const { gameMode } = useGame();
  const [activeTab, setActiveTab] = useState('game'); // 'game' o 'ranking'

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Encabezado principal de la aplicación */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.appEmoji}>🌍</Text>
              <Text style={styles.appTitle}>Country Guesser</Text>
            </View>
            <Text style={styles.appSubtitle}>TP 11 - Banderas y Capitales</Text>

            {/* Pestañas de Navegación: Juego vs Ranking */}
            <View style={styles.navTabs}>
              <TouchableOpacity
                style={[styles.navTab, activeTab === 'game' && styles.navTabActive]}
                onPress={() => setActiveTab('game')}
                activeOpacity={0.7}
              >
                <Text style={[styles.navTabText, activeTab === 'game' && styles.navTabTextActive]}>
                  🎮 Jugar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navTab, activeTab === 'ranking' && styles.navTabActive]}
                onPress={() => setActiveTab('ranking')}
                activeOpacity={0.7}
              >
                <Text style={[styles.navTabText, activeTab === 'ranking' && styles.navTabTextActive]}>
                  🏆 Ranking
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Vista 1: Pantalla de Juego */}
          {activeTab === 'game' && (
            <View style={styles.gameContainer}>
              {/* 1. ScoreBoard: Puntaje, Racha, Jugador y Modos */}
              <ScoreBoard />

              {/* 2. Timer: Cuenta regresiva de 15 segundos */}
              <Timer />

              {/* 3. Flag: Bandera del país actual */}
              <Flag />

              {/* 4. Clues: Pistas con letras descubiertas (Modo Bandera) */}
              <Clues />

              {/* 5. GuessForm o CapitalOptions según modo */}
              {gameMode === 'flags' ? <GuessForm /> : <CapitalOptions />}
            </View>
          )}

          {/* Vista 2: Tabla de Posiciones y Ranking */}
          {activeTab === 'ranking' && (
            <View style={styles.rankingContainer}>
              <Leaderboard />
            </View>
          )}

          {/* Pie de página descriptivo */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Desarrollado con React Native + Context API</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal para editar nombre de jugador (consume Context) */}
      <PlayerModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appEmoji: {
    fontSize: 26,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#818CF8',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 4,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    maxWidth: 280,
  },
  navTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  navTabActive: {
    backgroundColor: '#4F46E5',
  },
  navTabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  navTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  gameContainer: {
    width: '100%',
    alignItems: 'center',
  },
  rankingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    marginTop: 24,
    paddingVertical: 12,
  },
  footerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },
});
