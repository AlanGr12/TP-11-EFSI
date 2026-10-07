// src/app/_layout.tsx
// Layout principal que provee el GameContext a toda la aplicación.
// 100% JavaScript (sin TypeScript).

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../context/GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
      </Stack>
    </GameProvider>
  );
}
