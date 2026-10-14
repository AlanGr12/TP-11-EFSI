import axios from 'axios';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { FALLBACK_COUNTRIES } from '../utils/countriesFallback';
import { checkCountryMatch, normalizeText } from '../utils/countryNames';
import { storage } from '../utils/storage';

const GameContext = createContext();

const FLAGS_API_URL = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const CAPITALS_API_URL = 'https://countriesnow.space/api/v0.1/countries/capital';

const LEADERBOARD_STORAGE_KEY = 'TP11_GAME_LEADERBOARD';
const PLAYER_NAME_KEY = 'TP11_PLAYER_NAME';
const TIMER_SECONDS = 15;

export function GameProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [gameMode, setGameMode] = useState('flags');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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

  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const [revealedIndices, setRevealedIndices] = useState([]);

  const [capitalOptions, setCapitalOptions] = useState([]);
  const [hiddenCapitalOptions, setHiddenCapitalOptions] = useState([]);

  const [feedback, setFeedback] = useState(null);

  const countriesRef = useRef([]);
  countriesRef.current = countries;
  const currentCountryRef = useRef(null);
  currentCountryRef.current = currentCountry;
  const gameModeRef = useRef(gameMode);
  gameModeRef.current = gameMode;
  const isTimerRunningRef = useRef(isTimerRunning);
  isTimerRunningRef.current = isTimerRunning;

  useEffect(() => {
    let isMounted = true;

    async function fetchCountriesData() {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const [flagsResponse, capitalsResponse] = await Promise.allSettled([
          axios.get(FLAGS_API_URL),
          axios.get(CAPITALS_API_URL),
        ]);

        let flagsData = [];
        let capitalsMap = {};

        if (
          flagsResponse.status === 'fulfilled' &&
          flagsResponse.value &&
          flagsResponse.value.data &&
          !flagsResponse.value.data.error
        ) {
          flagsData = flagsResponse.value.data.data || [];
        }

        if (
          capitalsResponse.status === 'fulfilled' &&
          capitalsResponse.value &&
          capitalsResponse.value.data &&
          !capitalsResponse.value.data.error
        ) {
          const list = capitalsResponse.value.data.data || [];
          list.forEach((item) => {
            if (item && item.name) {
              capitalsMap[normalizeText(item.name)] = item.capital || '';
            }
          });
        }

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

        if (unifiedList.length === 0) {
          console.warn('Usando lista de países fallback');
          unifiedList = FALLBACK_COUNTRIES;
        }

        if (isMounted) {
          setCountries(unifiedList);
          pickRandomCountry(unifiedList, gameMode);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error al cargar países:', err);
        if (isMounted) {
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

  const pickRandomCountry = (list = countriesRef.current, mode = gameModeRef.current) => {
    if (!list || list.length === 0) return;

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

    if (mode === 'capitals' && chosen.capital) {
      generateCapitalOptions(chosen, list);
    }
  };

  const generateCapitalOptions = (targetCountry, allCountriesList) => {
    const correctCapital = targetCountry.capital;
    const distractors = allCountriesList
      .filter((c) => c.capital && c.capital !== correctCapital)
      .map((c) => c.capital);

    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());
    const options = [correctCapital];

    for (let cap of shuffledDistractors) {
      if (options.length >= 3) break;
      if (!options.includes(cap)) {
        options.push(cap);
      }
    }

    const finalShuffled = [...options].sort(() => 0.5 - Math.random());
    setCapitalOptions(finalShuffled);
  };

  useEffect(() => {
    if (!isTimerRunning || isLoading || !currentCountry) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeExpired();
          return 0;
        }

        if (gameModeRef.current === 'capitals' && (prev === 11 || prev === 6)) {
          eliminateWrongCapitalOption();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isTimerRunning, isLoading, currentCountry]);

  const handleTimeExpired = () => {
    setIsTimerRunning(false);
    const country = currentCountryRef.current;
    const answerName = gameModeRef.current === 'capitals' ? country?.capital : country?.name;

    setStreak(0);
    setFeedback({
      type: 'warning',
      message: `⏰ ¡Tiempo agotado! La respuesta correcta era: ${answerName}`,
    });

    savePlayerScoreToLeaderboard();

    setTimeout(() => {
      setRound((r) => r + 1);
      pickRandomCountry();
    }, 2200);
  };

  const guessCountry = (userGuess) => {
    if (!currentCountry || !isTimerRunning) return false;

    const isCorrect = checkCountryMatch(userGuess, currentCountry.name);

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
        message: `¡Excelente! 🎉 Adivinaste ${currentCountry.name}. (+10 pts + ${bonusSeconds}s bonus = +${pointsEarned} pts)`,
        pointsDelta: pointsEarned,
      });

      setTimeout(() => {
        setRound((r) => r + 1);
        pickRandomCountry();
      }, 1400);

      return true;
    } else {
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

  const requestHint = () => {
    if (!currentCountry || !isTimerRunning) return;

    setTimeLeft((prev) => Math.max(0, prev - 2));

    if (gameMode === 'flags') {
      const name = currentCountry.name.toUpperCase();
      const unrevealed = [];

      for (let i = 0; i < name.length; i++) {
        const char = name[i];
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
      eliminateWrongCapitalOption();
      setFeedback({
        type: 'info',
        message: '💡 Pista: Se descartó una opción errónea (-2 segundos)',
      });
    }
  };

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

  const getMaskedCountryName = () => {
    if (!currentCountry) return '';
    const name = currentCountry.name.toUpperCase();
    return name
      .split('')
      .map((char, index) => {
        if (char < 'A' || char > 'Z') return char;
        if (revealedIndices.includes(index)) return char;
        return '_';
      })
      .join(' ');
  };

  const updatePlayerName = (name) => {
    const trimmed = name.trim() || 'Jugador 1';
    setPlayerName(trimmed);
    storage.setItem(PLAYER_NAME_KEY, trimmed);
  };

  const savePlayerScoreToLeaderboard = () => {
    if (score <= 0) return;

    setLeaderboard((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.name.toLowerCase() === playerName.toLowerCase() && entry.mode === gameMode
      );

      let updated = [...prev];

      if (existingIndex >= 0) {
        if (score > updated[existingIndex].score) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            score: score,
            date: new Date().toLocaleDateString(),
          };
        }
      } else {
        updated.push({
          id: Date.now().toString(),
          name: playerName,
          score: score,
          mode: gameMode,
          date: new Date().toLocaleDateString(),
        });
      }

      updated.sort((a, b) => b.score - a.score);

      updated = updated.slice(0, 10);

      storage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearLeaderboard = () => {
    setLeaderboard([]);
    storage.removeItem(LEADERBOARD_STORAGE_KEY);
  };

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

  const value = {
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

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe ser utilizado dentro de un GameProvider');
  }
  return context;
}

export default GameContext;
