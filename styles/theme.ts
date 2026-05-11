// Design tokens and theme colors
export const theme = {
  colors: {
    primary: {
      main: '#FF6A00',
      light: '#FF8533',
      dark: '#E55A00',
      gradient: 'linear-gradient(135deg, #FF6A00 0%, #FF8533 100%)',
    },
    secondary: {
      blue: '#0066CC',
      red: '#DC143C',
    },
    factions: {
      hoaLong: '#DC143C', // Red - Fire dragon
      tuTien: '#0066CC',  // Blue - Fairy faction
    },
    background: {
      dark: '#0A0E27',
      darker: '#050812',
      card: 'rgba(20, 25, 50, 0.6)',
      cardHover: 'rgba(30, 40, 70, 0.8)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      accent: '#FF6A00',
    },
    ui: {
      border: 'rgba(255, 106, 0, 0.2)',
      borderHover: 'rgba(255, 106, 0, 0.5)',
      disabled: 'rgba(255, 255, 255, 0.3)',
    },
  },
  typography: {
    fontFamily: {
      primary: "var(--font-inter), sans-serif",
      secondary: "var(--font-inter), sans-serif",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(255, 106, 0, 0.4)',
    glowHeavy: '0 0 40px rgba(255, 106, 0, 0.6)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export type ThemeType = typeof theme;
