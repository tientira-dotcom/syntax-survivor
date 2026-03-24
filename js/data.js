// ========== VOCABULARY DATABASE ==========
export const CEFR_DAMAGE = { A1: 6, A2: 10, B1: 16, B2: 24, C1: 36, C2: 55 };

export const VOCAB = {
  verbs: [
    // A1 Present
    { word: 'Run', pos: 'verb', cefr: 'A1', tense: 'present', base: 'run' },
    { word: 'Eat', pos: 'verb', cefr: 'A1', tense: 'present', base: 'eat' },
    { word: 'See', pos: 'verb', cefr: 'A1', tense: 'present', base: 'see' },
    { word: 'Make', pos: 'verb', cefr: 'A1', tense: 'present', base: 'make' },
    { word: 'Go', pos: 'verb', cefr: 'A1', tense: 'present', base: 'go' },
    { word: 'Take', pos: 'verb', cefr: 'A1', tense: 'present', base: 'take' },
    { word: 'Give', pos: 'verb', cefr: 'A1', tense: 'present', base: 'give' },
    { word: 'Find', pos: 'verb', cefr: 'A1', tense: 'present', base: 'find' },
    // A1 Past
    { word: 'Ran', pos: 'verb', cefr: 'A1', tense: 'past', base: 'run' },
    { word: 'Ate', pos: 'verb', cefr: 'A1', tense: 'past', base: 'eat' },
    { word: 'Saw', pos: 'verb', cefr: 'A1', tense: 'past', base: 'see' },
    { word: 'Made', pos: 'verb', cefr: 'A1', tense: 'past', base: 'make' },
    { word: 'Went', pos: 'verb', cefr: 'A1', tense: 'past', base: 'go' },
    { word: 'Took', pos: 'verb', cefr: 'A1', tense: 'past', base: 'take' },
    { word: 'Gave', pos: 'verb', cefr: 'A1', tense: 'past', base: 'give' },
    { word: 'Found', pos: 'verb', cefr: 'A1', tense: 'past', base: 'find' },
    // A2
    { word: 'Travel', pos: 'verb', cefr: 'A2', tense: 'present', base: 'travel' },
    { word: 'Enjoy', pos: 'verb', cefr: 'A2', tense: 'present', base: 'enjoy' },
    { word: 'Create', pos: 'verb', cefr: 'A2', tense: 'present', base: 'create' },
    { word: 'Learn', pos: 'verb', cefr: 'A2', tense: 'present', base: 'learn' },
    { word: 'Believe', pos: 'verb', cefr: 'A2', tense: 'present', base: 'believe' },
    { word: 'Discover', pos: 'verb', cefr: 'A2', tense: 'present', base: 'discover' },
    { word: 'Traveled', pos: 'verb', cefr: 'A2', tense: 'past', base: 'travel' },
    { word: 'Enjoyed', pos: 'verb', cefr: 'A2', tense: 'past', base: 'enjoy' },
    { word: 'Created', pos: 'verb', cefr: 'A2', tense: 'past', base: 'create' },
    { word: 'Learned', pos: 'verb', cefr: 'A2', tense: 'past', base: 'learn' },
    { word: 'Believed', pos: 'verb', cefr: 'A2', tense: 'past', base: 'believe' },
    { word: 'Discovered', pos: 'verb', cefr: 'A2', tense: 'past', base: 'discover' },
    // B1
    { word: 'Investigate', pos: 'verb', cefr: 'B1', tense: 'present', base: 'investigate' },
    { word: 'Accomplish', pos: 'verb', cefr: 'B1', tense: 'present', base: 'accomplish' },
    { word: 'Demonstrate', pos: 'verb', cefr: 'B1', tense: 'present', base: 'demonstrate' },
    { word: 'Negotiate', pos: 'verb', cefr: 'B1', tense: 'present', base: 'negotiate' },
    { word: 'Establish', pos: 'verb', cefr: 'B1', tense: 'present', base: 'establish' },
    { word: 'Investigated', pos: 'verb', cefr: 'B1', tense: 'past', base: 'investigate' },
    { word: 'Accomplished', pos: 'verb', cefr: 'B1', tense: 'past', base: 'accomplish' },
    { word: 'Demonstrated', pos: 'verb', cefr: 'B1', tense: 'past', base: 'demonstrate' },
    { word: 'Negotiated', pos: 'verb', cefr: 'B1', tense: 'past', base: 'negotiate' },
    { word: 'Established', pos: 'verb', cefr: 'B1', tense: 'past', base: 'establish' },
    // B2
    { word: 'Scrutinize', pos: 'verb', cefr: 'B2', tense: 'present', base: 'scrutinize' },
    { word: 'Contemplate', pos: 'verb', cefr: 'B2', tense: 'present', base: 'contemplate' },
    { word: 'Facilitate', pos: 'verb', cefr: 'B2', tense: 'present', base: 'facilitate' },
    { word: 'Scrutinized', pos: 'verb', cefr: 'B2', tense: 'past', base: 'scrutinize' },
    { word: 'Contemplated', pos: 'verb', cefr: 'B2', tense: 'past', base: 'contemplate' },
    { word: 'Facilitated', pos: 'verb', cefr: 'B2', tense: 'past', base: 'facilitate' },
    // C1
    { word: 'Exacerbate', pos: 'verb', cefr: 'C1', tense: 'present', base: 'exacerbate' },
    { word: 'Ameliorate', pos: 'verb', cefr: 'C1', tense: 'present', base: 'ameliorate' },
    { word: 'Exacerbated', pos: 'verb', cefr: 'C1', tense: 'past', base: 'exacerbate' },
    { word: 'Ameliorated', pos: 'verb', cefr: 'C1', tense: 'past', base: 'ameliorate' },
    // C2
    { word: 'Obfuscate', pos: 'verb', cefr: 'C2', tense: 'present', base: 'obfuscate' },
    { word: 'Conflagrate', pos: 'verb', cefr: 'C2', tense: 'present', base: 'conflagrate' },
    { word: 'Obfuscated', pos: 'verb', cefr: 'C2', tense: 'past', base: 'obfuscate' },
  ],
  adverbs: [
    // A1
    { word: 'Quickly', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Slowly', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Well', pos: 'adverb', cefr: 'A1', syllables: 1 },
    { word: 'Often', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Always', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Never', pos: 'adverb', cefr: 'A1', syllables: 2 },
    { word: 'Here', pos: 'adverb', cefr: 'A1', syllables: 1 },
    { word: 'Again', pos: 'adverb', cefr: 'A1', syllables: 2 },
    // A2
    { word: 'Carefully', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Easily', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Happily', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Quietly', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Already', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Usually', pos: 'adverb', cefr: 'A2', syllables: 4 },
    { word: 'Suddenly', pos: 'adverb', cefr: 'A2', syllables: 3 },
    { word: 'Gently', pos: 'adverb', cefr: 'A2', syllables: 2 },
    // B1
    { word: 'Efficiently', pos: 'adverb', cefr: 'B1', syllables: 4 },
    { word: 'Dramatically', pos: 'adverb', cefr: 'B1', syllables: 5 },
    { word: 'Significantly', pos: 'adverb', cefr: 'B1', syllables: 5 },
    { word: 'Precisely', pos: 'adverb', cefr: 'B1', syllables: 3 },
    { word: 'Thoroughly', pos: 'adverb', cefr: 'B1', syllables: 3 },
    { word: 'Deliberately', pos: 'adverb', cefr: 'B1', syllables: 5 },
    // B2
    { word: 'Meticulously', pos: 'adverb', cefr: 'B2', syllables: 5 },
    { word: 'Predominantly', pos: 'adverb', cefr: 'B2', syllables: 5 },
    { word: 'Inadvertently', pos: 'adverb', cefr: 'B2', syllables: 5 },
    { word: 'Relentlessly', pos: 'adverb', cefr: 'B2', syllables: 4 },
    // C1
    { word: 'Unequivocally', pos: 'adverb', cefr: 'C1', syllables: 6 },
    { word: 'Surreptitiously', pos: 'adverb', cefr: 'C1', syllables: 5 },
    { word: 'Inexorably', pos: 'adverb', cefr: 'C1', syllables: 5 },
    // C2
    { word: 'Perfunctorily', pos: 'adverb', cefr: 'C2', syllables: 5 },
    { word: 'Ignominiously', pos: 'adverb', cefr: 'C2', syllables: 6 },
  ],
  nouns: [
    // A1
    { word: 'Fire', pos: 'noun', cefr: 'A1', category: 'nature' },
    { word: 'Water', pos: 'noun', cefr: 'A1', category: 'nature' },
    { word: 'Light', pos: 'noun', cefr: 'A1', category: 'nature' },
    { word: 'Stone', pos: 'noun', cefr: 'A1', category: 'nature' },
    { word: 'Time', pos: 'noun', cefr: 'A1', category: 'abstract' },
    { word: 'Power', pos: 'noun', cefr: 'A1', category: 'abstract' },
    { word: 'World', pos: 'noun', cefr: 'A1', category: 'nature' },
    { word: 'Storm', pos: 'noun', cefr: 'A1', category: 'nature' },
    // A2
    { word: 'Shadow', pos: 'noun', cefr: 'A2', category: 'nature' },
    { word: 'Journey', pos: 'noun', cefr: 'A2', category: 'abstract' },
    { word: 'Knowledge', pos: 'noun', cefr: 'A2', category: 'abstract' },
    { word: 'Culture', pos: 'noun', cefr: 'A2', category: 'abstract' },
    { word: 'Ocean', pos: 'noun', cefr: 'A2', category: 'nature' },
    { word: 'Kingdom', pos: 'noun', cefr: 'A2', category: 'society' },
    { word: 'Weapon', pos: 'noun', cefr: 'A2', category: 'combat' },
    { word: 'Fortress', pos: 'noun', cefr: 'A2', category: 'society' },
    // B1
    { word: 'Consequence', pos: 'noun', cefr: 'B1', category: 'abstract' },
    { word: 'Atmosphere', pos: 'noun', cefr: 'B1', category: 'nature' },
    { word: 'Phenomenon', pos: 'noun', cefr: 'B1', category: 'abstract' },
    { word: 'Mechanism', pos: 'noun', cefr: 'B1', category: 'tech' },
    { word: 'Legislation', pos: 'noun', cefr: 'B1', category: 'law' },
    { word: 'Catastrophe', pos: 'noun', cefr: 'B1', category: 'nature' },
    { word: 'Revelation', pos: 'noun', cefr: 'B1', category: 'abstract' },
    { word: 'Dominion', pos: 'noun', cefr: 'B1', category: 'society' },
    // B2
    { word: 'Jurisdiction', pos: 'noun', cefr: 'B2', category: 'law' },
    { word: 'Surveillance', pos: 'noun', cefr: 'B2', category: 'tech' },
    { word: 'Hypothesis', pos: 'noun', cefr: 'B2', category: 'abstract' },
    { word: 'Metamorphosis', pos: 'noun', cefr: 'B2', category: 'nature' },
    { word: 'Annihilation', pos: 'noun', cefr: 'B2', category: 'combat' },
    { word: 'Sovereignty', pos: 'noun', cefr: 'B2', category: 'society' },
    // C1
    { word: 'Paradigm', pos: 'noun', cefr: 'C1', category: 'abstract' },
    { word: 'Juxtaposition', pos: 'noun', cefr: 'C1', category: 'abstract' },
    { word: 'Cataclysm', pos: 'noun', cefr: 'C1', category: 'nature' },
    { word: 'Absolution', pos: 'noun', cefr: 'C1', category: 'abstract' },
    // C2
    { word: 'Verisimilitude', pos: 'noun', cefr: 'C2', category: 'abstract' },
    { word: 'Conflagration', pos: 'noun', cefr: 'C2', category: 'nature' },
    { word: 'Perspicacity', pos: 'noun', cefr: 'C2', category: 'abstract' },
  ],
  adjectives: [
    // A1
    { word: 'Dark', pos: 'adjective', cefr: 'A1', category: 'nature' },
    { word: 'Cold', pos: 'adjective', cefr: 'A1', category: 'nature' },
    { word: 'Fast', pos: 'adjective', cefr: 'A1', category: 'general' },
    { word: 'Strong', pos: 'adjective', cefr: 'A1', category: 'general' },
    { word: 'Old', pos: 'adjective', cefr: 'A1', category: 'general' },
    { word: 'New', pos: 'adjective', cefr: 'A1', category: 'general' },
    { word: 'Sharp', pos: 'adjective', cefr: 'A1', category: 'combat' },
    { word: 'Bright', pos: 'adjective', cefr: 'A1', category: 'nature' },
    // A2
    { word: 'Ancient', pos: 'adjective', cefr: 'A2', category: 'general' },
    { word: 'Powerful', pos: 'adjective', cefr: 'A2', category: 'combat' },
    { word: 'Brilliant', pos: 'adjective', cefr: 'A2', category: 'general' },
    { word: 'Strange', pos: 'adjective', cefr: 'A2', category: 'general' },
    { word: 'Gentle', pos: 'adjective', cefr: 'A2', category: 'general' },
    { word: 'Fierce', pos: 'adjective', cefr: 'A2', category: 'combat' },
    { word: 'Frozen', pos: 'adjective', cefr: 'A2', category: 'nature' },
    { word: 'Sacred', pos: 'adjective', cefr: 'A2', category: 'abstract' },
    // B1
    { word: 'Magnificent', pos: 'adjective', cefr: 'B1', category: 'general' },
    { word: 'Extraordinary', pos: 'adjective', cefr: 'B1', category: 'general' },
    { word: 'Significant', pos: 'adjective', cefr: 'B1', category: 'abstract' },
    { word: 'Fundamental', pos: 'adjective', cefr: 'B1', category: 'abstract' },
    { word: 'Devastating', pos: 'adjective', cefr: 'B1', category: 'combat' },
    { word: 'Relentless', pos: 'adjective', cefr: 'B1', category: 'combat' },
    { word: 'Treacherous', pos: 'adjective', cefr: 'B1', category: 'general' },
    { word: 'Volatile', pos: 'adjective', cefr: 'B1', category: 'nature' },
    // B2
    { word: 'Meticulous', pos: 'adjective', cefr: 'B2', category: 'general' },
    { word: 'Unequivocal', pos: 'adjective', cefr: 'B2', category: 'abstract' },
    { word: 'Catastrophic', pos: 'adjective', cefr: 'B2', category: 'nature' },
    { word: 'Inexorable', pos: 'adjective', cefr: 'B2', category: 'abstract' },
    { word: 'Formidable', pos: 'adjective', cefr: 'B2', category: 'combat' },
    { word: 'Insurmountable', pos: 'adjective', cefr: 'B2', category: 'abstract' },
    // C1
    { word: 'Ubiquitous', pos: 'adjective', cefr: 'C1', category: 'abstract' },
    { word: 'Ephemeral', pos: 'adjective', cefr: 'C1', category: 'abstract' },
    { word: 'Perfunctory', pos: 'adjective', cefr: 'C1', category: 'abstract' },
    { word: 'Indefatigable', pos: 'adjective', cefr: 'C1', category: 'general' },
    // C2
    { word: 'Sesquipedalian', pos: 'adjective', cefr: 'C2', category: 'abstract' },
    { word: 'Perspicacious', pos: 'adjective', cefr: 'C2', category: 'abstract' },
  ],
};

// ========== STARTER DECK ==========
// Universal deck: 10 each POS type = 40 cards, weighted toward A1-B1
export function createStarterDeck() {
  const deck = [];
  let id = 0;
  const pick = (pool, words) => {
    for (const w of words) {
      const t = pool.find(v => v.word === w);
      if (t) deck.push({ ...t, id: id++ });
    }
  };
  pick(VOCAB.verbs, [
    'Run', 'Eat', 'See', 'Make', 'Go',
    'Ran', 'Saw', 'Made', 'Went', 'Found',
    'Travel', 'Create', 'Enjoyed', 'Discovered',
  ]);
  pick(VOCAB.adverbs, [
    'Quickly', 'Slowly', 'Well', 'Often', 'Always',
    'Carefully', 'Easily', 'Happily', 'Suddenly',
    'Efficiently', 'Dramatically', 'Precisely',
  ]);
  pick(VOCAB.nouns, [
    'Fire', 'Water', 'Light', 'Stone', 'Storm',
    'Shadow', 'Journey', 'Kingdom', 'Weapon',
    'Consequence', 'Phenomenon', 'Catastrophe',
  ]);
  pick(VOCAB.adjectives, [
    'Dark', 'Cold', 'Strong', 'Sharp', 'Bright',
    'Ancient', 'Powerful', 'Fierce', 'Frozen',
    'Magnificent', 'Devastating', 'Relentless',
  ]);
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

// ========== WEAPONS ==========
export const WEAPONS = [
  {
    id: 'dual_uzi',
    name: 'The Dual-Uzi',
    icon: '🔫',
    type: 'Rapid Fire',
    slots: [
      { required: 'verb', label: 'VERB' },
      { required: 'adverb', label: 'ADVERB' },
    ],
    damageMultiplier: 1.0,
    description: 'Fast two-slot combo. Verbs and adverbs deal full damage.',
    bonus: null,
  },
  {
    id: 'shotgun',
    name: 'The Shotgun',
    icon: '🔥',
    type: 'Blast',
    slots: [
      { required: 'adjective', label: 'ADJECTIVE' },
      { required: 'noun', label: 'NOUN' },
    ],
    damageMultiplier: 1.15,
    description: 'Describe your target, then name it. +15% damage multiplier.',
    bonus: null,
  },
  {
    id: 'railgun',
    name: 'The Heavy Railgun',
    icon: '⚡',
    type: 'Sniper',
    slots: [
      { required: 'adjective', label: 'ADJ' },
      { required: 'adjective', label: 'ADJ' },
      { required: 'noun', label: 'NOUN' },
    ],
    damageMultiplier: 1.5,
    description: 'Stack two adjectives for a devastating noun strike. x1.5 damage.',
    bonus: null,
  },
  {
    id: 'staff',
    name: 'The Ancient Staff',
    icon: '🪄',
    type: 'Arcane',
    slots: [
      { required: 'verb', label: 'VERB' },
      { required: 'noun', label: 'NOUN' },
      { required: 'adverb', label: 'ADVERB' },
    ],
    damageMultiplier: 1.1,
    description: 'Balanced three-slot combo. Each execution grants 4 shield.',
    bonus: { type: 'shield', value: 4 },
  },
];

// ========== ITEMS / RELICS ==========
export const ITEMS = [
  // ---- COMMON ----
  {
    id: 'suffix_tip', name: 'The Suffix Tip', rarity: 'common', icon: '📝',
    description: 'Words ending in -tion or -ly deal +20% damage.',
    check: (card) => {
      const w = card.word.toLowerCase();
      return w.endsWith('tion') || w.endsWith('ly');
    },
    effect: { damageMultiplier: 1.2 },
  },
  {
    id: 'vowel_surge', name: 'Vowel Surge', rarity: 'common', icon: '🌀',
    description: 'Words starting with a vowel deal +15% damage.',
    check: (card) => 'aeiou'.includes(card.word[0].toLowerCase()),
    effect: { damageMultiplier: 1.15 },
  },
  {
    id: 'thick_skin', name: 'Thick Skin', rarity: 'common', icon: '🛡',
    description: '+15 max HP.',
    onPickup: (state) => { state.player.maxHP += 15; state.player.hp += 15; },
    check: () => false,
    effect: {},
  },
  {
    id: 'iron_will', name: 'Iron Will', rarity: 'common', icon: '⚙',
    description: 'Reduce all boss damage by 2.',
    passive: { reduceDamage: 2 },
    check: () => false,
    effect: {},
  },
  {
    id: 'quick_draw', name: 'Quick Draw', rarity: 'common', icon: '🃏',
    description: 'Draw 1 extra card per turn.',
    onPickup: (state) => { state.player.character = { ...state.player.character, handSize: state.player.character.handSize + 1 }; },
    check: () => false,
    effect: {},
  },
  {
    id: 'combo_starter', name: 'Combo Starter', rarity: 'common', icon: '🎯',
    description: 'First card played each execution deals +30% damage.',
    checkIndex: (card, index) => index === 0,
    check: () => false,
    effect: { damageMultiplier: 1.3 },
  },
  {
    id: 'long_word_power', name: 'Verbose Strike', rarity: 'common', icon: '📏',
    description: 'Words with 8+ letters deal +25% damage.',
    check: (card) => card.word.length >= 8,
    effect: { damageMultiplier: 1.25 },
  },
  {
    id: 'past_echo', name: 'Past Echo', rarity: 'common', icon: '⏳',
    description: 'Past tense verbs heal 3 HP.',
    check: (card) => card.pos === 'verb' && card.tense === 'past',
    effect: { heal: 3 },
  },
  // ---- RARE ----
  {
    id: 'syllable_battery', name: 'Syllable Battery', rarity: 'rare', icon: '⚡',
    description: 'Track syllables. Every 8 syllables, deal 18 bonus damage.',
    trackSyllables: true,
    syllableThreshold: 8,
    syllableDamage: 18,
    check: () => false,
    effect: {},
  },
  {
    id: 'grammar_shield', name: 'Grammar Shield', rarity: 'rare', icon: '🔰',
    description: 'Filling all slots grants 10 shield.',
    onFullExecute: true,
    fullExecuteShield: 10,
    check: () => false,
    effect: {},
  },
  {
    id: 'polyglot_ring', name: "Polyglot's Ring", rarity: 'rare', icon: '💎',
    description: 'B2+ cards deal +35% damage.',
    check: (card) => ['B2', 'C1', 'C2'].includes(card.cefr),
    effect: { damageMultiplier: 1.35 },
  },
  {
    id: 'echo_breaker', name: 'Echo Breaker', rarity: 'rare', icon: '🔇',
    description: 'Immune to word repetition penalties (boss affixes).',
    passive: { immuneRepeat: true },
    check: () => false,
    effect: {},
  },
  {
    id: 'noun_mastery', name: 'Noun Mastery', rarity: 'rare', icon: '🏛',
    description: 'Nouns deal +40% damage and grant 3 shield.',
    check: (card) => card.pos === 'noun',
    effect: { damageMultiplier: 1.4, shield: 3 },
  },
  // ---- LEGENDARY ----
  {
    id: 'golden_vocabulary', name: 'The Golden Vocabulary', rarity: 'legendary', icon: '👑',
    description: 'C1+ cards deal +60% damage. C2 cards also stun boss for 1 turn.',
    check: (card) => ['C1', 'C2'].includes(card.cefr),
    effect: { damageMultiplier: 1.6 },
    stunOnC2: true,
  },
  {
    id: 'multilingual_core', name: 'The Multilingual Core', rarity: 'legendary', icon: '🌟',
    description: 'Every execution has 30% chance to deal 25 bonus lightning damage.',
    onExecuteChance: 0.3,
    onExecuteDamage: 25,
    check: () => false,
    effect: {},
  },
  {
    id: 'linguist_crown', name: "Linguist's Crown", rarity: 'legendary', icon: '🏆',
    description: 'ALL damage +50%. But boss attack +25%.',
    onPickup: (state) => { state.boss.attackBoost += Math.floor(state.boss.data.baseAttack * 0.25); },
    check: () => true,
    effect: { damageMultiplier: 1.5 },
  },
];

// ========== PROCEDURAL BOSS GENERATION ==========
const BOSS_PREFIXES = [
  'The Echoing', 'The Silent', 'The Burning', 'The Frozen', 'The Void',
  'The Ancient', 'The Crimson', 'The Shadow', 'The Iron', 'The Cursed',
  'The Eternal', 'The Shattered', 'The Whispering', 'The Abyssal', 'The Luminous',
];

const BOSS_NAMES = [
  'Cave', 'Warden', 'Judge', 'Serpent', 'Golem',
  'Phantom', 'Colossus', 'Oracle', 'Leviathan', 'Wraith',
  'Sentinel', 'Behemoth', 'Specter', 'Monolith', 'Devourer',
];

const BOSS_SPRITES = ['🦇', '🐉', '👹', '💀', '🗿', '👁', '🕷', '🦑', '⚔', '🌑', '🔥', '❄', '🌪', '🐍', '👻'];

const BOSS_TYPES = [
  'Ancient Guardian', 'Void Entity', 'Cursed Spirit', 'Forgotten Beast',
  'Eldritch Horror', 'Dark Construct', 'Linguistic Demon', 'Syntax Abomination',
];

// ---- Boss Affixes ----
export const BOSS_AFFIXES = [
  {
    id: 'repetition_curse',
    name: 'Repetition Curse',
    icon: '🔁',
    description: 'Using a word from last turn reflects damage back!',
    type: 'repetition',
  },
  {
    id: 'tense_lock',
    name: 'Tense Lockdown',
    icon: '⏰',
    description: 'Only accepts {tense} tense verbs. Changes every 2 turns.',
    type: 'tenseLock',
    tenses: ['past', 'present'],
  },
  {
    id: 'pos_shield',
    name: 'Linguistic Shield',
    icon: '🛡',
    description: 'Immune to {pos} cards this turn. Rotates each turn.',
    type: 'posShield',
    posTypes: ['verb', 'adverb', 'noun', 'adjective'],
  },
  {
    id: 'vocab_gate',
    name: 'Vocabulary Gate',
    icon: '🚪',
    description: 'Only B1+ cards deal damage. A1/A2 cards deal 0.',
    type: 'vocabGate',
    minCefr: 'B1',
  },
  {
    id: 'short_fuse',
    name: 'Short Fuse',
    icon: '💥',
    description: 'Words with 4 or fewer letters deal 50% less damage.',
    type: 'shortFuse',
    maxLen: 4,
    penalty: 0.5,
  },
  {
    id: 'echo_amp',
    name: 'Echo Amplifier',
    icon: '📈',
    description: 'Boss gains +3 attack power each turn.',
    type: 'echoAmp',
    perTurn: 3,
  },
  {
    id: 'suffix_hunter',
    name: 'Suffix Hunter',
    icon: '🎯',
    description: 'Words ending in -ed or -ing deal +25% damage to this boss.',
    type: 'suffixBonus',
    suffixes: ['ed', 'ing'],
    bonus: 1.25,
  },
  {
    id: 'mirror_shield',
    name: 'Mirror Shield',
    icon: '🪞',
    description: 'Boss reflects 30% of damage taken back to you.',
    type: 'mirror',
    reflectPct: 0.3,
  },
];

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function generateBoss(difficulty) {
  const prefix = BOSS_PREFIXES[Math.floor(Math.random() * BOSS_PREFIXES.length)];
  const name = BOSS_NAMES[Math.floor(Math.random() * BOSS_NAMES.length)];
  const sprite = BOSS_SPRITES[Math.floor(Math.random() * BOSS_SPRITES.length)];
  const type = BOSS_TYPES[Math.floor(Math.random() * BOSS_TYPES.length)];

  // Scale stats with difficulty (1-based)
  const baseHP = 80 + difficulty * 40;
  const baseAtk = 6 + difficulty * 2;
  const maxAtk = baseAtk + 6;

  // Pick 1-2 affixes (more at higher difficulty)
  const numAffixes = difficulty >= 3 ? 2 : 1;
  const shuffled = [...BOSS_AFFIXES].sort(() => Math.random() - 0.5);
  const affixes = shuffled.slice(0, numAffixes);

  // Special attack
  const specialEvery = Math.max(2, 4 - Math.floor(difficulty / 3));
  const specialMin = 14 + difficulty * 3;
  const specialMax = specialMin + 8;

  return {
    name: `${prefix} ${name}`,
    icon: sprite,
    type,
    maxHP: baseHP,
    baseAttack: baseAtk,
    maxAttack: maxAtk,
    affixes,
    specialEvery,
    specialAttack: { min: specialMin, max: specialMax, name: 'Devastating Strike' },
    phases: [
      { hpPercent: 75, message: 'The air crackles with dark energy...' },
      { hpPercent: 50, message: 'The ground trembles beneath you!' },
      { hpPercent: 25, message: 'A primal scream echoes!', attackBoost: 3 + difficulty },
    ],
    difficulty,
  };
}

// Helper: check CEFR meets minimum
export function cefrMeetsMin(cefr, min) {
  return CEFR_ORDER.indexOf(cefr) >= CEFR_ORDER.indexOf(min);
}

// ========== LOOT: random item selection ==========
export function getRandomItems(count, excludeIds = []) {
  const available = ITEMS.filter(i => !excludeIds.includes(i.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);

  // Weighted by rarity
  const weighted = [];
  for (const item of shuffled) {
    if (item.rarity === 'common') weighted.push(item, item, item); // 3x chance
    else if (item.rarity === 'rare') weighted.push(item, item); // 2x chance
    else weighted.push(item); // 1x chance
  }

  const result = [];
  const seen = new Set();
  for (const item of weighted.sort(() => Math.random() - 0.5)) {
    if (!seen.has(item.id) && result.length < count) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}
