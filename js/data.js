// ========== VOCABULARY DATABASE ==========
// Cards tagged with: word, POS, CEFR level, tense (for verbs), base damage

export const CEFR_DAMAGE = {
  A1: 6, A2: 10, B1: 16, B2: 24, C1: 36, C2: 55
};

export const VOCAB = {
  verbs: [
    // A1 - Present
    { word: 'Run', pos: 'verb', cefr: 'A1', tense: 'present', base: 'run' },
    { word: 'Eat', pos: 'verb', cefr: 'A1', tense: 'present', base: 'eat' },
    { word: 'See', pos: 'verb', cefr: 'A1', tense: 'present', base: 'see' },
    { word: 'Make', pos: 'verb', cefr: 'A1', tense: 'present', base: 'make' },
    { word: 'Go', pos: 'verb', cefr: 'A1', tense: 'present', base: 'go' },
    // A1 - Past (Historian bonus!)
    { word: 'Ran', pos: 'verb', cefr: 'A1', tense: 'past', base: 'run' },
    { word: 'Ate', pos: 'verb', cefr: 'A1', tense: 'past', base: 'eat' },
    { word: 'Saw', pos: 'verb', cefr: 'A1', tense: 'past', base: 'see' },
    { word: 'Made', pos: 'verb', cefr: 'A1', tense: 'past', base: 'make' },
    { word: 'Went', pos: 'verb', cefr: 'A1', tense: 'past', base: 'go' },
    // A2 - Present
    { word: 'Travel', pos: 'verb', cefr: 'A2', tense: 'present', base: 'travel' },
    { word: 'Enjoy', pos: 'verb', cefr: 'A2', tense: 'present', base: 'enjoy' },
    { word: 'Create', pos: 'verb', cefr: 'A2', tense: 'present', base: 'create' },
    { word: 'Learn', pos: 'verb', cefr: 'A2', tense: 'present', base: 'learn' },
    // A2 - Past
    { word: 'Traveled', pos: 'verb', cefr: 'A2', tense: 'past', base: 'travel' },
    { word: 'Enjoyed', pos: 'verb', cefr: 'A2', tense: 'past', base: 'enjoy' },
    { word: 'Created', pos: 'verb', cefr: 'A2', tense: 'past', base: 'create' },
    { word: 'Learned', pos: 'verb', cefr: 'A2', tense: 'past', base: 'learn' },
    // B1
    { word: 'Investigate', pos: 'verb', cefr: 'B1', tense: 'present', base: 'investigate' },
    { word: 'Accomplish', pos: 'verb', cefr: 'B1', tense: 'present', base: 'accomplish' },
    { word: 'Investigated', pos: 'verb', cefr: 'B1', tense: 'past', base: 'investigate' },
    { word: 'Accomplished', pos: 'verb', cefr: 'B1', tense: 'past', base: 'accomplish' },
    // B2
    { word: 'Scrutinize', pos: 'verb', cefr: 'B2', tense: 'present', base: 'scrutinize' },
    { word: 'Scrutinized', pos: 'verb', cefr: 'B2', tense: 'past', base: 'scrutinize' },
    { word: 'Contemplate', pos: 'verb', cefr: 'B2', tense: 'present', base: 'contemplate' },
    { word: 'Contemplated', pos: 'verb', cefr: 'B2', tense: 'past', base: 'contemplate' },
  ],
  adverbs: [
    // A1
    { word: 'Quickly', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Slowly', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Well', pos: 'adverb', cefr: 'A1', syllables: 1 },
    { word: 'Often', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Always', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Never', pos: 'adverb', cefr: 'A1', syllables: 2 },
    // A2
    { word: 'Carefully', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Easily', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Happily', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Quietly', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Already', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Usually', pos: 'adverb', cefr: 'A2', syllables: 4 },
    // B1
    { word: 'Efficiently', pos: 'adverb', cefr: 'B1', syllables: 4 },
    { word: 'Dramatically', pos: 'adverb', cefr: 'B1', syllables: 5 },
    { word: 'Significantly', pos: 'adverb', cefr: 'B1', syllables: 5 },
    { word: 'Precisely', pos: 'adverb', cefr: 'B1', syllables: 3 },
    // B2
    { word: 'Meticulously', pos: 'adverb', cefr: 'B2', syllables: 5 },
    { word: 'Predominantly', pos: 'adverb', cefr: 'B2', syllables: 5 },
    { word: 'Inadvertently', pos: 'adverb', cefr: 'B2', syllables: 5 },
    // C1
    { word: 'Unequivocally', pos: 'adverb', cefr: 'C1', syllables: 6 },
    { word: 'Surreptitiously', pos: 'adverb', cefr: 'C1', syllables: 5 },
    // C2
    { word: 'Perfunctorily', pos: 'adverb', cefr: 'C2', syllables: 5 },
    { word: 'Ignominiously', pos: 'adverb', cefr: 'C2', syllables: 6 },
  ]
};

// ========== STARTER DECK (The Historian) ==========
// 30 cards: 15 verbs + 15 adverbs, focused on A1-A2 with a few B1
export function createStarterDeck() {
  const deck = [];
  let id = 0;

  const verbPicks = [
    'Run', 'Eat', 'See', 'Make', 'Go',       // 5 present A1
    'Ran', 'Ate', 'Saw', 'Made', 'Went',       // 5 past A1
    'Travel', 'Enjoy', 'Traveled', 'Enjoyed',   // 4 A2 mix
    'Investigated',                              // 1 B1 past
  ];

  const advPicks = [
    'Quickly', 'Slowly', 'Well', 'Often', 'Always', 'Never',  // 6 A1
    'Carefully', 'Easily', 'Happily', 'Quietly', 'Already',    // 5 A2
    'Efficiently', 'Dramatically', 'Significantly', 'Precisely', // 4 B1
  ];

  for (const word of verbPicks) {
    const template = VOCAB.verbs.find(v => v.word === word);
    if (template) deck.push({ ...template, id: id++ });
  }

  for (const word of advPicks) {
    const template = VOCAB.adverbs.find(a => a.word === word);
    if (template) deck.push({ ...template, id: id++ });
  }

  return deck;
}

// ========== CHARACTER ==========
export const CHARACTER = {
  name: 'The Historian',
  icon: '📜',
  specialty: 'Past Tense Mastery',
  passive: {
    name: 'Ancient Knowledge',
    description: 'Past tense verbs deal +50% damage & grant 5 shield.',
    trigger: (card) => card.pos === 'verb' && card.tense === 'past',
    damageMultiplier: 1.5,
    shield: 5,
  },
  baseHP: 100,
  handSize: 6,
};

// ========== WEAPON ==========
export const WEAPON = {
  name: 'The Dual-Uzi',
  icon: '🔫',
  type: 'Rapid Fire',
  slots: [
    { required: 'verb', label: 'VERB' },
    { required: 'adverb', label: 'ADVERB' },
  ],
  // Dual-Uzi fires twice (rapid), each card contributes damage
  description: 'Quick two-slot combo. Each card deals its own damage.',
};

// ========== BOSS ==========
export const BOSS = {
  name: 'The Echoing Cave',
  icon: '🦇',
  maxHP: 120,
  baseAttack: 8,
  maxAttack: 14,
  affix: {
    name: 'The Repetition Curse',
    description: 'Using a word from last turn reflects damage!',
    icon: '⚠',
  },
  // Special attack every 3 turns
  specialEvery: 3,
  specialAttack: { min: 16, max: 22, name: 'Echo Blast' },
  // Rewards scaling
  phases: [
    { hpPercent: 75, message: 'The cave rumbles...' },
    { hpPercent: 50, message: 'Stalactites begin to fall!' },
    { hpPercent: 25, message: 'The cave screams in agony!', attackBoost: 4 },
  ],
};
