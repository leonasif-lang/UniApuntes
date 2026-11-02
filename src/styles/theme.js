export const lightColors = {
  primary: '#123B8E',       // Azul principal UNP
  primaryDark: '#0B1F4B',   // Azul marino profundo
  secondary: '#2F80ED',     // Azul acento
  background: '#F7F8FC',    // Fondo grisáceo claro
  white: '#FFFFFF',         // Blanco
  green: '#27AE60',         // Verde (Gratis / éxito)
  red: '#D64545',           // Rojo (Guardado / alerta)
  textPrimary: '#202124',   // Texto principal oscuro
  textSecondary: '#6B7280', // Texto secundario suave
  border: '#E5E7EB',        // Bordes suaves
  cardBg: '#FFFFFF',        // Fondo de tarjetas
  tagBg: '#EEF2F6',         // Fondo de etiquetas
  star: '#F59E0B',          // Dorado estrellas
  surface: '#FFFFFF',
  inputBg: '#FFFFFF',
  chipBg: '#EEF2F6',
  headerBg: '#FFFFFF',
  modalBg: '#FFFFFF',
};

export const darkColors = {
  primary: '#3B82F6',       // Azul brillante legible en oscuro
  primaryDark: '#93C5FD',   // Azul claro para contrastes
  secondary: '#60A5FA',     // Celeste
  background: '#0B1120',    // Fondo azul noche muy profundo
  white: '#1E293B',         // Fondos elevados slate
  green: '#10B981',         // Verde esmeralda brillante
  red: '#EF4444',           // Rojo brillante
  textPrimary: '#F8FAFC',   // Blanco nítido
  textSecondary: '#94A3B8', // Gris medio claro
  border: '#334155',        // Borde oscuro elegante
  cardBg: '#1E293B',        // Fondo tarjeta slate oscuro
  tagBg: '#334155',         // Fondo tag slate
  star: '#FBBF24',          // Dorado estrellas
  surface: '#1E293B',
  inputBg: '#1E293B',
  chipBg: '#1E293B',
  headerBg: '#0F172A',
  modalBg: '#1E293B',
};

// Por defecto exportamos lightColors para compatibilidad directa
export const colors = lightColors;

export const typography = {
  fontFamilyTitle: 'System',
  fontFamilyBody: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 26,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const shadows = {
  small: {
    shadowColor: '#0B1F4B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#0B1F4B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  strong: {
    shadowColor: '#0B1F4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export default {
  colors,
  lightColors,
  darkColors,
  typography,
  shadows,
  spacing,
  borderRadius,
};
