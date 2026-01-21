import { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Check localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export default ThemeProvider;
