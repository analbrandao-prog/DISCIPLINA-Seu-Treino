// =====================================================
// storageService.js — localStorage persistence
// =====================================================

const STORAGE_KEY = 'disciplina_app_data_v1';

/**
 * Default state structure.
 */
function getDefaultState() {
  return {
    version: 1,
    settings: {
      userName: '',
      reminderEnabled: false,
      reminderTime: '19:00',
      soundEnabled: true,
      prefersLowImpact: false
    },
    workoutLogs: [],
    unlockedAchievementIds: [],
    recordStreak: 0
  };
}

/**
 * Load and return the app state from localStorage.
 * Returns default state if nothing is saved or parsing fails.
 * @returns {object}
 */
function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle missing keys from older versions
    const defaults = getDefaultState();
    return {
      ...defaults,
      ...parsed,
      settings: { ...defaults.settings, ...(parsed.settings || {}) }
    };
  } catch (e) {
    console.warn('[storageService] Failed to load state:', e);
    return getDefaultState();
  }
}

/**
 * Save the app state to localStorage.
 * @param {object} state
 */
function saveAppState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[storageService] Failed to save state:', e);
  }
}

/**
 * Clear all app data from localStorage.
 */
function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export state as a downloadable JSON file.
 * @param {object} state
 */
function exportData(state) {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `disciplina-backup-${getLocalDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import state from a JSON file. Returns parsed state or throws on error.
 * @param {File} file
 * @returns {Promise<object>}
 */
function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.version || !Array.isArray(parsed.workoutLogs)) {
          throw new Error('Arquivo inválido');
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
