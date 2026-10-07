// src/utils/storage.js
// Helper seguro para almacenar y recuperar datos (compatible con Web y Mobile)

export const storage = {
  // Obtener un valor guardado en localStorage
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('Error al leer de localStorage:', error);
    }
    return null;
  },

  // Guardar un valor en localStorage
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Error al guardar en localStorage:', error);
    }
  },

  // Eliminar un valor de localStorage
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Error al eliminar de localStorage:', error);
    }
  },
};
