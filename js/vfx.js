// ========== VISUAL EFFECTS SYSTEM ==========

// ---- Particle System ----
function spawnParticles(container, count, config) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'vfx-particle';
    Object.assign(p.style, {
      position: 'absolute',
      left: (config.x || 50) + (Math.random() - 0.5) * (config.spread || 60) + '%',
      top: (config.y || 50) + (Math.random() - 0.5) * (config.spread || 60) + '%',
      width: (config.size || 6) + 'px',
      height: (config.size || 6) + 'px',
      borderRadius: config.shape === 'square' ? '2px' : '50%',
      background: config.color || '#ffd700',
      boxShadow: `0 0 ${config.glow || 8}px ${config.color || '#ffd700'}`,
      opacity: '0',
      pointerEvents: 'none',
      zIndex: '100',
      animation: `vfxFloat ${config.duration || 1.2}s ease-out forwards`,
      animationDelay: (Math.random() * (config.stagger || 0.3)) + 's',
    });
    container.appendChild(p);
    setTimeout(() => p.remove(), (config.duration || 1.2) * 1000 + 500);
  }
}

// ---- Rune Circle Effect (Historian) ----
function spawnRuneCircle(container) {
  const rune = document.createElement('div');
  rune.className = 'vfx-rune-circle';
  container.appendChild(rune);
  setTimeout(() => rune.remove(), 1500);
}

// ---- Ancient Text Effect (Historian) ----
function spawnAncientText(container, text) {
  const el = document.createElement('div');
  el.className = 'vfx-ancient-text';
  el.textContent = text;
  container.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

// ---- Impact Flash ----
function flashElement(el, color, duration = 300) {
  el.style.transition = 'filter 0.1s ease';
  el.style.filter = `brightness(3) drop-shadow(0 0 20px ${color})`;
  setTimeout(() => {
    el.style.filter = '';
  }, duration);
}

// ---- Screen Tint ----
function screenTint(color, duration = 400) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    background: color,
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '200',
    transition: `opacity ${duration / 4}ms ease`,
  });
  document.body.appendChild(overlay);
  requestAnimationFrame(() => { overlay.style.opacity = '0.15'; });
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), duration / 2);
  }, duration / 2);
}

// ========== EXPORTED EFFECT COMBOS ==========
export const VFX = {
  // Historian passive activation
  historianProc(bossArea) {
    const container = bossArea || document.querySelector('.boss-area');
    if (!container) return;
    // Golden rune circle
    spawnRuneCircle(container);
    // Golden particles
    spawnParticles(container, 12, {
      color: '#ffd700',
      glow: 12,
      size: 5,
      spread: 50,
      x: 50, y: 50,
      duration: 1.4,
    });
    // Ancient text
    const texts = ['𐤀𐤁𐤂', '✦ ANCIENT ✦', '⟁ KNOWLEDGE ⟁', '☽ PAST ☾'];
    spawnAncientText(container, texts[Math.floor(Math.random() * texts.length)]);
    // Golden screen tint
    screenTint('rgba(255, 215, 0, 0.3)', 500);
  },

  // Normal attack hit
  attackHit(bossArea) {
    const container = bossArea || document.querySelector('.boss-area');
    if (!container) return;
    spawnParticles(container, 8, {
      color: '#8b5cf6',
      glow: 10,
      size: 4,
      spread: 40,
      duration: 0.8,
    });
    const sprite = document.querySelector('.boss-sprite');
    if (sprite) flashElement(sprite, '#8b5cf6', 200);
  },

  // Critical/bonus attack
  critHit(bossArea) {
    const container = bossArea || document.querySelector('.boss-area');
    if (!container) return;
    spawnParticles(container, 18, {
      color: '#4ade80',
      glow: 15,
      size: 6,
      spread: 60,
      duration: 1.2,
    });
    screenTint('rgba(74, 222, 128, 0.2)', 300);
    const sprite = document.querySelector('.boss-sprite');
    if (sprite) flashElement(sprite, '#4ade80', 300);
  },

  // Damage reflected back
  reflectHit() {
    screenTint('rgba(239, 68, 68, 0.4)', 400);
    spawnParticles(document.querySelector('.player-panel') || document.body, 10, {
      color: '#ef4444',
      glow: 12,
      size: 5,
      spread: 40,
      duration: 1.0,
    });
  },

  // Boss attack on player
  bossAttackVFX() {
    screenTint('rgba(239, 68, 68, 0.25)', 350);
    const panel = document.querySelector('.player-panel');
    if (panel) {
      spawnParticles(panel, 6, {
        color: '#ef4444',
        glow: 10,
        size: 5,
        spread: 30,
        duration: 0.8,
      });
    }
  },

  // Shield absorb
  shieldAbsorb() {
    const panel = document.querySelector('.player-panel');
    if (panel) {
      spawnParticles(panel, 8, {
        color: '#38bdf8',
        glow: 10,
        size: 4,
        spread: 30,
        duration: 0.8,
      });
    }
    screenTint('rgba(56, 189, 248, 0.15)', 250);
  },

  // Execute button activation
  executeFlash() {
    screenTint('rgba(6, 182, 212, 0.2)', 300);
  },

  // Boss phase change
  phaseChange(bossArea) {
    const container = bossArea || document.querySelector('.boss-area');
    if (!container) return;
    spawnParticles(container, 20, {
      color: '#ef4444',
      glow: 15,
      size: 7,
      spread: 80,
      duration: 1.5,
      shape: 'square',
    });
    screenTint('rgba(239, 68, 68, 0.3)', 600);
  },

  // Victory celebration
  victoryCelebration() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnParticles(document.body, 15, {
          color: ['#ffd700', '#8b5cf6', '#4ade80', '#38bdf8', '#f472b6'][i],
          glow: 15,
          size: 6,
          spread: 100,
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          duration: 2,
        });
      }, i * 300);
    }
  },
};
