// ========== UI RENDERING & INTERACTIONS ==========
import { CEFR_DAMAGE, CHARACTER } from './data.js';
import { placeCard, removeCardFromSlot, allSlotsFilled, executeAttack, bossTurn, endTurn } from './engine.js';

let gameState = null;
let onGameOver = null;
let selectedCardId = null; // For click-to-place mode

// ---- DOM References ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---- Initialize UI ----
export function initCombatUI(state, gameOverCallback) {
  gameState = state;
  onGameOver = gameOverCallback;
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
}

// ---- Render Hand ----
function renderHand() {
  const container = $('#hand-cards');
  container.innerHTML = '';

  for (const card of gameState.hand) {
    const el = createCardElement(card);
    container.appendChild(el);
  }
}

function createCardElement(card) {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.cardId = card.id;
  el.dataset.pos = card.pos;
  el.dataset.cefr = card.cefr;
  el.draggable = true;

  // Historian bonus highlight
  if (CHARACTER.passive.trigger(card)) {
    el.classList.add('historian-bonus');
  }

  const baseDmg = CEFR_DAMAGE[card.cefr] || 10;
  let dmgDisplay = baseDmg;
  if (CHARACTER.passive.trigger(card)) {
    dmgDisplay = Math.floor(baseDmg * CHARACTER.passive.damageMultiplier);
  }

  const tenseDisplay = card.tense ? `<div class="card-tense">${card.tense}</div>` : '';

  el.innerHTML = `
    <div class="card-pos-tag">${card.pos}</div>
    <div class="card-word">${card.word}</div>
    ${tenseDisplay}
    <div class="card-footer">
      <span class="card-cefr">${card.cefr}</span>
      <span class="card-dmg">⚔${dmgDisplay}</span>
    </div>
  `;

  // Drag events
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', card.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    el.classList.add('dragging');
    highlightValidSlots(card.pos);
  });

  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
    clearSlotHighlights();
  });

  // Touch support
  el.addEventListener('touchstart', handleTouchStart, { passive: false });
  el.addEventListener('touchmove', handleTouchMove, { passive: false });
  el.addEventListener('touchend', handleTouchEnd, { passive: false });

  // Click-to-select support
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    if (gameState.phase !== 'play') return;

    if (selectedCardId === card.id) {
      // Deselect
      selectedCardId = null;
      renderHand();
      clearSlotHighlights();
      return;
    }

    selectedCardId = card.id;
    renderHand();
    // Highlight matching slots
    highlightValidSlots(card.pos);
  });

  // Show selected state
  if (selectedCardId === card.id) {
    el.classList.add('selected');
  }

  return el;
}

// ---- Touch Drag Support ----
let touchDragData = null;

function handleTouchStart(e) {
  const card = gameState.hand.find(c => c.id === parseInt(e.currentTarget.dataset.cardId));
  if (!card) return;
  e.preventDefault();
  const touch = e.touches[0];
  touchDragData = {
    cardId: card.id,
    pos: card.pos,
    el: e.currentTarget,
    startX: touch.clientX,
    startY: touch.clientY,
    clone: null,
  };
  e.currentTarget.classList.add('dragging');
  highlightValidSlots(card.pos);
}

function handleTouchMove(e) {
  if (!touchDragData) return;
  e.preventDefault();
  const touch = e.touches[0];

  if (!touchDragData.clone) {
    touchDragData.clone = touchDragData.el.cloneNode(true);
    touchDragData.clone.style.position = 'fixed';
    touchDragData.clone.style.zIndex = '1000';
    touchDragData.clone.style.pointerEvents = 'none';
    touchDragData.clone.style.opacity = '0.8';
    touchDragData.clone.style.transform = 'scale(0.9)';
    document.body.appendChild(touchDragData.clone);
  }

  const rect = touchDragData.el.getBoundingClientRect();
  touchDragData.clone.style.left = (touch.clientX - rect.width / 2) + 'px';
  touchDragData.clone.style.top = (touch.clientY - rect.height / 2) + 'px';

  // Check if over a slot
  $$('.slot-drop').forEach(slot => {
    const r = slot.getBoundingClientRect();
    if (touch.clientX >= r.left && touch.clientX <= r.right &&
        touch.clientY >= r.top && touch.clientY <= r.bottom) {
      const slotIdx = parseInt(slot.id.split('-')[1]);
      const required = gameState.weapon.slots[slotIdx].required;
      slot.classList.toggle('drag-over', touchDragData.pos === required);
      slot.classList.toggle('drag-over-invalid', touchDragData.pos !== required);
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
      if (touch.clientX >= r.left && touch.clientX <= r.right &&
          touch.clientY >= r.top && touch.clientY <= r.bottom) {
        const slotIdx = parseInt(slot.id.split('-')[1]);
        handleDrop(touchDragData.cardId, slotIdx);
      }
    });
    touchDragData.clone.remove();
  }

  touchDragData.el.classList.remove('dragging');
  clearSlotHighlights();
  touchDragData = null;
}

// ---- Highlight Valid Slots ----
function highlightValidSlots(pos) {
  gameState.weapon.slots.forEach((slot, i) => {
    const el = $(`#slot-${i}`);
    if (slot.required === pos && !gameState.slots[i]) {
      el.classList.add('drag-over');
    }
  });
}

function clearSlotHighlights() {
  $$('.slot-drop').forEach(s => s.classList.remove('drag-over', 'drag-over-invalid'));
}

// ---- Setup Drag & Drop on Slots ----
function setupDragDrop() {
  $$('.slot-drop').forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over', 'drag-over-invalid');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over', 'drag-over-invalid');
      const cardId = parseInt(e.dataTransfer.getData('text/plain'));
      const slotIdx = parseInt(slot.id.split('-')[1]);
      handleDrop(cardId, slotIdx);
    });

    // Click-to-place: click empty slot when a card is selected
    slot.addEventListener('click', (e) => {
      if (selectedCardId === null || gameState.phase !== 'play') return;
      const slotIdx = parseInt(slot.id.split('-')[1]);
      handleDrop(selectedCardId, slotIdx);
      selectedCardId = null;
      clearSlotHighlights();
    });
  });

  // Click anywhere else to deselect
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
    renderAll();
  } else {
    // Misfire visual
    const slot = $(`#slot-${slotIdx}`);
    slot.classList.add('drag-over-invalid');
    setTimeout(() => slot.classList.remove('drag-over-invalid'), 500);
    gameState.stats.misfires++;
  }
}

// ---- Render Slots ----
function renderSlots() {
  gameState.slots.forEach((card, i) => {
    const slot = $(`#slot-${i}`);
    if (card) {
      slot.innerHTML = `
        <div class="slot-card" data-slot-index="${i}">
          <div class="card-word">${card.word}</div>
          <div class="card-meta">${card.pos} · ${card.cefr}</div>
        </div>
      `;
      slot.classList.add('filled');
      // Click to return card to hand
      slot.querySelector('.slot-card').addEventListener('click', () => {
        gameState = removeCardFromSlot(gameState, i);
        renderAll();
      });
    } else {
      slot.innerHTML = `<span class="slot-placeholder">Drag ${gameState.weapon.slots[i].required} here</span>`;
      slot.classList.remove('filled');
    }
  });
}

// ---- Render HP ----
function renderHP() {
  const p = gameState.player;
  const b = gameState.boss;

  const playerPercent = Math.max(0, (p.hp / p.maxHP) * 100);
  const bossPercent = Math.max(0, (b.hp / b.maxHP) * 100);

  $('#player-hp-fill').style.width = playerPercent + '%';
  $('#player-hp-text').textContent = `${Math.max(0, p.hp)}/${p.maxHP}${p.shield > 0 ? ` 🛡${p.shield}` : ''}`;

  $('#boss-hp-fill').style.width = bossPercent + '%';
  $('#boss-hp-text').textContent = `${Math.max(0, b.hp)}/${b.maxHP}`;

  // Color change at low HP
  if (playerPercent <= 25) {
    $('#player-hp-fill').style.background = 'linear-gradient(90deg, #dc2626, #ef4444)';
  } else if (playerPercent <= 50) {
    $('#player-hp-fill').style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
  } else {
    $('#player-hp-fill').style.background = 'linear-gradient(90deg, #22c55e, #4ade80)';
  }
}

// ---- Deck Info ----
function renderDeckInfo() {
  $('#deck-count').textContent = gameState.deck.length;
  $('#discard-count').textContent = gameState.discard.length;
}

// ---- Execute Button ----
function updateExecuteButton() {
  const btn = $('#btn-execute');
  btn.disabled = !allSlotsFilled(gameState) || gameState.phase !== 'play';
}

// ---- Setup Buttons ----
function setupButtons() {
  $('#btn-execute').addEventListener('click', handleExecute);
  $('#btn-end-turn').addEventListener('click', handleEndTurn);
}

// ---- Boss Intent ----
function updateBossIntent() {
  const turn = gameState.turn;
  const boss = gameState.boss.data;
  const el = $('#boss-intent');

  if (turn % boss.specialEvery === 0) {
    el.innerHTML = `<span style="color:var(--danger)">⚡ Charging ${boss.specialAttack.name}!</span>`;
  } else {
    const nextSpecial = boss.specialEvery - (turn % boss.specialEvery);
    el.textContent = `Intends to strike · Special in ${nextSpecial} turn${nextSpecial > 1 ? 's' : ''}`;
  }
}

// ---- Handle Execute ----
async function handleExecute() {
  if (!allSlotsFilled(gameState) || gameState.phase !== 'play') return;

  gameState.phase = 'executing';
  updateExecuteButton();

  const { state, results, totalDamage, sentence, reflected, phaseMessages } =
    executeAttack(gameState);
  gameState = state;

  // Log the sentence
  addLog('player-action', `▸ "${sentence}"`);

  // Animate results sequentially
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    await delay(300);

    if (r.reflected) {
      showDamageNumber(r.reflectedDamage, 'blocked', `REFLECTED!`);
      showPlayerDamageNumber(r.reflectedDamage);
      addLog('boss-action', `✖ "${r.card.word}" reflected! -${r.reflectedDamage} HP`);
      screenShake();
    } else {
      const label = r.damage > 0 ? `-${r.damage}` : '0';
      showDamageNumber(r.damage, r.bonusType, label);
      if (r.bonuses.length > 0) {
        for (const b of r.bonuses) addLog('bonus', `  ${b}`);
      }
      addLog('player-action', `  ${r.card.word} (${r.card.cefr}) → ${r.damage} dmg`);
      // Boss hit animation
      $('#boss-sprite').classList.add('hit');
      setTimeout(() => $('#boss-sprite').classList.remove('hit'), 400);
    }

    renderHP();
  }

  if (totalDamage > 0) {
    await delay(200);
    addLog('player-action', `  Total: ${totalDamage} damage`);
  }

  // Phase messages
  for (const msg of phaseMessages || []) {
    await delay(300);
    addLog('boss-action', `🦇 ${msg}`);
  }

  renderSlots();
  renderDeckInfo();

  // Check victory
  if (gameState.phase === 'victory') {
    await delay(600);
    onGameOver('victory');
    return;
  }

  // Boss turn
  await delay(800);
  await handleBossTurn();
}

// ---- Boss Turn ----
async function handleBossTurn() {
  gameState.phase = 'enemy';

  // Boss attack animation
  $('#boss-sprite').classList.add('attack');
  await delay(500);
  $('#boss-sprite').classList.remove('attack');

  const { state, damage, shieldAbsorbed, isSpecial, attackName } = bossTurn(gameState);
  gameState = state;

  if (shieldAbsorbed > 0) {
    addLog('bonus', `  🛡 Shield absorbed ${shieldAbsorbed} damage`);
  }

  showPlayerDamageNumber(damage);
  addLog('boss-action', `🦇 ${attackName}${isSpecial ? ' ⚡' : ''}: -${damage} HP${shieldAbsorbed > 0 ? ` (${shieldAbsorbed} blocked)` : ''}`);

  if (damage > 0) screenShake();

  renderHP();

  // Check defeat
  if (gameState.phase === 'defeat') {
    await delay(600);
    onGameOver('defeat');
    return;
  }

  // End turn
  await delay(400);
  gameState = endTurn(gameState);
  renderAll();
  updateBossIntent();
  addLog('system', `── Turn ${gameState.turn} ──`);
}

// ---- Handle End Turn (without attacking) ----
async function handleEndTurn() {
  if (gameState.phase !== 'play') return;

  // Return slotted cards to hand
  for (let i = 0; i < gameState.slots.length; i++) {
    if (gameState.slots[i]) {
      gameState = removeCardFromSlot(gameState, i);
    }
  }

  addLog('system', '▸ Turn ended without attacking.');

  gameState.phase = 'enemy';
  await handleBossTurn();
}

// ---- Damage Number Animation ----
function showDamageNumber(value, type, label) {
  const container = $('#damage-display');
  const el = document.createElement('div');
  el.className = `damage-number ${type}`;
  el.textContent = label || (value > 0 ? `-${value}` : 'MISS');
  el.style.left = `calc(50% + ${randOffset()}px)`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function showPlayerDamageNumber(value) {
  if (value <= 0) return;
  const el = document.createElement('div');
  el.className = 'damage-number boss-dmg';
  el.textContent = `-${value}`;
  el.style.position = 'fixed';
  el.style.left = '120px';
  el.style.top = '50px';
  el.style.zIndex = '100';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function randOffset() {
  return Math.floor(Math.random() * 60) - 30;
}

// ---- Screen Shake ----
function screenShake() {
  const el = $('#combat-screen');
  el.classList.add('screen-shake');
  setTimeout(() => el.classList.remove('screen-shake'), 300);
}

// ---- Combat Log ----
function addLog(type, message) {
  const entries = $('#log-entries');
  const el = document.createElement('div');
  el.className = `log-entry ${type}`;
  el.textContent = message;
  entries.appendChild(el);
  entries.scrollTop = entries.scrollHeight;
}

// ---- Utility ----
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Export for stats display ----
export function getStats() {
  return gameState ? gameState.stats : null;
}
