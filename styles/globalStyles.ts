import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-inter), sans-serif !important;
    background: linear-gradient(135deg, ${theme.colors.background.darker} 0%, ${theme.colors.background.dark} 100%);
    color: ${theme.colors.text.primary};
    line-height: 1.6;
    min-height: 100vh;
  }

  *, *::before, *::after {
    font-family: var(--font-inter), sans-serif !important;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.bold};
    line-height: 1.2;
  }

  h1 {
    font-size: ${theme.typography.fontSize['5xl']};
  }

  h2 {
    font-size: ${theme.typography.fontSize['4xl']};
  }

  h3 {
    font-size: ${theme.typography.fontSize['3xl']};
  }

  button {
    font-family: ${theme.typography.fontFamily.primary};
    cursor: pointer;
  }

  input, textarea, select {
    font-family: ${theme.typography.fontFamily.primary};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.dark};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary.main};
    border-radius: ${theme.borderRadius.full};

    &:hover {
      background: ${theme.colors.primary.light};
    }
  }

  /* Selection styling */
  ::selection {
    background: ${theme.colors.primary.main};
    color: ${theme.colors.text.primary};
  }
`;
