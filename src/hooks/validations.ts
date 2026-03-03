// Listas de validación para categorías específicas

export const VALID_COLORS = new Set([
  'rojo', 'azul', 'verde', 'amarillo', 'naranja', 'morado', 'violeta', 'rosa', 'rosado',
  'blanco', 'negro', 'gris', 'marron', 'cafe', 'beige', 'celeste',
  'turquesa', 'fucsia', 'magenta', 'lila', 'purpura', 'dorado', 'plateado',
  'bronce', 'coral', 'salmon', 'carmesi', 'escarlata', 'granate',
  'borgona', 'ocre', 'ambar', 'crema', 'perla', 'marfil',
  'lavanda', 'indigo', 'cian', 'aguamarina', 'oliva', 'esmeralda',
  'rubi', 'jade', 'cobalto', 'anil', 'bermellon',
  'ceruleo', 'caqui', 'terracota', 'vino', 'tinto',
]);

export const VALID_COUNTRIES = new Set([
  // América
  'argentina', 'bolivia', 'brasil', 'canada', 'chile', 'colombia', 'costa rica',
  'cuba', 'dominica', 'ecuador', 'el salvador', 'estados unidos', 'guatemala',
  'guyana', 'haiti', 'honduras', 'jamaica', 'mexico', 'nicaragua', 'panama',
  'paraguay', 'peru', 'republica dominicana', 'surinam', 'trinidad y tobago',
  'uruguay', 'venezuela', 'belice', 'bahamas', 'barbados', 'antigua y barbuda',
  'san vicente', 'santa lucia', 'granada',
  // Europa
  'alemania', 'austria', 'belgica', 'bulgaria', 'croacia', 'chipre',
  'dinamarca', 'eslovaquia', 'eslovenia', 'espana', 'estonia',
  'finlandia', 'francia', 'grecia', 'hungria', 'irlanda', 'islandia',
  'italia', 'letonia', 'lituania', 'luxemburgo', 'malta', 'noruega',
  'paises bajos', 'holanda', 'polonia', 'portugal',
  'reino unido', 'inglaterra', 'republica checa', 'chequia',
  'rumania', 'rusia', 'serbia', 'suecia', 'suiza', 'ucrania',
  'albania', 'andorra', 'bielorrusia', 'bosnia', 'georgia', 'kosovo',
  'liechtenstein', 'macedonia', 'moldavia', 'monaco', 'montenegro',
  'san marino', 'vaticano',
  // Asia
  'afganistan', 'arabia saudita', 'armenia', 'azerbaiyan',
  'bangladesh', 'camboya', 'china', 'corea del norte', 'corea del sur',
  'corea', 'emiratos arabes', 'filipinas', 'india', 'indonesia',
  'irak', 'iran', 'israel', 'japon', 'jordania', 'kazajistan',
  'kuwait', 'laos', 'libano', 'malasia', 'mongolia',
  'myanmar', 'birmania', 'nepal', 'oman', 'pakistan',
  'qatar', 'singapur', 'siria', 'sri lanka', 'tailandia', 'taiwan',
  'tayikistan', 'timor oriental', 'turkmenistan',
  'turquia', 'uzbekistan', 'vietnam', 'yemen',
  // África
  'argelia', 'angola', 'benin', 'botsuana', 'burkina faso', 'burundi',
  'cabo verde', 'camerun', 'chad', 'comoras', 'congo',
  'costa de marfil', 'egipto', 'eritrea', 'etiopia', 'gabon',
  'gambia', 'ghana', 'guinea', 'guinea ecuatorial', 'kenia', 'kenya',
  'lesoto', 'liberia', 'libia', 'madagascar', 'malaui', 'mali',
  'marruecos', 'mauricio', 'mauritania', 'mozambique', 'namibia', 'niger',
  'nigeria', 'ruanda', 'senegal', 'sierra leona', 'somalia', 'sudafrica',
  'sudan', 'tanzania', 'togo', 'tunez', 'uganda', 'zambia', 'zimbabue',
  // Oceanía
  'australia', 'fiyi', 'nueva zelanda', 'papua nueva guinea',
  'samoa', 'tonga', 'vanuatu',
]);

/**
 * Normaliza texto removiendo acentos y espacios extra
 */
export function normalizeWord(value: string): string {
  return value.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/\s+/g, ' '); // normalizar espacios
}

/**
 * Valida si un valor es válido para su categoría.
 * Retorna true si es válido o si la categoría no tiene validación especial.
 */
export function isValidForCategory(category: string, value: string): boolean {
  const normalized = normalizeWord(value);
  if (!normalized) return false;

  switch (category) {
    case 'color':
      return VALID_COLORS.has(normalized);
    case 'pais':
      return VALID_COUNTRIES.has(normalized);
    default:
      return true;
  }
}
