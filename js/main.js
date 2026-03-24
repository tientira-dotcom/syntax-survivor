// ========== MAIN ENTRY POINT ==========
import { createGameState, drawCards } from './engine.js';
import { initCombatUI, getStats } from './ui.js';

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

// ---- Start Game ----
function startGame() {
  showScreen('combat-screen');

  const state = createGameState();
  drawCards(state);

  initCombatUI(state, handleGameOver);
}

// ---- Game Over ----
function handleGameOver(result) {
  const stats = getStats();

  if (result === 'victory') {
    showScreen('victory-screen');
    renderStats('victory-stats', stats);
  } else {
    showScreen('defeat-screen');
    renderStats('defeat-stats', stats);
  }
}

function renderStats(containerId, stats) {
  if (!stats) return;
  const container = document.getElementById(containerId);
  container.innerHTML = `
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
      <span class="stat-label">Past Tense</span>
      <span class="stat-value">${stats.pastTenseUsed}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Best Hit</span>
      <span class="stat-value">${stats.highestDamage}</span>
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

  document.getElementById('btn-start').addEventListener('click', startGame);
  document.getElementById('btn-restart-win').addEventListener('click', () => {
    showScreen('title-screen');
  });
  document.getElementById('btn-restart-lose').addEventListener('click', () => {
    showScreen('title-screen');
  });
});
