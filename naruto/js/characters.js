// Character definitions with poses, jutsu, colors, and particle effects
const CHARACTERS = {
  naruto: {
    name: 'Naruto',
    emoji: '🍥',
    theme: 'naruto',
    primaryColor: '#ff6b00',
    particleColor: '#ff8c00',
    poses: ['open', 'fist', 'peace'],
    jutsu: [
      { name: 'Rasengan', pose: 'open', fx: 'rasengan', effect: 'video' },
      { name: 'Fireball', pose: 'fist', fx: 'fireball', effect: 'canvas' },
      { name: 'Shadow Clone', pose: 'peace', fx: 'shadowClone', effect: 'canvas' }
    ]
  },
  sasuke: {
    name: 'Sasuke',
    emoji: '⚡',
    theme: 'sasuke',
    primaryColor: '#8b00ff',
    particleColor: '#aa33ff',
    poses: ['open', 'fist', 'point'],
    jutsu: [
      { name: 'Chidori', pose: 'open', fx: 'chidori', effect: 'video' },
      { name: 'Fireball', pose: 'fist', fx: 'fireball', effect: 'canvas' },
      { name: 'Amaterasu', pose: 'point', fx: 'amaterasu', effect: 'canvas' }
    ]
  },
  kakashi: {
    name: 'Kakashi',
    emoji: '📖',
    theme: 'kakashi',
    primaryColor: '#a0a0a0',
    particleColor: '#d0d0d0',
    poses: ['open', 'point', 'peace'],
    jutsu: [
      { name: 'Lightning Blade', pose: 'open', fx: 'lightningBlade', effect: 'canvas' },
      { name: 'Amaterasu', pose: 'point', fx: 'amaterasu', effect: 'canvas' },
      { name: 'Shadow Clone', pose: 'peace', fx: 'shadowClone', effect: 'canvas' }
    ]
  },
  sakura: {
    name: 'Sakura',
    emoji: '🌸',
    theme: 'sakura',
    primaryColor: '#ff69b4',
    particleColor: '#ff85c1',
    poses: ['open', 'fist', 'peace'],
    jutsu: [
      { name: 'Cherry Blossom', pose: 'open', fx: 'cherryBlossom', effect: 'canvas' },
      { name: 'Chakra Punch', pose: 'fist', fx: 'chakraPunch', effect: 'canvas' },
      { name: 'Healing', pose: 'peace', fx: 'healing', effect: 'canvas' }
    ]
  },
  itachi: {
    name: 'Itachi',
    emoji: '🌙',
    theme: 'itachi',
    primaryColor: '#8b0000',
    particleColor: '#ff4444',
    poses: ['open', 'fist', 'point'],
    jutsu: [
      { name: 'Tsukuyomi', pose: 'open', fx: 'tsukuyomi', effect: 'canvas' },
      { name: 'Fireball', pose: 'fist', fx: 'fireball', effect: 'canvas' },
      { name: 'Amaterasu', pose: 'point', fx: 'amaterasu', effect: 'canvas' }
    ]
  }
};

export default CHARACTERS;
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
