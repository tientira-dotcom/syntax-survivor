// ========== MAIN ENTRY POINT ==========
import { createGameState, drawCards, progressToNextBoss, pickItem } from './engine.js';
import { initCombatUI, getStats, getState, renderWeaponSelect, renderLootScreen } from './ui.js';
import { getRandomItems } from './data.js';

// ---- Screen Management ----
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// ---- Title Screen Particles ----
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'p';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 4 + 's';
    p.style.animationDuration = (3 + Math.random() * 3) + 's';
    container.appendChild(p);
  }
}

// ---- Game State ----
let state = null;

// ---- Start: go to weapon select ----
function startRun() {
  showScreen('weapon-screen');
  renderWeaponSelect(onWeaponSelected);
}

// ---- Weapon selected → start combat ----
function onWeaponSelected(weaponId) {
  state = createGameState(weaponId, 1);
  drawCards(state);
  showScreen('combat-screen');
  initCombatUI(state, handleBossVictory, handleDefeat);
}

// ---- Boss defeated → loot screen ----
function handleBossVictory() {
  const currentState = getState();
  state = currentState;

  const ownedIds = state.items.map(i => i.id);
  const lootOptions = getRandomItems(3, ownedIds);

  document.getElementById('loot-subtitle').textContent =
    `You defeated ${state.boss.data.name}! Pick one relic to carry forward.`;

  showScreen('loot-screen');
  renderLootScreen(lootOptions, onLootPicked);

  // Skip button
  const skipBtn = document.getElementById('btn-skip-loot');
  const newSkip = skipBtn.cloneNode(true);
  skipBtn.parentNode.replaceChild(newSkip, skipBtn);
  newSkip.addEventListener('click', () => advanceToNextBoss());
}

function onLootPicked(itemId) {
  state = pickItem(state, itemId);
  advanceToNextBoss();
}

function advanceToNextBoss() {
  state = progressToNextBoss(state);
  drawCards(state);
  showScreen('combat-screen');
  initCombatUI(state, handleBossVictory, handleDefeat);
}

// ---- Defeat ----
function handleDefeat() {
  const stats = getStats();
  showScreen('defeat-screen');
  renderStats('defeat-stats', stats);
}

function renderStats(containerId, stats) {
  if (!stats) return;
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="stat-card">
      <span class="stat-label">Bosses Slain</span>
      <span class="stat-value">${stats.bossesDefeated}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Total Damage</span>
      <span class="stat-value">${stats.totalDamage}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Turns</span>
      <span class="stat-value">${stats.turnsPlayed}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Words Used</span>
      <span class="stat-value">${stats.wordsUsed}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Relics</span>
      <span class="stat-value">${stats.itemsCollected}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Best Hit</span>
      <span class="stat-value">${stats.highestDamage}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Past Tense</span>
      <span class="stat-value">${stats.pastTenseUsed}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Misfires</span>
      <span class="stat-value">${stats.misfires}</span>
    </div>
  `;
}

// ---- Event Listeners ----
document.addEventListener('DOMContentLoaded', () => {
  createParticles();

  document.getElementById('btn-start').addEventListener('click', startRun);
  document.getElementById('btn-restart-lose').addEventListener('click', () => {
    showScreen('title-screen');
  });
});
