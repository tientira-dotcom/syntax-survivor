// ========== GAME ENGINE ==========
import { CEFR_DAMAGE, CHARACTER, WEAPONS, ITEMS, generateBoss, cefrMeetsMin, createStarterDeck } from './data.js';

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
export function createGameState(weaponId, difficulty = 1) {
  const weapon = WEAPONS.find(w => w.id === weaponId) || WEAPONS[0];
  const boss = generateBoss(difficulty);
  const starterDeck = createStarterDeck();

  return {
    player: {
      hp: CHARACTER.baseHP,
      maxHP: CHARACTER.baseHP,
      shield: 0,
      character: { ...CHARACTER },
    },
    boss: {
      hp: boss.maxHP,
      maxHP: boss.maxHP,
      data: boss,
      attackBoost: 0,
      phasesTriggered: new Set(),
      stunned: false,
    },
    deck: shuffle(starterDeck),
    hand: [],
    discard: [],
    slots: weapon.slots.map(() => null),
    weapon,
    items: [],
    turn: 1,
    bossNumber: difficulty,
    phase: 'play',
    lastTurnWords: [],
    currentTurnWords: [],
    syllableCount: 0,
    stats: {
      totalDamage: 0,
      turnsPlayed: 0,
      wordsUsed: 0,
      pastTenseUsed: 0,
      highestDamage: 0,
      misfires: 0,
      bossesDefeated: 0,
      itemsCollected: 0,
    },
  };
}

// Progress to next boss (keep items, deck, stats, HP)
export function progressToNextBoss(state) {
  const nextDifficulty = state.bossNumber + 1;
  const boss = generateBoss(nextDifficulty);

  state.boss = {
    hp: boss.maxHP,
    maxHP: boss.maxHP,
    data: boss,
    attackBoost: 0,
    phasesTriggered: new Set(),
    stunned: false,
  };
  state.bossNumber = nextDifficulty;
  state.turn = 1;
  state.phase = 'play';
  state.lastTurnWords = [];
  state.currentTurnWords = [];
  state.slots = state.weapon.slots.map(() => null);

  // Reshuffle all cards
  state.deck = shuffle([...state.deck, ...state.hand, ...state.discard]);
  state.hand = [];
  state.discard = [];

  return state;
}

// ========== ITEM MANAGEMENT ==========
export function pickItem(state, itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  if (!item) return state;

  state.items.push({ ...item });
  state.stats.itemsCollected++;

  if (item.onPickup) {
    item.onPickup(state);
  }

  return state;
}

// ========== CARD OPERATIONS ==========
export function drawCards(state) {
  const handSize = state.player.character.handSize || CHARACTER.handSize;
  const toDraw = handSize - state.hand.length;
  for (let i = 0; i < toDraw; i++) {
    if (state.deck.length === 0) {
      if (state.discard.length === 0) break;
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

  const oldSlot = state.slots.findIndex(s => s && s.id === cardId);
  if (oldSlot !== -1) state.slots[oldSlot] = null;

  if (state.slots[slotIndex]) {
    state.hand.push(state.slots[slotIndex]);
    state.slots[slotIndex] = null;
  }

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
  let totalReflected = 0;
  let syllablesThisTurn = 0;
  const hasImmuneRepeat = state.items.some(i => i.passive && i.passive.immuneRepeat);

  for (let i = 0; i < state.slots.length; i++) {
    const card = state.slots[i];
    const baseDmg = CEFR_DAMAGE[card.cefr] || 10;
    let damage = baseDmg;
    let bonusType = 'normal';
    let bonuses = [];
    let blocked = false;

    const wordLower = card.word.toLowerCase();

    // ---- Boss Affix checks ----
    for (const affix of state.boss.data.affixes) {
      if (blocked) break;
      switch (affix.type) {
        case 'repetition':
          if (!hasImmuneRepeat && state.lastTurnWords.includes(wordLower)) {
            blocked = true;
            const reflectDmg = damage;
            totalReflected += reflectDmg;
            results.push({
              card, damage: 0, reflected: true, reflectedDamage: reflectDmg,
              bonusType: 'blocked',
              bonuses: [`${affix.icon} REFLECTED! Same word as last turn!`],
            });
            state.player.hp = Math.max(0, state.player.hp - reflectDmg);
          }
          break;

        case 'tenseLock': {
          if (card.pos === 'verb') {
            const lockIndex = Math.floor((state.turn - 1) / 2) % affix.tenses.length;
            const requiredTense = affix.tenses[lockIndex];
            if (card.tense !== requiredTense) {
              damage = 0;
              bonuses.push(`${affix.icon} Tense Lock: only ${requiredTense} verbs!`);
              bonusType = 'blocked';
            }
          }
          break;
        }

        case 'posShield': {
          const shieldIndex = (state.turn - 1) % affix.posTypes.length;
          const blockedPOS = affix.posTypes[shieldIndex];
          if (card.pos === blockedPOS) {
            damage = 0;
            bonuses.push(`${affix.icon} Shield blocks ${blockedPOS}!`);
            bonusType = 'blocked';
          }
          break;
        }

        case 'vocabGate':
          if (!cefrMeetsMin(card.cefr, affix.minCefr)) {
            damage = 0;
            bonuses.push(`${affix.icon} Vocab Gate: ${affix.minCefr}+ required!`);
            bonusType = 'blocked';
          }
          break;

        case 'shortFuse':
          if (card.word.length <= affix.maxLen) {
            damage = Math.floor(damage * affix.penalty);
            bonuses.push(`${affix.icon} Short Fuse: -50%`);
          }
          break;

        case 'suffixBonus':
          if (affix.suffixes.some(s => wordLower.endsWith(s))) {
            damage = Math.floor(damage * affix.bonus);
            bonuses.push(`${affix.icon} Suffix bonus: +25%`);
            if (bonusType === 'normal') bonusType = 'character';
          }
          break;
      }
    }

    if (blocked) {
      state.currentTurnWords.push(wordLower);
      continue;
    }

    // ---- Character passive: Historian ----
    if (damage > 0 && CHARACTER.passive.trigger(card)) {
      const extraDmg = Math.floor(damage * (CHARACTER.passive.damageMultiplier - 1));
      damage = Math.floor(damage * CHARACTER.passive.damageMultiplier);
      bonusType = 'character';
      bonuses.push(`📜 Ancient Knowledge +${extraDmg}`);
      state.player.shield += CHARACTER.passive.shield;
      bonuses.push(`🛡 +${CHARACTER.passive.shield} Shield`);
      state.stats.pastTenseUsed++;
    }

    // ---- Item effects ----
    if (damage > 0) {
      for (const item of state.items) {
        if (item.check && item.check(card)) {
          if (item.effect.damageMultiplier) {
            const before = damage;
            damage = Math.floor(damage * item.effect.damageMultiplier);
            bonuses.push(`${item.icon} ${item.name} +${damage - before}`);
            if (bonusType === 'normal') bonusType = 'character';
          }
          if (item.effect.heal) {
            state.player.hp = Math.min(state.player.maxHP, state.player.hp + item.effect.heal);
            bonuses.push(`${item.icon} +${item.effect.heal} HP`);
          }
          if (item.effect.shield) {
            state.player.shield += item.effect.shield;
            bonuses.push(`${item.icon} +${item.effect.shield} Shield`);
          }
        }
        if (item.checkIndex && item.checkIndex(card, i)) {
          if (item.effect.damageMultiplier) {
            const before = damage;
            damage = Math.floor(damage * item.effect.damageMultiplier);
            bonuses.push(`${item.icon} ${item.name} +${damage - before}`);
            if (bonusType === 'normal') bonusType = 'character';
          }
        }
        if (item.stunOnC2 && card.cefr === 'C2') {
          state.boss.stunned = true;
          bonuses.push(`${item.icon} C2 STUN!`);
        }
      }
    }

    // ---- Weapon multiplier ----
    if (damage > 0 && state.weapon.damageMultiplier !== 1.0) {
      damage = Math.floor(damage * state.weapon.damageMultiplier);
    }

    // ---- Syllable tracking ----
    if (card.syllables) syllablesThisTurn += card.syllables;

    totalDamage += damage;
    state.currentTurnWords.push(wordLower);

    results.push({ card, damage, reflected: false, bonusType, bonuses, sentence: card.word });
  }

  // ---- Weapon bonus (staff shield) ----
  if (state.weapon.bonus && state.weapon.bonus.type === 'shield') {
    state.player.shield += state.weapon.bonus.value;
  }

  // ---- Grammar Shield item ----
  for (const item of state.items) {
    if (item.onFullExecute) {
      state.player.shield += item.fullExecuteShield;
    }
  }

  // ---- Syllable Battery ----
  state.syllableCount += syllablesThisTurn;
  for (const item of state.items) {
    if (item.trackSyllables) {
      while (state.syllableCount >= item.syllableThreshold) {
        state.syllableCount -= item.syllableThreshold;
        totalDamage += item.syllableDamage;
      }
    }
  }

  // ---- Multilingual Core ----
  for (const item of state.items) {
    if (item.onExecuteChance && Math.random() < item.onExecuteChance) {
      totalDamage += item.onExecuteDamage;
    }
  }

  // ---- Mirror Shield affix ----
  for (const affix of state.boss.data.affixes) {
    if (affix.type === 'mirror' && totalDamage > 0) {
      const mirrorDmg = Math.floor(totalDamage * affix.reflectPct);
      state.player.hp = Math.max(0, state.player.hp - mirrorDmg);
      totalReflected += mirrorDmg;
    }
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
  const cardCount = state.weapon.slots.length;
  state.stats.wordsUsed += cardCount;
  if (totalDamage > state.stats.highestDamage) state.stats.highestDamage = totalDamage;

  const sentence = results.filter(r => r.card).map(r => r.card.word).join(' ');

  // Phase triggers
  const phaseMessages = [];
  for (const phase of state.boss.data.phases) {
    const hpPct = (state.boss.hp / state.boss.maxHP) * 100;
    if (hpPct <= phase.hpPercent && !state.boss.phasesTriggered.has(phase.hpPercent)) {
      state.boss.phasesTriggered.add(phase.hpPercent);
      phaseMessages.push(phase.message);
      if (phase.attackBoost) state.boss.attackBoost += phase.attackBoost;
    }
  }

  if (state.boss.hp <= 0) {
    state.phase = 'victory';
    state.stats.bossesDefeated++;
  }

  return { state, results, totalDamage, totalReflected, sentence, reflected: totalReflected > 0, phaseMessages };
}

// ========== BOSS TURN ==========
export function bossTurn(state) {
  if (state.phase === 'victory' || state.phase === 'defeat') return { state, damage: 0 };

  if (state.boss.stunned) {
    state.boss.stunned = false;
    return { state, damage: 0, shieldAbsorbed: 0, isSpecial: false, attackName: 'STUNNED', stunned: true };
  }

  const boss = state.boss;
  let damage;
  let isSpecial = false;
  let attackName = 'Strike';

  if (state.turn % boss.data.specialEvery === 0) {
    damage = randInt(boss.data.specialAttack.min, boss.data.specialAttack.max);
    isSpecial = true;
    attackName = boss.data.specialAttack.name;
  } else {
    damage = randInt(boss.data.baseAttack, boss.data.maxAttack);
  }

  damage += boss.attackBoost;

  // Echo Amp affix
  for (const affix of boss.data.affixes) {
    if (affix.type === 'echoAmp') {
      boss.attackBoost += affix.perTurn;
    }
  }

  // Iron Will item
  for (const item of state.items) {
    if (item.passive && item.passive.reduceDamage) {
      damage = Math.max(0, damage - item.passive.reduceDamage);
    }
  }

  // Shield
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

  return { state, damage, shieldAbsorbed, isSpecial, attackName, stunned: false };
}

// ========== END TURN ==========
export function endTurn(state) {
  state.lastTurnWords = [...state.currentTurnWords];
  state.currentTurnWords = [];
  state.turn++;
  state.stats.turnsPlayed++;
  state.phase = 'play';

  state.discard.push(...state.hand);
  state.hand = [];
  drawCards(state);

  return state;
}
