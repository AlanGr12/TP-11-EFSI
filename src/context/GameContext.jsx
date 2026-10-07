// src/context/GameContext.jsx
// Contexto central del juego: maneja estado, consumo de APIs, puntuación, timer, pistas y ranking

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { checkCountryMatch, normalizeText } from '../utils/countryNames';
import { FALLBACK_COUNTRIES } from '../utils/countriesFallback';
import { storage } from '../utils/storage';

// Creamos el contexto del juego
const GameContext = createContext();

// URLs de las APIs requeridas
const FLAGS_API_URL = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const CAPITALS_API_URL = 'https://countriesnow.space/api/v0.1/countries/capital';

const LEADERBOARD_STORAGE_KEY = 'TP11_GAME_LEADERBOARD';
const PLAYER_NAME_KEY = 'TP11_PLAYER_NAME';
const TIMER_SECONDS = 15;

export function GameProvider({ children }) {
  // 1. Estados principales del juego
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [gameMode, setGameMode] = useState('flags'); // 'flags' o 'capitals'
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // 2. Estado de jugador y multijugador
  const [playerName, setPlayerName] = useState(() => {
    return storage.getItem(PLAYER_NAME_KEY) || 'Jugador 1';
  });
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = storage.getItem(LEADERBOARD_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Estado del Timer (Plus 1)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // 4. Estado de Pistas (Plus 3)
  // Indices de las letras reveladas del nombre del país actual
  const [revealedIndices, setRevealedIndices] = useState([]);

  // 5. Estado de opciones para Modo Capitales (Plus 4)
  const [capitalOptions, setCapitalOptions] = useState([]);
  const [hiddenCapitalOptions, setHiddenCapitalOptions] = useState([]); // opciones eliminadas por pistas

  // 6. Estado de Feedback visual (acierto, error, tiempo agotado)
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error' | 'warning', message: '' }

  // Referencias para evitar bugs con intervalos
  const countriesRef = useRef([]);
  countriesRef.current = countries;
  const currentCountryRef = useRef(null);
  currentCountryRef.current = currentCountry;
  const gameModeRef = useRef(gameMode);
  gameModeRef.current = gameMode;
  const isTimerRunningRef = useRef(isTimerRunning);
  isTimerRunningRef.current = isTimerRunning;

  // -------------------------------------------------------------
  // EFECTO 1: Traer los países de las APIs al montar el componente
  // -------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function fetchCountriesData() {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        // Hacemos fetch en paralelo de banderas y capitales
        const [flagsRes, capitalsRes] = await Promise.allSettled([
          fetch(FLAGS_API_URL).then((r) => r.json()),
          fetch(CAPITALS_API_URL).then((r) => r.json()),
        ]);

        let flagsData = [];
        let capitalsMap = {};

        // Procesar respuesta de banderas
        if (flagsRes.status === 'fulfilled' && flagsRes.value && !flagsRes.value.error) {
          flagsData = flagsRes.value.data || [];
        }

        // Procesar respuesta de capitales
        if (capitalsRes.status === 'fulfilled' && capitalsRes.value && !capitalsRes.value.error) {
          const list = capitalsRes.value.data || [];
          list.forEach((item) => {
            if (item && item.name) {
              capitalsMap[normalizeText(item.name)] = item.capital || '';
            }
          });
        }

        // Unificar datos
        let unifiedList = [];
        if (flagsData.length > 0) {
          unifiedList = flagsData
            .filter((item) => item && item.name && item.flag && item.flag.startsWith('http'))
            .map((item) => {
              const normName = normalizeText(item.name);
              return {
                name: item.name.trim(),
                flag: item.flag,
                iso2: item.iso2 || '',
                iso3: item.iso3 || '',
                capital: capitalsMap[normName] || '',
              };
            });
        }

        // Si la API falló o devolvió lista vacía, usamos el fallback
        if (unifiedList.length === 0) {
          console.warn('Usando lista de países fallback');
          unifiedList = FALLBACK_COUNTRIES;
        }

        if (isMounted) {
          setCountries(unifiedList);
          // Elegir uno al azar al montar
          pickRandomCountry(unifiedList, gameMode);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error al cargar países:', err);
        if (isMounted) {
          // En caso de excepción, cargar países de respaldo
          setCountries(FALLBACK_COUNTRIES);
          pickRandomCountry(FALLBACK_COUNTRIES, gameMode);
          setIsLoading(false);
        }
      }
    }

    fetchCountriesData();

    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------------------------------------------
  // FUNCIÓN: Elegir un país al azar y configurar opciones / pistas
  // -------------------------------------------------------------
  const pickRandomCountry = (list = countriesRef.current, mode = gameModeRef.current) => {
    if (!list || list.length === 0) return;

    // Si estamos en modo capitales, preferir países que tengan capital definida
    let pool = list;
    if (mode === 'capitals') {
      const withCapitals = list.filter((c) => c.capital && c.capital.trim().length > 0);
      if (withCapitals.length > 0) pool = withCapitals;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    setCurrentCountry(chosen);
    setRevealedIndices([]);
    setHiddenCapitalOptions([]);
    setTimeLeft(TIMER_SECONDS);
    setIsTimerRunning(true);
    setFeedback(null);

    // Preparar opciones de capitales si es modo capitales (1 correcta + 2 distractores)
    if (mode === 'capitals' && chosen.capital) {
      generateCapitalOptions(chosen, list);
    }
  };

  // Genera 3 opciones para modo capitales (1 correcta + 2 distractores al azar)
  const generateCapitalOptions = (targetCountry, allCountriesList) => {
    const correctCapital = targetCountry.capital;
    const distractors = allCountriesList
      .filter((c) => c.capital && c.capital !== correctCapital)
      .map((c) => c.capital);

    // Seleccionar 2 distractores distintos
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());
    const options = [correctCapital];

    for (let cap of shuffledDistractors) {
      if (options.length >= 3) break;
      if (!options.includes(cap)) {
        options.push(cap);
      }
    }

    // Mezclar las 3 opciones
    const finalShuffled = [...options].sort(() => 0.5 - Math.random());
    setCapitalOptions(finalShuffled);
  };

  // -------------------------------------------------------------
  // EFECTO 2: Timer de cuenta regresiva (15s por país)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isTimerRunning || isLoading || !currentCountry) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // El tiempo se terminó!
          handleTimeExpired();
          return 0;
        }

        // En Modo Capitales (Plus 4): se borra una opción cada 5 segundos transcurridos
        // A los 10 segundos restantes (pasaron 5s) se borra una opción errónea
        // A los 5 segundos restantes (pasaron 10s) se borra otra opción errónea
        if (gameModeRef.current === 'capitals' && (prev === 11 || prev === 6)) {
          eliminateWrongCapitalOption();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isTimerRunning, isLoading, currentCountry]);

  // Manejo de tiempo expirado
  const handleTimeExpired = () => {
    setIsTimerRunning(false);
    const country = currentCountryRef.current;
    const answerName = gameModeRef.current === 'capitals' ? country?.capital : country?.name;

    setStreak(0);
    setFeedback({
      type: 'warning',
      message: `⏰ ¡Tiempo agotado! La respuesta correcta era: ${answerName}`,
    });

    // Guardar en ranking si tiene puntaje acumulado
    savePlayerScoreToLeaderboard();

    // Avanzar a la siguiente bandera tras 2 segundos
    setTimeout(() => {
      setRound((r) => r + 1);
      pickRandomCountry();
    }, 2200);
  };

  // -------------------------------------------------------------
  // FUNCIÓN: Arriesgar País (Modo Bandera)
  // -------------------------------------------------------------
  const guessCountry = (userGuess) => {
    if (!currentCountry || !isTimerRunning) return false;

    const isCorrect = checkCountryMatch(userGuess, currentCountry.name);

    if (isCorrect) {
      // REGLAS:
      // Si acierta: suma 10 puntos + los segundos restantes del timer!
      const bonusSeconds = timeLeft;
      const pointsEarned = 10 + bonusSeconds;

      const newScore = score + pointsEarned;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setIsTimerRunning(false);

      setFeedback({
        type: 'success',
        message: `¡Excelente! 🎉 Adivinaste ${currentCountry.name}. (+10 pts + ${bonusSeconds}s bonus = +${pointsEarned} pts)`,
        pointsDelta: pointsEarned,
      });

      // Pasar al siguiente país tras una breve pausa
      setTimeout(() => {
        setRound((r) => r + 1);
        pickRandomCountry();
      }, 1400);

      return true;
    } else {
      // Si falla: resta 1 punto
      setScore((prev) => Math.max(0, prev - 1));
      setStreak(0);
      setFeedback({
        type: 'error',
        message: '¡Incorrecto! ❌ Intenta de nuevo (-1 punto)',
        pointsDelta: -1,
      });
      return false;
    }
  };

  // -------------------------------------------------------------
  // FUNCIÓN: Arriesgar Capital (Modo Capitales)
  // -------------------------------------------------------------
  const guessCapital = (selectedCapital) => {
    if (!currentCountry || !isTimerRunning) return false;

    const isCorrect = selectedCapital === currentCountry.capital;

    if (isCorrect) {
      const bonusSeconds = timeLeft;
      const pointsEarned = 10 + bonusSeconds;

      const newScore = score + pointsEarned;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setIsTimerRunning(false);

      setFeedback({
        type: 'success',
        message: `¡Correcto! 🏛️ La capital de ${currentCountry.name} es ${selectedCapital}. (+10 + ${bonusSeconds}s bonus = +${pointsEarned} pts)`,
        pointsDelta: pointsEarned,
      });

      setTimeout(() => {
        setRound((r) => r + 1);
        pickRandomCountry();
      }, 1400);

      return true;
    } else {
      // Descuenta 1 punto y elimina la opción errónea seleccionada
      setScore((prev) => Math.max(0, prev - 1));
      setStreak(0);
      setHiddenCapitalOptions((prev) => [...prev, selectedCapital]);
      setFeedback({
        type: 'error',
        message: `¡Incorrecto! ${selectedCapital} no es la capital (-1 punto)`,
        pointsDelta: -1,
      });
      return false;
    }
  };

  // -------------------------------------------------------------
  // PISTAS (Plus 3):
  // Revela una letra al azar y descuenta 2 segundos del timer
  // -------------------------------------------------------------
  const requestHint = () => {
    if (!currentCountry || !isTimerRunning) return;

    // Descontar 2 segundos del timer
    setTimeLeft((prev) => Math.max(0, prev - 2));

    if (gameMode === 'flags') {
      // Revelar letra al azar que no haya sido revelada aún
      const name = currentCountry.name.toUpperCase();
      const unrevealed = [];

      for (let i = 0; i < name.length; i++) {
        const char = name[i];
        // Ignorar espacios y caracteres especiales
        if (char >= 'A' && char <= 'Z') {
          if (!revealedIndices.includes(i)) {
            unrevealed.push(i);
          }
        }
      }

      if (unrevealed.length > 0) {
        const randomPos = unrevealed[Math.floor(Math.random() * unrevealed.length)];
        setRevealedIndices((prev) => [...prev, randomPos]);
        setFeedback({
          type: 'info',
          message: '💡 Pista revelada: -2 segundos en el timer',
        });
      } else {
        setFeedback({
          type: 'info',
          message: '💡 ¡Ya se han revelado casi todas las letras!',
        });
      }
    } else if (gameMode === 'capitals') {
      // En modo capitales: pedir pista elimina una opción errónea
      eliminateWrongCapitalOption();
      setFeedback({
        type: 'info',
        message: '💡 Pista: Se descartó una opción errónea (-2 segundos)',
      });
    }
  };

  // Elimina una opción errónea de las 3 opciones de capital
  const eliminateWrongCapitalOption = () => {
    if (!currentCountry || capitalOptions.length === 0) return;

    const wrongAvailable = capitalOptions.filter(
      (opt) => opt !== currentCountry.capital && !hiddenCapitalOptions.includes(opt)
    );

    if (wrongAvailable.length > 0) {
      const toEliminate = wrongAvailable[0];
      setHiddenCapitalOptions((prev) => [...prev, toEliminate]);
    }
  };

  // Cadena enmascarada para mostrar pistas: ej. "A _ G _ N _ _ N _"
  const getMaskedCountryName = () => {
    if (!currentCountry) return '';
    const name = currentCountry.name.toUpperCase();
    return name
      .split('')
      .map((char, index) => {
        if (char < 'A' || char > 'Z') return char; // espacios o guiones
        if (revealedIndices.includes(index)) return char;
        return '_';
      })
      .join(' ');
  };

  // -------------------------------------------------------------
  // MULTIJUGADOR & RANKING (Plus 2)
  // Guardar puntaje en localStorage y actualizar tabla de posiciones
  // -------------------------------------------------------------
  const updatePlayerName = (name) => {
    const trimmed = name.trim() || 'Jugador 1';
    setPlayerName(trimmed);
    storage.setItem(PLAYER_NAME_KEY, trimmed);
  };

  const savePlayerScoreToLeaderboard = () => {
    if (score <= 0) return;

    setLeaderboard((prev) => {
      // Buscar si el jugador ya existe en la tabla
      const existingIndex = prev.findIndex(
        (entry) => entry.name.toLowerCase() === playerName.toLowerCase() && entry.mode === gameMode
      );

      let updated = [...prev];

      if (existingIndex >= 0) {
        // Actualizar solo si el nuevo puntaje es mayor
        if (score > updated[existingIndex].score) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            score: score,
            date: new Date().toLocaleDateString(),
          };
        }
      } else {
        // Agregar nuevo registro
        updated.push({
          id: Date.now().toString(),
          name: playerName,
          score: score,
          mode: gameMode,
          date: new Date().toLocaleDateString(),
        });
      }

      // Ordenar de mayor a menor puntaje
      updated.sort((a, b) => b.score - a.score);

      // Limitar a top 10
      updated = updated.slice(0, 10);

      storage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearLeaderboard = () => {
    setLeaderboard([]);
    storage.removeItem(LEADERBOARD_STORAGE_KEY);
  };

  // -------------------------------------------------------------
  // ACCIONES GENERALES
  // -------------------------------------------------------------
  const nextCountry = () => {
    savePlayerScoreToLeaderboard();
    setRound((r) => r + 1);
    pickRandomCountry();
  };

  const resetScore = () => {
    savePlayerScoreToLeaderboard();
    setScore(0);
    setStreak(0);
    setRound(1);
    pickRandomCountry();
  };

  const switchMode = (newMode) => {
    if (newMode === gameMode) return;
    savePlayerScoreToLeaderboard();
    setGameMode(newMode);
    gameModeRef.current = newMode;
    setRound(1);
    pickRandomCountry(countriesRef.current, newMode);
  };

  // Valor expuesto a todos los componentes consumidores
  const value = {
    // Datos y estados
    countries,
    currentCountry,
    score,
    streak,
    round,
    gameMode,
    isLoading,
    errorMsg,
    playerName,
    leaderboard,
    timeLeft,
    maxTime: TIMER_SECONDS,
    isTimerRunning,
    revealedIndices,
    capitalOptions,
    hiddenCapitalOptions,
    feedback,
    maskedCountryName: getMaskedCountryName(),
    isPlayerModalOpen,

    // Acciones y funciones
    openPlayerModal: () => setIsPlayerModalOpen(true),
    closePlayerModal: () => setIsPlayerModalOpen(false),
    guessCountry,
    guessCapital,
    requestHint,
    nextCountry,
    resetScore,
    switchMode,
    updatePlayerName,
    savePlayerScoreToLeaderboard,
    clearLeaderboard,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Hook personalizado para consumir el contexto fácilmente
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe ser utilizado dentro de un GameProvider');
  }
  return context;
}

export default GameContext;
