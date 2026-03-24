// ========== GAME ENGINE ==========
import { CEFR_DAMAGE, CHARACTER, WEAPON, BOSS, createStarterDeck } from './data.js';

// ---- Utility ----
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========== GAME STATE ==========
export function createGameState() {
  const starterDeck = createStarterDeck();
  return {
    // Player
    player: {
      hp: CHARACTER.baseHP,
      maxHP: CHARACTER.baseHP,
      shield: 0,
      character: CHARACTER,
    },
    // Boss
    boss: {
      hp: BOSS.maxHP,
      maxHP: BOSS.maxHP,
      data: BOSS,
      attackBoost: 0,
      phasesTriggered: new Set(),
    },
    // Cards
    deck: shuffle(starterDeck),
    hand: [],
    discard: [],
    // Weapon slots: array of card or null
    slots: WEAPON.slots.map(() => null),
    weapon: WEAPON,
    // Combat state
    turn: 1,
    phase: 'play', // 'play' | 'executing' | 'enemy' | 'victory' | 'defeat'
    lastTurnWords: [],   // words used last turn (for Echoing Cave)
    currentTurnWords: [], // words used this turn
    // Stats
    stats: {
      totalDamage: 0,
      turnsPlayed: 0,
      wordsUsed: 0,
      pastTenseUsed: 0,
      highestDamage: 0,
      misfires: 0,
    },
  };
}

// ========== CARD OPERATIONS ==========
export function drawCards(state) {
  const toDraw = CHARACTER.handSize - state.hand.length;
  for (let i = 0; i < toDraw; i++) {
    if (state.deck.length === 0) {
      if (state.discard.length === 0) break; // No cards left at all
      state.deck = shuffle(state.discard);
      state.discard = [];
    }
    state.hand.push(state.deck.pop());
  }
  return state;
}

export function placeCard(state, cardId, slotIndex) {
  const cardIdx = state.hand.findIndex(c => c.id === cardId);
  if (cardIdx === -1) return { state, success: false, reason: 'Card not in hand' };

  const card = state.hand[cardIdx];
  const requiredPOS = state.weapon.slots[slotIndex].required;

  if (card.pos !== requiredPOS) {
    return { state, success: false, reason: `Requires ${requiredPOS}, got ${card.pos}` };
  }

  // Remove from old slot if already placed
  const oldSlot = state.slots.findIndex(s => s && s.id === cardId);
  if (oldSlot !== -1) state.slots[oldSlot] = null;

  // If slot already has a card, return it to hand
  if (state.slots[slotIndex]) {
    state.hand.push(state.slots[slotIndex]);
    state.slots[slotIndex] = null;
  }

  // Place card
  state.hand.splice(cardIdx, 1);
  state.slots[slotIndex] = card;

  return { state, success: true };
}

export function removeCardFromSlot(state, slotIndex) {
  if (state.slots[slotIndex]) {
    state.hand.push(state.slots[slotIndex]);
    state.slots[slotIndex] = null;
  }
  return state;
}

export function allSlotsFilled(state) {
  return state.slots.every(s => s !== null);
}

// ========== EXECUTE (COMBAT RESOLUTION) ==========
export function executeAttack(state) {
  if (!allSlotsFilled(state)) return { state, results: [] };

  const results = [];
  let totalDamage = 0;
  let reflected = false;

  for (let i = 0; i < state.slots.length; i++) {
    const card = state.slots[i];
    const baseDmg = CEFR_DAMAGE[card.cefr] || 10;
    let damage = baseDmg;
    let bonusType = 'normal';
    let bonuses = [];

    // Check Echoing Cave affix: repeated word from last turn
    const wordLower = card.word.toLowerCase();
    const isRepeated = state.lastTurnWords.includes(wordLower);

    if (isRepeated) {
      // Damage reflected back to player!
      reflected = true;
      results.push({
        card,
        damage: 0,
        reflected: true,
        reflectedDamage: damage,
        bonusType: 'blocked',
        bonuses: ['REFLECTED! Same word as last turn!'],
        sentence: card.word,
      });
      // Apply reflected damage to player
      state.player.hp = Math.max(0, state.player.hp - damage);
      state.currentTurnWords.push(wordLower);
      continue;
    }

    // Character passive: Historian - past tense bonus
    if (CHARACTER.passive.trigger(card)) {
      const extraDmg = Math.floor(damage * (CHARACTER.passive.damageMultiplier - 1));
      damage = Math.floor(damage * CHARACTER.passive.damageMultiplier);
      bonusType = 'character';
      bonuses.push(`📜 Ancient Knowledge +${extraDmg}`);
      state.player.shield += CHARACTER.passive.shield;
      bonuses.push(`🛡 +${CHARACTER.passive.shield} Shield`);
      state.stats.pastTenseUsed++;
    }

    totalDamage += damage;
    state.currentTurnWords.push(wordLower);

    results.push({
      card,
      damage,
      reflected: false,
      bonusType,
      bonuses,
      sentence: card.word,
    });
  }

  // Apply damage to boss
  state.boss.hp = Math.max(0, state.boss.hp - totalDamage);

  // Discard used cards
  for (const card of state.slots) {
    if (card) state.discard.push(card);
  }
  state.slots = state.weapon.slots.map(() => null);

  // Update stats
  state.stats.totalDamage += totalDamage;
  state.stats.wordsUsed += results.length;
  if (totalDamage > state.stats.highestDamage) {
    state.stats.highestDamage = totalDamage;
  }

  // Build sentence summary
  const sentence = results.map(r => r.card.word).join(' ');

  // Check boss phase triggers
  const phaseMessages = [];
  for (const phase of state.boss.data.phases) {
    const hpPercent = (state.boss.hp / state.boss.maxHP) * 100;
    if (hpPercent <= phase.hpPercent && !state.boss.phasesTriggered.has(phase.hpPercent)) {
      state.boss.phasesTriggered.add(phase.hpPercent);
      phaseMessages.push(phase.message);
      if (phase.attackBoost) state.boss.attackBoost += phase.attackBoost;
    }
  }

  // Check victory
  if (state.boss.hp <= 0) {
    state.phase = 'victory';
  }

  return { state, results, totalDamage, sentence, reflected, phaseMessages };
}

// ========== BOSS TURN ==========
export function bossTurn(state) {
  if (state.phase === 'victory' || state.phase === 'defeat') return { state, damage: 0 };

  const boss = state.boss;
  let damage;
  let isSpecial = false;
  let attackName = 'Echo Strike';

  // Special attack every N turns
  if (state.turn % boss.data.specialEvery === 0) {
    damage = randInt(boss.data.specialAttack.min, boss.data.specialAttack.max);
    isSpecial = true;
    attackName = boss.data.specialAttack.name;
  } else {
    damage = randInt(boss.data.baseAttack, boss.data.maxAttack);
  }

  damage += boss.attackBoost;

  // Apply shield
  let shieldAbsorbed = 0;
  if (state.player.shield > 0) {
    shieldAbsorbed = Math.min(state.player.shield, damage);
    state.player.shield -= shieldAbsorbed;
    damage -= shieldAbsorbed;
  }

  state.player.hp = Math.max(0, state.player.hp - damage);

  if (state.player.hp <= 0) {
    state.phase = 'defeat';
  }

  return { state, damage, shieldAbsorbed, isSpecial, attackName };
}

// ========== END TURN ==========
export function endTurn(state) {
  // Move current turn words to last turn words
  state.lastTurnWords = [...state.currentTurnWords];
  state.currentTurnWords = [];
  state.turn++;
  state.stats.turnsPlayed++;
  state.phase = 'play';

  // Discard remaining hand, then draw fresh
  state.discard.push(...state.hand);
  state.hand = [];
  drawCards(state);

  return state;
}
