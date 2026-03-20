import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem('rf_darkMode') === 'true');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('rf_darkMode', dark);
  }, [dark]);

  const toggle = () => setDark(d => !d);

  return { dark, toggle };
}
