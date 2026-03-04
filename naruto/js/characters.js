// ─── Character Definitions ───

const CHARACTERS = {
  naruto: {
    name: 'Naruto',
    title: 'The Seventh Hokage',
    emoji: '🍥',
    accent: '#ff6a00',
    accentGlow: '#ffaa00',
    accentRGB: '255,106,0',
    skeleton: { base: '#ff8c00', glow: '#ffbb33' },
    poses: ['open', 'fist', 'peace'],
    jutsu: {
      open:  'Rasengan',
      fist:  'Fireball',
      peace: 'Shadow Clone'
    },
    barClass: {
      open:  'rasengan',
      fist:  'fireball',
      peace: 'shadowclone',
      none:  'rasengan'
    },
    particleColors: {
      open:  '#00e5ff',
      fist:  '#ff4500',
      peace: '#a5f3fc'
    }
  },
  sasuke: {
    name: 'Sasuke',
    title: 'The Shadow Hokage',
    emoji: '⚡',
    accent: '#a855f7',
    accentGlow: '#c084fc',
    accentRGB: '168,85,247',
    skeleton: { base: '#a855f7', glow: '#c084fc' },
    poses: ['open', 'fist', 'point'],
    jutsu: {
      open:  'Chidori',
      fist:  'Fireball',
      point: 'Amaterasu'
    },
    barClass: {
      open:  'chidori',
      fist:  'fireball',
      point: 'amaterasu',
      none:  'chidori'
    },
    particleColors: {
      open:  '#c084fc',
      fist:  '#ff4500',
      point: '#2d0000'
    }
  },
  kakashi: {
    name: 'Kakashi',
    title: 'The Copy Ninja',
    emoji: '📖',
    accent: '#94a3b8',
    accentGlow: '#cbd5e1',
    accentRGB: '148,163,184',
    skeleton: { base: '#94a3b8', glow: '#e2e8f0' },
    poses: ['open', 'point', 'peace'],
    jutsu: {
      open:  'Lightning Blade',
      point: 'Amaterasu',
      peace: 'Shadow Clone'
    },
    barClass: {
      open:  'chidori',
      point: 'amaterasu',
      peace: 'shadowclone',
      none:  'chidori'
    },
    particleColors: {
      open:  '#e2e8f0',
      point: '#2d0000',
      peace: '#a5f3fc'
    }
  },
  sakura: {
    name: 'Sakura',
    title: 'The Strongest Kunoichi',
    emoji: '🌸',
    accent: '#ec4899',
    accentGlow: '#f472b6',
    accentRGB: '236,72,153',
    skeleton: { base: '#ec4899', glow: '#f9a8d4' },
    poses: ['open', 'fist', 'peace'],
    jutsu: {
      open:  'Cherry Blossom',
      fist:  'Chakra Punch',
      peace: 'Healing Jutsu'
    },
    barClass: {
      open:  'sakura',
      fist:  'fireball',
      peace: 'shadowclone',
      none:  'sakura'
    },
    particleColors: {
      open:  '#f9a8d4',
      fist:  '#ff4500',
      peace: '#a5f3fc'
    }
  },
  itachi: {
    name: 'Itachi',
    title: 'The Tragic Genius',
    emoji: '🌙',
    accent: '#dc2626',
    accentGlow: '#f87171',
    accentRGB: '220,38,38',
    skeleton: { base: '#991b1b', glow: '#dc2626' },
    poses: ['open', 'fist', 'point'],
    jutsu: {
      open:  'Tsukuyomi',
      fist:  'Fireball',
      point: 'Amaterasu'
    },
    barClass: {
      open:  'amaterasu',
      fist:  'fireball',
      point: 'amaterasu',
      none:  'amaterasu'
    },
    particleColors: {
      open:  '#f87171',
      fist:  '#ff4500',
      point: '#2d0000'
    }
  }
};

// ─── Selected character (set on selection) ───
let selectedCharacter = null;

function selectCharacter(id) {
  selectedCharacter = CHARACTERS[id];
  if (!selectedCharacter) return;

  // Apply accent color as CSS custom property
  document.documentElement.style.setProperty('--accent', selectedCharacter.accent);
  document.documentElement.style.setProperty('--accent-glow', selectedCharacter.accentGlow);
  document.documentElement.style.setProperty('--accent-rgb', selectedCharacter.accentRGB);
}
