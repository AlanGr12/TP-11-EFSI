// src/components/PlayerModal.jsx
// Modal para ingresar o cambiar el nombre del jugador para el ranking multijugador.
// Consume el Contexto (no recibe props del padre).

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useGame } from '../context/GameContext';

export default function PlayerModal() {
  const { playerName, updatePlayerName, isPlayerModalOpen, closePlayerModal } = useGame();
  const [tempName, setTempName] = useState(playerName);

  const handleSave = () => {
    if (tempName.trim()) {
      updatePlayerName(tempName);
    }
    closePlayerModal();
  };

  return (
    <Modal
      transparent
      visible={isPlayerModalOpen}
      animationType="fade"
      onRequestClose={closePlayerModal}
    >
      <TouchableWithoutFeedback onPress={closePlayerModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <Text style={styles.title}>👤 Perfil de Jugador</Text>
              <Text style={styles.subtitle}>
                Tu nombre aparecerá en la tabla de clasificación
              </Text>

              {/* Input para el nombre */}
              <TextInput
                style={styles.input}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Ingresa tu nombre o apodo"
                placeholderTextColor="#64748B"
                maxLength={20}
                autoFocus
              />

              {/* Botones de acción */}
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={closePlayerModal} activeOpacity={0.7}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmBtn} onPress={handleSave} activeOpacity={0.7}>
                  <Text style={styles.confirmBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    marginBottom: 18,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#CBD5E1',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
