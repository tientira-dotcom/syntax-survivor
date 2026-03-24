// ========== UI RENDERING & INTERACTIONS ==========
import { CEFR_DAMAGE, CHARACTER, WEAPONS } from './data.js';
import { placeCard, removeCardFromSlot, allSlotsFilled, executeAttack, bossTurn, endTurn } from './engine.js';
import { SFX } from './sound.js';
import { VFX } from './vfx.js';

let gameState = null;
let onGameOver = null;
let onBossVictory = null;
let selectedCardId = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---- Initialize UI ----
export function initCombatUI(state, bossVictoryCallback, gameOverCallback) {
  gameState = state;
  onBossVictory = bossVictoryCallback;
  onGameOver = gameOverCallback;
  selectedCardId = null;

  // Clear log
  $('#log-entries').innerHTML = '';

  renderBossInfo();
  renderWeaponInfo();
  renderSlots();
  renderAll();
  setupDragDrop();
  setupButtons();

  addLog('system', `⚔ Boss ${state.bossNumber}: ${state.boss.data.name}`);
  for (const affix of state.boss.data.affixes) {
    addLog('system', `⚠ ${affix.icon} ${affix.name}: ${affix.description}`);
  }
  updateBossIntent();
}

// ---- Render boss info into the DOM ----
function renderBossInfo() {
  $('#boss-sprite').textContent = gameState.boss.data.icon;
  $('#boss-name').textContent = gameState.boss.data.name;
  $('#boss-type').textContent = gameState.boss.data.type;
  $('#run-info-text').textContent = `BOSS_${gameState.bossNumber}`;

  // Render affixes
  const affixContainer = $('#boss-affixes');
  affixContainer.innerHTML = '';
  for (const affix of gameState.boss.data.affixes) {
    let desc = affix.description;
    // Resolve templates
    if (affix.type === 'posShield') {
      const blockedPOS = affix.posTypes[(gameState.turn - 1) % affix.posTypes.length];
      desc = desc.replace('{pos}', blockedPOS);
    }
    if (affix.type === 'tenseLock') {
      const lockIndex = Math.floor((gameState.turn - 1) / 2) % affix.tenses.length;
      desc = desc.replace('{tense}', affix.tenses[lockIndex]);
    }
    const el = document.createElement('div');
    el.className = 'boss-affix';
    el.innerHTML = `<span class="affix-icon">${affix.icon}</span><span class="affix-text"><strong>${affix.name}</strong> — ${desc}</span>`;
    affixContainer.appendChild(el);
  }
}

function renderWeaponInfo() {
  $('#weapon-icon').textContent = gameState.weapon.icon;
  $('#weapon-name').textContent = gameState.weapon.name.toUpperCase();
  $('#weapon-type').textContent = gameState.weapon.type;

  // Build slots HTML dynamically
  const slotsContainer = $('#weapon-slots');
  slotsContainer.innerHTML = '';
  gameState.weapon.slots.forEach((slot, i) => {
    if (i > 0) {
      const conn = document.createElement('div');
      conn.className = 'slot-connector';
      conn.textContent = '+';
      slotsContainer.appendChild(conn);
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'weapon-slot';
    wrapper.dataset.required = slot.required;
    wrapper.innerHTML = `
      <div class="slot-label">${slot.label}</div>
      <div class="slot-drop" id="slot-${i}">
        <span class="slot-placeholder">SELECT_${slot.required.toUpperCase()}</span>
      </div>
    `;
    slotsContainer.appendChild(wrapper);
  });
}

// ---- Render items inventory ----
function renderItems() {
  const container = $('#inventory-items');
  if (!container) return;
  container.innerHTML = '';
  if (gameState.items.length === 0) {
    container.innerHTML = '<div class="inv-empty">No relics yet</div>';
    return;
  }
  for (const item of gameState.items) {
    const el = document.createElement('div');
    el.className = `inv-item rarity-${item.rarity}`;
    el.title = `${item.name}: ${item.description}`;
    el.textContent = item.icon;
    container.appendChild(el);
  }
}

// ---- Full Render ----
function renderAll() {
  renderHand();
  renderSlots();
  renderHP();
  renderDeckInfo();
  renderItems();
  renderAffixes();
  updateExecuteButton();
  $('#turn-number').textContent = gameState.turn;
  $('#hand-count').textContent = gameState.hand.length;
}

function renderAffixes() {
  const affixContainer = $('#boss-affixes');
  affixContainer.innerHTML = '';
  for (const affix of gameState.boss.data.affixes) {
    let desc = affix.description;
    if (affix.type === 'posShield') {
      const blockedPOS = affix.posTypes[(gameState.turn - 1) % affix.posTypes.length];
      desc = desc.replace('{pos}', blockedPOS.toUpperCase());
    }
    if (affix.type === 'tenseLock') {
      const lockIndex = Math.floor((gameState.turn - 1) / 2) % affix.tenses.length;
      desc = desc.replace('{tense}', affix.tenses[lockIndex].toUpperCase());
    }
    const el = document.createElement('div');
    el.className = 'boss-affix';
    el.innerHTML = `<span class="affix-icon">${affix.icon}</span><span class="affix-text"><strong>${affix.name}</strong> — ${desc}</span>`;
    affixContainer.appendChild(el);
  }
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
  let dmgDisplay = isHistorianBonus ? Math.floor(baseDmg * CHARACTER.passive.damageMultiplier) : baseDmg;
  // Apply weapon multiplier to display
  if (gameState.weapon.damageMultiplier !== 1.0) {
    dmgDisplay = Math.floor(dmgDisplay * gameState.weapon.damageMultiplier);
  }

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
    if (!slot) return;
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

  const shieldEl = $('#shield-display');
  if (p.shield > 0) {
    shieldEl.classList.remove('hidden');
    $('#shield-value').textContent = p.shield;
  } else {
    shieldEl.classList.add('hidden');
  }

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
  // Remove old listeners by cloning
  const execBtn = $('#btn-execute');
  const newExec = execBtn.cloneNode(true);
  execBtn.parentNode.replaceChild(newExec, execBtn);
  newExec.addEventListener('click', handleExecute);

  const endBtn = $('#btn-end-turn');
  const newEnd = endBtn.cloneNode(true);
  endBtn.parentNode.replaceChild(newEnd, endBtn);
  newEnd.addEventListener('click', handleEndTurn);
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

    if (!r.card) {
      // Bonus-only result (weapon shield, item proc, etc.)
      for (const b of r.bonuses) addLog('bonus', `  ${b}`);
      continue;
    }

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
    if (onBossVictory) onBossVictory();
    return;
  }

  await delay(700);
  await handleBossTurn();
}

// ---- Boss Turn ----
async function handleBossTurn() {
  gameState.phase = 'enemy';

  const { state, damage, shieldAbsorbed, isSpecial, attackName, stunned } = bossTurn(gameState);
  gameState = state;

  if (stunned) {
    addLog('boss-action', `🦇 ${gameState.boss.data.name} is STUNNED! Skips attack.`);
    await delay(600);
    SFX.turnStart();
    gameState = endTurn(gameState);
    renderAll();
    updateBossIntent();
    addLog('system', `── Turn ${gameState.turn} ──`);
    return;
  }

  SFX.bossAttack();
  $('#boss-sprite').classList.add('attack');
  await delay(500);
  $('#boss-sprite').classList.remove('attack');

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
    if (onGameOver) onGameOver();
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
export function getState() { return gameState; }

// ========== WEAPON SELECT SCREEN ==========
export function renderWeaponSelect(onSelect) {
  const grid = $('#weapon-grid');
  grid.innerHTML = '';

  for (const weapon of WEAPONS) {
    const card = document.createElement('div');
    card.className = 'weapon-card';
    card.innerHTML = `
      <div class="weapon-card-icon">${weapon.icon}</div>
      <div class="weapon-card-name">${weapon.name}</div>
      <div class="weapon-card-type">${weapon.type}</div>
      <div class="weapon-card-slots">
        ${weapon.slots.map(s => `<span class="weapon-slot-tag" data-pos="${s.required}">${s.label}</span>`).join(' + ')}
      </div>
      <div class="weapon-card-desc">${weapon.description}</div>
      <div class="weapon-card-mult">x${weapon.damageMultiplier} DMG</div>
    `;
    card.addEventListener('click', () => onSelect(weapon.id));
    grid.appendChild(card);
  }
}

// ========== LOOT SCREEN ==========
export function renderLootScreen(items, onPick) {
  const grid = $('#loot-grid');
  grid.innerHTML = '';

  for (const item of items) {
    const card = document.createElement('div');
    card.className = `loot-card rarity-${item.rarity}`;
    card.innerHTML = `
      <div class="loot-rarity">${item.rarity.toUpperCase()}</div>
      <div class="loot-icon">${item.icon}</div>
      <div class="loot-name">${item.name}</div>
      <div class="loot-desc">${item.description}</div>
    `;
    card.addEventListener('click', () => onPick(item.id));
    grid.appendChild(card);
  }
}
