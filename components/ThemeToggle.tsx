'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa6';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex h-9 w-9 items-center justify-center rounded-full text-textSecondary hover:bg-borderSubtle hover:text-textPrimary transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <FaSun className="text-[1.1rem]" /> : <FaMoon className="text-[1.1rem]" />}
    </button>
  );
}
