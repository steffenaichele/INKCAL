import { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Always use dark theme as default
  const [theme] = useState<Theme>('dark');

  // Apply dark theme to document on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Keep toggleTheme function for future compatibility, but it does nothing
  const toggleTheme = () => {
    // Theme toggle disabled - dark mode only
    console.log('Theme toggle is disabled. Dark mode only.');
  };

  const value = {
    theme,
    toggleTheme,
  };

  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export default ThemeProvider;
