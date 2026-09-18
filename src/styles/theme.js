export const colors = {
  primary: '#123B8E',       // Azul principal
  primaryDark: '#0B1F4B',   // Azul oscuro
  secondary: '#2F80ED',     // Azul secundario
  background: '#F7F8FC',    // Fondo
  white: '#FFFFFF',         // Blanco
  green: '#27AE60',         // Verde (Gratis / éxito)
  red: '#D64545',           // Rojo (Guardado / alerta)
  textPrimary: '#202124',   // Texto principal
  textSecondary: '#6B7280', // Texto secundario
  border: '#E5E7EB',        // Bordes suaves
  cardBg: '#FFFFFF',        // Fondo de tarjetas
  tagBg: '#EEF2F6',         // Fondo de etiquetas
  star: '#F59E0B',          // Dorado estrellas
};

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
  typography,
  shadows,
  spacing,
  borderRadius,
};
