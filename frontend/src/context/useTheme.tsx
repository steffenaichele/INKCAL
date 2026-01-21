import { use } from 'react';
import { ThemeContext, type ThemeContextType } from './ThemeContext';

export const useTheme = (): ThemeContextType => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
