// ========== UI RENDERING & INTERACTIONS ==========
import { CEFR_DAMAGE, CHARACTER } from './data.js';
import { placeCard, removeCardFromSlot, allSlotsFilled, executeAttack, bossTurn, endTurn } from './engine.js';
import { SFX } from './sound.js';
import { VFX } from './vfx.js';

let gameState = null;
let onGameOver = null;
let selectedCardId = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---- Initialize UI ----
export function initCombatUI(state, gameOverCallback) {
  gameState = state;
  onGameOver = gameOverCallback;
  selectedCardId = null;
  renderAll();
  setupDragDrop();
  setupButtons();
  addLog('system', `⚔ Combat begins! You face ${state.boss.data.name}.`);
  addLog('system', `⚠ ${state.boss.data.affix.name}: ${state.boss.data.affix.description}`);
  updateBossIntent();
}

// ---- Full Render ----
function renderAll() {
  renderHand();
  renderSlots();
  renderHP();
  renderDeckInfo();
  updateExecuteButton();
  $('#turn-number').textContent = gameState.turn;
  $('#hand-count').textContent = gameState.hand.length;
}

// ---- Render Hand ----
function renderHand() {
  const container = $('#hand-cards');
  container.innerHTML = '';
  for (const card of gameState.hand) {
    container.appendChild(createCardElement(card));
  }
  $('#hand-count').textContent = gameState.hand.length;
}

function createCardElement(card) {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.cardId = card.id;
  el.dataset.pos = card.pos;
  el.dataset.cefr = card.cefr;
  el.draggable = true;

  const isHistorianBonus = CHARACTER.passive.trigger(card);
  if (isHistorianBonus) el.classList.add('historian-bonus');
  if (selectedCardId === card.id) el.classList.add('selected');

  const baseDmg = CEFR_DAMAGE[card.cefr] || 10;
  const dmgDisplay = isHistorianBonus ? Math.floor(baseDmg * CHARACTER.passive.damageMultiplier) : baseDmg;
  const tenseHTML = card.tense ? `<div class="card-tense">${card.tense}</div>` : '';
  const bonusIcon = isHistorianBonus ? '<div class="card-bonus-icon">✦</div>' : '';

  el.innerHTML = `
    ${bonusIcon}
    <div class="card-pos-tag">${card.pos}</div>
    <div class="card-word">${card.word}</div>
    ${tenseHTML}
    <div class="card-footer">
      <span class="card-cefr">${card.cefr}</span>
      <span class="card-dmg">⚔${dmgDisplay}</span>
    </div>
  `;

  // Drag
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', card.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    el.classList.add('dragging');
    highlightValidSlots(card.pos);
    SFX.cardSelect();
  });
  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
    clearSlotHighlights();
  });

  // Touch
  el.addEventListener('touchstart', handleTouchStart, { passive: false });
  el.addEventListener('touchmove', handleTouchMove, { passive: false });
  el.addEventListener('touchend', handleTouchEnd, { passive: false });

  // Click-to-select
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    if (gameState.phase !== 'play') return;
    if (selectedCardId === card.id) {
      selectedCardId = null;
      renderHand();
      clearSlotHighlights();
      return;
    }
    selectedCardId = card.id;
    SFX.cardSelect();
    renderHand();
    highlightValidSlots(card.pos);
  });

  return el;
}

// ---- Touch Drag ----
let touchDragData = null;

function handleTouchStart(e) {
  const card = gameState.hand.find(c => c.id === parseInt(e.currentTarget.dataset.cardId));
  if (!card) return;
  e.preventDefault();
  const touch = e.touches[0];
  touchDragData = { cardId: card.id, pos: card.pos, el: e.currentTarget, startX: touch.clientX, startY: touch.clientY, clone: null };
  e.currentTarget.classList.add('dragging');
  highlightValidSlots(card.pos);
  SFX.cardSelect();
}

function handleTouchMove(e) {
  if (!touchDragData) return;
  e.preventDefault();
  const touch = e.touches[0];
  if (!touchDragData.clone) {
    touchDragData.clone = touchDragData.el.cloneNode(true);
    Object.assign(touchDragData.clone.style, { position: 'fixed', zIndex: '1000', pointerEvents: 'none', opacity: '0.85', transform: 'scale(0.9)' });
    document.body.appendChild(touchDragData.clone);
  }
  const rect = touchDragData.el.getBoundingClientRect();
  touchDragData.clone.style.left = (touch.clientX - rect.width / 2) + 'px';
  touchDragData.clone.style.top = (touch.clientY - rect.height / 2) + 'px';
  $$('.slot-drop').forEach(slot => {
    const r = slot.getBoundingClientRect();
    const over = touch.clientX >= r.left && touch.clientX <= r.right && touch.clientY >= r.top && touch.clientY <= r.bottom;
    if (over) {
      const idx = parseInt(slot.id.split('-')[1]);
      const req = gameState.weapon.slots[idx].required;
      slot.classList.toggle('drag-over', touchDragData.pos === req);
      slot.classList.toggle('drag-over-invalid', touchDragData.pos !== req);
    } else {
      slot.classList.remove('drag-over', 'drag-over-invalid');
    }
  });
}

function handleTouchEnd(e) {
  if (!touchDragData) return;
  e.preventDefault();
  if (touchDragData.clone) {
    const touch = e.changedTouches[0];
    $$('.slot-drop').forEach(slot => {
      const r = slot.getBoundingClientRect();
      if (touch.clientX >= r.left && touch.clientX <= r.right && touch.clientY >= r.top && touch.clientY <= r.bottom) {
        handleDrop(touchDragData.cardId, parseInt(slot.id.split('-')[1]));
      }
    });
    touchDragData.clone.remove();
  }
  touchDragData.el.classList.remove('dragging');
  clearSlotHighlights();
  touchDragData = null;
}

// ---- Slot Highlights ----
function highlightValidSlots(pos) {
  gameState.weapon.slots.forEach((slot, i) => {
    if (slot.required === pos && !gameState.slots[i]) {
      $(`#slot-${i}`).classList.add('drag-over');
    }
  });
}

function clearSlotHighlights() {
  $$('.slot-drop').forEach(s => s.classList.remove('drag-over', 'drag-over-invalid'));
}

// ---- Drag & Drop + Click on Slots ----
function setupDragDrop() {
  $$('.slot-drop').forEach(slot => {
    slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('drag-over'); });
    slot.addEventListener('dragleave', () => { slot.classList.remove('drag-over', 'drag-over-invalid'); });
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over', 'drag-over-invalid');
      handleDrop(parseInt(e.dataTransfer.getData('text/plain')), parseInt(slot.id.split('-')[1]));
    });
    // Click-to-place
    slot.addEventListener('click', () => {
      if (selectedCardId === null || gameState.phase !== 'play') return;
      handleDrop(selectedCardId, parseInt(slot.id.split('-')[1]));
      selectedCardId = null;
      clearSlotHighlights();
    });
  });

  document.addEventListener('click', (e) => {
    if (selectedCardId !== null && !e.target.closest('.card') && !e.target.closest('.slot-drop')) {
      selectedCardId = null;
      renderHand();
      clearSlotHighlights();
    }
  });
}

function handleDrop(cardId, slotIdx) {
  const result = placeCard(gameState, cardId, slotIdx);
  if (result.success) {
    gameState = result.state;
    SFX.cardPlace();
    renderAll();
  } else {
    const slot = $(`#slot-${slotIdx}`);
    slot.classList.add('drag-over-invalid');
    setTimeout(() => slot.classList.remove('drag-over-invalid'), 500);
    SFX.misfire();
    gameState.stats.misfires++;
  }
}

// ---- Render Slots ----
function renderSlots() {
  gameState.slots.forEach((card, i) => {
    const slot = $(`#slot-${i}`);
    if (card) {
      slot.innerHTML = `<div class="slot-card" data-slot-index="${i}"><div class="card-word">${card.word}</div><div class="card-meta">${card.pos} · ${card.cefr}</div></div>`;
      slot.classList.add('filled');
      slot.querySelector('.slot-card').addEventListener('click', () => {
        gameState = removeCardFromSlot(gameState, i);
        SFX.cardReturn();
        renderAll();
      });
    } else {
      const req = gameState.weapon.slots[i].required;
      slot.innerHTML = `<span class="slot-placeholder">SELECT_${req.toUpperCase()}</span>`;
      slot.classList.remove('filled');
    }
  });
}

// ---- Render HP ----
function renderHP() {
  const p = gameState.player;
  const b = gameState.boss;
  const pPct = Math.max(0, (p.hp / p.maxHP) * 100);
  const bPct = Math.max(0, (b.hp / b.maxHP) * 100);

  const hpFill = $('#player-hp-fill');
  hpFill.style.width = pPct + '%';
  hpFill.classList.remove('mid', 'low');
  if (pPct <= 25) hpFill.classList.add('low');
  else if (pPct <= 50) hpFill.classList.add('mid');

  $('#player-hp-text').textContent = `${Math.max(0, p.hp)}/${p.maxHP}`;

  // Shield
  const shieldEl = $('#shield-display');
  if (p.shield > 0) {
    shieldEl.classList.remove('hidden');
    $('#shield-value').textContent = p.shield;
  } else {
    shieldEl.classList.add('hidden');
  }

  // Boss HP
  $('#boss-hp-fill').style.width = bPct + '%';
  $('#boss-hp-current').textContent = Math.max(0, b.hp).toLocaleString();
  $('#boss-hp-max').textContent = ` / ${b.maxHP} HP`;
}

function renderDeckInfo() {
  $('#deck-count').textContent = gameState.deck.length;
  $('#discard-count').textContent = gameState.discard.length;
}

function updateExecuteButton() {
  $('#btn-execute').disabled = !allSlotsFilled(gameState) || gameState.phase !== 'play';
}

function setupButtons() {
  $('#btn-execute').addEventListener('click', handleExecute);
  $('#btn-end-turn').addEventListener('click', handleEndTurn);
}

function updateBossIntent() {
  const turn = gameState.turn;
  const boss = gameState.boss.data;
  const el = $('#boss-intent');
  if (turn % boss.specialEvery === 0) {
    el.innerHTML = `<span style="color:var(--hp-red)">⚡ Charging ${boss.specialAttack.name}!</span>`;
  } else {
    const next = boss.specialEvery - (turn % boss.specialEvery);
    el.textContent = `Intends to strike · Special in ${next} turn${next > 1 ? 's' : ''}`;
  }
}

// ---- Execute Attack ----
async function handleExecute() {
  if (!allSlotsFilled(gameState) || gameState.phase !== 'play') return;
  gameState.phase = 'executing';
  updateExecuteButton();

  SFX.execute();
  VFX.executeFlash();

  const { state, results, totalDamage, sentence, reflected, phaseMessages } = executeAttack(gameState);
  gameState = state;

  addLog('player-action', `▸ "${sentence}"`);

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    await delay(350);

    if (r.reflected) {
      showDamageNumber(r.reflectedDamage, 'blocked', 'REFLECTED!');
      showPlayerDamageNumber(r.reflectedDamage);
      SFX.reflect();
      VFX.reflectHit();
      addLog('boss-action', `✖ "${r.card.word}" reflected! -${r.reflectedDamage} HP`);
      screenShake();
    } else {
      const isCharBonus = r.bonusType === 'character';
      showDamageNumber(r.damage, r.bonusType, `-${r.damage}`);

      if (isCharBonus) {
        SFX.historianProc();
        VFX.historianProc();
        SFX.attackCrit();
      } else {
        SFX.attackHit();
        VFX.attackHit();
      }

      $('#boss-sprite').classList.add('hit');
      setTimeout(() => $('#boss-sprite').classList.remove('hit'), 400);

      for (const b of r.bonuses) addLog('bonus', `  ${b}`);
      addLog('player-action', `  ${r.card.word} (${r.card.cefr}) → ${r.damage} dmg`);
    }
    renderHP();
  }

  if (totalDamage > 0) {
    await delay(200);
    addLog('player-action', `  Total: ${totalDamage} damage`);
  }

  for (const msg of phaseMessages || []) {
    await delay(300);
    SFX.bossPhaseTrigger();
    VFX.phaseChange();
    addLog('boss-action', `🦇 ${msg}`);
  }

  renderSlots();
  renderDeckInfo();

  if (gameState.phase === 'victory') {
    await delay(600);
    SFX.victory();
    VFX.victoryCelebration();
    onGameOver('victory');
    return;
  }

  await delay(700);
  await handleBossTurn();
}

// ---- Boss Turn ----
async function handleBossTurn() {
  gameState.phase = 'enemy';

  SFX.bossAttack();
  $('#boss-sprite').classList.add('attack');
  await delay(500);
  $('#boss-sprite').classList.remove('attack');

  const { state, damage, shieldAbsorbed, isSpecial, attackName } = bossTurn(gameState);
  gameState = state;

  VFX.bossAttackVFX();

  if (shieldAbsorbed > 0) {
    SFX.shieldBlock();
    VFX.shieldAbsorb();
    addLog('bonus', `  🛡 Shield absorbed ${shieldAbsorbed} damage`);
  }

  showPlayerDamageNumber(damage);
  addLog('boss-action', `🦇 ${attackName}${isSpecial ? ' ⚡' : ''}: -${damage} HP${shieldAbsorbed > 0 ? ` (${shieldAbsorbed} blocked)` : ''}`);

  if (damage > 0) screenShake();
  renderHP();

  if (gameState.phase === 'defeat') {
    await delay(600);
    SFX.defeat();
    onGameOver('defeat');
    return;
  }

  await delay(400);
  SFX.turnStart();
  gameState = endTurn(gameState);
  renderAll();
  updateBossIntent();
  addLog('system', `── Turn ${gameState.turn} ──`);
}

// ---- End Turn (skip) ----
async function handleEndTurn() {
  if (gameState.phase !== 'play') return;
  for (let i = 0; i < gameState.slots.length; i++) {
    if (gameState.slots[i]) gameState = removeCardFromSlot(gameState, i);
  }
  SFX.endTurn();
  addLog('system', '▸ Turn ended without attacking.');
  gameState.phase = 'enemy';
  await handleBossTurn();
}

// ---- Damage Numbers ----
function showDamageNumber(value, type, label) {
  const container = $('#damage-display');
  const el = document.createElement('div');
  el.className = `damage-number ${type}`;
  el.textContent = label || (value > 0 ? `-${value}` : 'MISS');
  el.style.left = `calc(50% + ${(Math.random() * 50 - 25)}px)`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

function showPlayerDamageNumber(value) {
  if (value <= 0) return;
  const panel = $('.player-panel');
  if (!panel) return;
  const el = document.createElement('div');
  el.className = 'damage-number boss-dmg';
  el.textContent = `-${value}`;
  el.style.position = 'absolute';
  el.style.left = '50%';
  el.style.top = '40%';
  el.style.zIndex = '100';
  panel.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

function screenShake() {
  const el = $('#combat-screen');
  el.classList.add('screen-shake');
  setTimeout(() => el.classList.remove('screen-shake'), 300);
}

function addLog(type, message) {
  const entries = $('#log-entries');
  const el = document.createElement('div');
  el.className = `log-entry ${type}`;
  el.textContent = message;
  entries.appendChild(el);
  entries.scrollTop = entries.scrollHeight;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

export function getStats() { return gameState ? gameState.stats : null; }
