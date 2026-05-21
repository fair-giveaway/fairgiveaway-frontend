'use client';

import { useState } from 'react';

const COLORS = [
  'bg-violet-500/15 text-violet-500',
  'bg-emerald-500/15 text-emerald-500',
  'bg-sky-500/15 text-sky-500',
  'bg-amber-500/15 text-amber-500',
  'bg-rose-500/15 text-rose-500',
  'bg-teal-500/15 text-teal-500',
  'bg-indigo-500/15 text-indigo-500',
  'bg-pink-500/15 text-pink-500',
];

function hashIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLORS.length;
}

interface AvatarProps {
  username: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ username, src, size = 'md' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const dim = size === 'sm' ? 'w-6 h-6 text-[10px]' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm';

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={username}
        onError={() => setImgError(true)}
        className={`${dim} rounded-full shrink-0 object-cover border border-borderSubtle bg-bgElevated`}
      />
    );
  }

  const color = COLORS[hashIndex(username)];
  return (
    <div className={`${dim} ${color} rounded-full shrink-0 flex items-center justify-center font-bold uppercase border border-borderSubtle`}>
      {username.charAt(0)}
    </div>
  );
}
