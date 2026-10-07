// src/components/Flag.jsx
// Componente que muestra la bandera actual a adivinar.
// Consume el Contexto (no recibe props del padre).

import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Image } from 'expo-image';
import { useGame } from '../context/GameContext';

export default function Flag() {
  const { currentCountry, isLoading } = useGame();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (isLoading || !currentCountry) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.loadingCard]}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando bandera...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {imageLoading && (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="small" color="#818CF8" />
          </View>
        )}

        {imageError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorEmoji}>🏳️</Text>
            <Text style={styles.errorText}>No se pudo cargar la imagen</Text>
            <Text style={styles.errorSub}>{currentCountry.name}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: currentCountry.flag }}
            style={styles.flagImage}
            contentFit="contain"
            transition={300}
            onLoadStart={() => setImageLoading(true)}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        )}
      </View>

      <Text style={styles.helpText}>¿A qué país pertenece esta bandera?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 320,
    height: 190,
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#334155',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingCard: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  flagImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    zIndex: 1,
  },
  errorBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  errorSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  helpText: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
