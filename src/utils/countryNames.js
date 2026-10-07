// src/utils/countryNames.js
// Normalización de texto y diccionario inglés <-> español para facilitar adivinar países

// Remueve tildes, mayúsculas y espacios extras
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Diccionario de traducciones comunes inglés -> español
export const SPANISH_TRANSLATIONS = {
  'afghanistan': 'afganistan',
  'albania': 'albania',
  'germany': 'alemania',
  'andorra': 'andorra',
  'angola': 'angola',
  'saudi arabia': 'arabia saudita',
  'algeria': 'argelia',
  'argentina': 'argentina',
  'armenia': 'armenia',
  'australia': 'australia',
  'austria': 'austria',
  'azerbaijan': 'azerbaiyan',
  'bahamas': 'bahamas',
  'belgium': 'belgica',
  'belize': 'belice',
  'bolivia': 'bolivia',
  'brazil': 'brasil',
  'bulgaria': 'bulgaria',
  'cambodia': 'camboya',
  'cameroon': 'camerun',
  'canada': 'canada',
  'qatar': 'catar',
  'chile': 'chile',
  'china': 'china',
  'cyprus': 'chipre',
  'colombia': 'colombia',
  'south korea': 'corea del sur',
  'north korea': 'corea del norte',
  'costa rica': 'costa rica',
  'croatia': 'croacia',
  'cuba': 'cuba',
  'denmark': 'dinamarca',
  'ecuador': 'ecuador',
  'egypt': 'egipto',
  'el salvador': 'el salvador',
  'united arab emirates': 'emiratos arabes unidos',
  'scotland': 'escocia',
  'slovakia': 'eslovaquia',
  'slovenia': 'eslovenia',
  'spain': 'españa',
  'united states': 'estados unidos',
  'estonia': 'estonia',
  'philippines': 'filipinas',
  'finland': 'finlandia',
  'france': 'francia',
  'wales': 'gales',
  'georgia': 'georgia',
  'ghana': 'gana',
  'greece': 'grecia',
  'guatemala': 'guatemala',
  'haiti': 'haiti',
  'honduras': 'honduras',
  'hungary': 'hungria',
  'india': 'india',
  'indonesia': 'indonesia',
  'england': 'inglaterra',
  'iraq': 'irak',
  'iran': 'iran',
  'ireland': 'irlanda',
  'iceland': 'islandia',
  'israel': 'israel',
  'italy': 'italia',
  'jamaica': 'jamaica',
  'japan': 'japon',
  'jordan': 'jordania',
  'kazakhstan': 'kazajistan',
  'kenya': 'kenia',
  'latvia': 'letonia',
  'lebanon': 'libano',
  'libya': 'libia',
  'lithuania': 'lituania',
  'luxembourg': 'luxemburgo',
  'mexico': 'mexico',
  'monaco': 'monaco',
  'morocco': 'marruecos',
  'nepal': 'nepal',
  'nicaragua': 'nicaragua',
  'nigeria': 'nigeria',
  'norway': 'noruega',
  'new zealand': 'nueva zelanda',
  'netherlands': 'paises bajos',
  'pakistan': 'pakistan',
  'panama': 'panama',
  'paraguay': 'paraguay',
  'peru': 'peru',
  'poland': 'polonia',
  'portugal': 'portugal',
  'united kingdom': 'reino unido',
  'czech republic': 'republica checa',
  'dominican republic': 'republica dominicana',
  'romania': 'rumania',
  'russia': 'rusia',
  'senegal': 'senegal',
  'serbia': 'serbia',
  'syria': 'siria',
  'south africa': 'sudafrica',
  'sweden': 'suecia',
  'switzerland': 'suiza',
  'thailand': 'tailandia',
  'tunisia': 'tunez',
  'turkey': 'turquia',
  'ukraine': 'ucrania',
  'uruguay': 'uruguay',
  'vatican city state (holy see)': 'vaticano',
  'venezuela': 'venezuela',
  'vietnam': 'vietnam',
};

// Aliases adicionales comunes (como "usa", "eeuu", "holanda", "uk")
export const EXTRA_ALIASES = {
  'usa': 'united states',
  'eeuu': 'united states',
  'ee.uu.': 'united states',
  'uk': 'united kingdom',
  'holanda': 'netherlands',
  'vaticano': 'vatican city state (holy see)',
  'chequia': 'czech republic',
};

// Función para comprobar si el intento del usuario coincide con el nombre del país
export function checkCountryMatch(userInput, targetCountryName) {
  if (!userInput || !targetCountryName) return false;

  const cleanInput = normalizeText(userInput);
  const cleanTarget = normalizeText(targetCountryName);

  // 1. Coincidencia exacta con el nombre original
  if (cleanInput === cleanTarget) return true;

  // 2. Coincidencia con la traducción al español
  const spanishName = SPANISH_TRANSLATIONS[cleanTarget];
  if (spanishName && cleanInput === normalizeText(spanishName)) {
    return true;
  }

  // 3. Coincidencia con alias especiales (ej. eeuu -> united states)
  const aliasTarget = EXTRA_ALIASES[cleanInput];
  if (aliasTarget && normalizeText(aliasTarget) === cleanTarget) {
    return true;
  }

  return false;
}
