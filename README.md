# TP 11 - Juego de Banderas y Capitales (Country Guesser)

Juego interactivo desarrollado en **React Native / Expo** para **Web y Mobile**, realizado en **JavaScript puro (sin TypeScript)**, fácil de entender y con una interfaz visual moderna y atractiva.

---

## 🚀 Cómo ejecutar el proyecto

Para abrir el juego en el navegador web:
```bash
npm run web
```
O para iniciar el servidor de desarrollo de Expo (móvil o web):
```bash
npx expo start
```
- Presiona `w` en la terminal para abrirlo en la Web.
- O escanea el código QR con la app **Expo Go** en tu celular (Android / iOS).

---

## 📋 Consigna y Requisitos cumplidos

### 1. Consigna Base
- ✅ **Carga de Países con `useEffect`**: Al montar la app, se consumen los países y banderas desde `https://countriesnow.space/api/v0.1/countries/flag/images` y se guardan en el state del Context.
- ✅ **País al azar**: Al recibir los países, se selecciona uno aleatorio como objetivo a adivinar.
- ✅ **Aciertos y Errores**:
  - Si el usuario acierta: suma **10 puntos** (+ segundos restantes del timer como bonus) y se elige un nuevo país automáticamente.
  - Si el usuario falla: resta **1 punto**.
- ✅ **Puntaje en pantalla**: El puntaje y la racha se muestran en pantalla en todo momento en `<ScoreBoard />`.

### 2. Requisito de Context (Obligatorio)
- ✅ Toda la lógica y estado viven en `GameContext` (`createContext` + `useContext`), expuesto mediante `GameProvider`.
- ✅ **Cero pasaje de datos por props**: Los componentes `<Flag />`, `<GuessForm />`, `<ScoreBoard />`, `<Timer />`, `<Leaderboard />`, `<CapitalOptions />` y `<Clues />` consumen el contexto mediante el hook `useGame()`, sin recibir props del componente padre.

### 3. Plus Implementados
- ⏱️ **Timer (15s por bandera)**: Cada país tiene 15 segundos. Si aciertas antes de que finalice, ¡los segundos restantes se suman como puntos extra al score!
- 👥 **Multijugador con Ranking**: Permite ingresar y cambiar el nombre del jugador. El puntaje y la tabla de posiciones se persisten en `localStorage`.
- 💡 **Pistas dinámicas**: 
  - En **Modo Bandera**: Revela una letra al azar del nombre del país descontando 2 segundos del timer.
  - En **Modo Capitales**: Se borra una opción errónea automáticamente cada 5 segundos (o a pedido del jugador descontando 2s).
- 🏛️ **Modo Capitales**: Modalidad alternativa que muestra la bandera y 3 opciones para elegir cuál es la capital del país, consumiendo la API de capitales (`https://countriesnow.space/api/v0.1/countries/capital`).

---

## 📁 Estructura del Proyecto

```text
tp11efsi/
├── src/
│   ├── app/
│   │   ├── _layout.tsx         # Root layout que envuelve con <GameProvider>
│   │   ├── index.tsx           # Pantalla principal (JavaScript)
│   │   └── explore.tsx         # Pantalla de ranking secundario
│   ├── context/
│   │   └── GameContext.jsx     # Contexto central: estados, APIs, timer, pistas y puntaje
│   ├── components/
│   │   ├── GameScreen.jsx      # Pantalla integrada con navegación de pestañas
│   │   ├── Flag.jsx            # <Flag /> Muestra la bandera del país actual
│   │   ├── GuessForm.jsx       # <GuessForm /> Input y sugerencias para adivinar
│   │   ├── ScoreBoard.jsx      # <ScoreBoard /> Puntos, racha, ronda y selector de modo
│   │   ├── Timer.jsx           # <Timer /> Barra y cuenta regresiva de 15 segundos
│   │   ├── Clues.jsx           # <Clues /> Pistas con letras descubiertas
│   │   ├── CapitalOptions.jsx  # <CapitalOptions /> 3 opciones para el modo capitales
│   │   ├── Leaderboard.jsx     # <Leaderboard /> Tabla de posiciones y medallas
│   │   └── PlayerModal.jsx     # Modal para cambiar nombre de jugador
│   └── utils/
│       ├── storage.js          # Persistencia segura en localStorage
│       ├── countryNames.js     # Normalización y traducción inglés/español
│       └── countriesFallback.js# Países de respaldo por si no hay conexión
└── package.json
```

---

## 💡 Ventajas y Detalles Adicionales
- **Bilingüe (Español / Inglés)**: Puedes escribir los nombres de países en español (ej. *Alemania*, *Estados Unidos*, *España*, *Japón*, *Francia*) o en inglés (*Germany*, *United States*, *Spain*) y ambos son reconocidos.
- **Sugerencias interactivas**: Al comenzar a escribir, se muestran etiquetas con los países coincidentes para arriesgar con un solo toque.
- **Modo offline resiliente**: Si la API externa tarda o tiene microcortes, el juego cuenta con un catálogo de respaldo local para que nunca se interrumpa la experiencia.
