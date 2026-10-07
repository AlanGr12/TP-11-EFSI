// src/app/explore.tsx
// Pantalla de tabla de posiciones e información (100% JavaScript puro)

import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { router } from 'expo-router';
import Leaderboard from '../components/Leaderboard';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Volver al Juego</Text>
        </TouchableOpacity>

        <Leaderboard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backButtonText: {
    color: '#818CF8',
    fontWeight: '700',
    fontSize: 13,
  },
});
