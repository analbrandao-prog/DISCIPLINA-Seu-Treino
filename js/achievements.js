// =====================================================
// achievements.js — Achievement evaluation
// =====================================================

/**
 * Evaluate which achievements should be unlocked given the current state and streak.
 * Returns newly unlocked achievement IDs.
 *
 * @param {object} state - App state
 * @param {{ current: number, record: number }} streak
 * @returns {string[]} newly unlocked IDs
 */
function evaluateAchievements(state, streak) {
  const alreadyUnlocked = new Set(state.unlockedAchievementIds);
  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS_DEFINITIONS) {
    if (alreadyUnlocked.has(ach.id)) continue;
    try {
      if (ach.check(state, streak)) {
        newlyUnlocked.push(ach.id);
      }
    } catch (e) {
      // ignore evaluation errors
    }
  }

  return newlyUnlocked;
}

/**
 * Get achievement definition by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
function getAchievementById(id) {
  return ACHIEVEMENTS_DEFINITIONS.find(a => a.id === id);
}
