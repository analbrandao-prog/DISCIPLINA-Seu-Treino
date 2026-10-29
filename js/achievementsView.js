// =====================================================
// achievementsView.js — Render achievements page
// =====================================================

let _achievementFilter = 'all';

/**
 * Render the achievements grid.
 * @param {object} state
 * @param {{ current: number, record: number }} streak
 */
function renderAchievements(state, streak) {
  const unlockedSet = new Set(state.unlockedAchievementIds);

  // Filter chips
  document.querySelectorAll('#achievement-filter-chips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === _achievementFilter);
    chip.onclick = () => {
      _achievementFilter = chip.dataset.filter;
      renderAchievements(state, streak);
    };
  });

  let filtered = ACHIEVEMENTS_DEFINITIONS;
  if (_achievementFilter === 'unlocked') {
    filtered = filtered.filter(a => unlockedSet.has(a.id));
  } else if (_achievementFilter === 'locked') {
    filtered = filtered.filter(a => !unlockedSet.has(a.id));
  }

  const grid = document.getElementById('achievements-grid');

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="color:var(--text-muted);text-align:center;padding:40px;grid-column:1/-1">
      Nenhuma conquista encontrada nesta categoria.
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(ach => {
    const isUnlocked = unlockedSet.has(ach.id);
    return `
      <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${ach.name}</div>
          <div class="achievement-desc">${ach.description}</div>
          <span class="achievement-status ${isUnlocked ? 'unlocked' : 'locked'}">
            ${isUnlocked ? '✓ Conquistada' : '🔒 Bloqueada'}
          </span>
        </div>
      </div>
    `;
  }).join('');
}
