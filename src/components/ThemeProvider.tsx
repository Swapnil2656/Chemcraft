'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

// Simplified context since we only use dark mode now
const ThemeProviderContext = createContext<{ theme: 'dark'; mounted: boolean }>({ 
  theme: 'dark', 
  mounted: false 
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Always apply dark mode
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    setMounted(true);
  }, []);

  const value = {
    theme: 'dark' as const,
    mounted,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Simplified hook that always returns dark theme
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};