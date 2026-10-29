// =====================================================
// app.js — Main application controller
// =====================================================

'use strict';

// ---- App state (in-memory) ----
let _state = null;
let _streak = null;
let _currentPage = 'dashboard';
let _currentPlayer = null;

// ---- Achievement modal queue ----
let _achievementQueue = [];
let _achievementModalShowing = false;

// =====================================================
// App init
// =====================================================

function initApp() {
  _state = loadAppState();
  _streak = calculateStreak(_state.workoutLogs, _state.recordStreak);

  // Sync record
  if (_streak.record > _state.recordStreak) {
    _state.recordStreak = _streak.record;
    saveAppState(_state);
  }

  // Initial render
  renderDashboard(_state, _streak);
  renderWorkoutList(_state.settings.prefersLowImpact);
  renderSettings(_state);

  // Bind all events
  bindNavigation();
  bindDashboardEvents();
  bindModalEvents();
  bindSettingsEvents(AppRef);

  // Schedule reminder if active
  if (_state.settings.reminderEnabled && _state.settings.reminderTime) {
    requestNotificationPermission().then(perm => {
      if (perm === 'granted') {
        scheduleDailyReminder(_state.settings.reminderTime);
      }
    });
  }

  console.log('[DISCIPLINA] App initialized. Streak:', _streak);
}

// =====================================================
// Navigation
// =====================================================

function bindNavigation() {
  // All nav-item buttons (sidebar + bottom nav)
  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });
}

function navigateTo(page) {
  if (_currentPage === page) return;
  _currentPage = page;

  // Update active nav items
  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  // Show correct section
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // Lazy-render on navigation
  if (page === 'calendario') {
    renderCalendar(_state, _streak);
  } else if (page === 'conquistas') {
    renderAchievements(_state, _streak);
  } else if (page === 'estatisticas') {
    renderStats(_state, _streak);
  } else if (page === 'treinos') {
    renderWorkoutList(_state.settings.prefersLowImpact);
  } else if (page === 'configuracoes') {
    renderSettings(_state);
  }
}

// =====================================================
// Dashboard events
// =====================================================

function bindDashboardEvents() {
  // Main CTA button
  document.getElementById('btn-start-workout').addEventListener('click', () => {
    const todayStr = today();
    const trainedToday = _state.workoutLogs.some(l => l.date === todayStr);
    if (trainedToday) {
      // Show workout list
      navigateTo('treinos');
    } else {
      // Start the first (fastest) workout
      startWorkout(WORKOUTS[0]);
    }
  });

  // Quote refresh
  document.getElementById('quote-refresh-btn').addEventListener('click', () => {
    const todayStr = today();
    const trainedToday = _state.workoutLogs.some(l => l.date === todayStr);
    const quote = getSmartMotivationalQuote(_streak, trainedToday, false);
    document.getElementById('motivational-quote').textContent = `"${quote}"`;
  });
}

// =====================================================
// Modal events
// =====================================================

function bindModalEvents() {
  // Achievement modal close
  document.getElementById('ach-modal-close').addEventListener('click', () => {
    document.getElementById('achievement-modal').classList.remove('active');
    _achievementModalShowing = false;
    // Show next in queue
    setTimeout(showNextAchievementModal, 400);
  });

  // Day modal close
  document.getElementById('day-modal-close').addEventListener('click', () => {
    document.getElementById('day-modal').classList.remove('active');
  });

  // Close modals on overlay click
  document.getElementById('achievement-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('achievement-modal').classList.remove('active');
      _achievementModalShowing = false;
      setTimeout(showNextAchievementModal, 400);
    }
  });

  document.getElementById('day-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('day-modal').classList.remove('active');
    }
  });
}

// =====================================================
// Workout flow
// =====================================================

function startWorkout(workout) {
  if (_currentPlayer) {
    _currentPlayer.close();
    _currentPlayer = null;
  }

  _currentPlayer = new WorkoutPlayer(workout, {
    soundEnabled: _state.settings.soundEnabled,
    lowImpact: _state.settings.prefersLowImpact,
    onComplete: (result) => onWorkoutComplete(result)
  });

  _currentPlayer.open();
}

function onWorkoutComplete(result) {
  const now = new Date();
  const log = {
    id: `log-${Date.now()}`,
    workoutId: result.workoutId,
    workoutTitle: result.workoutTitle,
    completedAt: now.toISOString(),
    date: getLocalDateString(now),
    durationSeconds: result.durationSeconds,
    durationMinutes: result.durationMinutes,
    difficulty: result.difficulty,
    exercisesCompleted: result.exercisesCompleted,
    lowImpactUsed: result.lowImpactUsed
  };

  _state.workoutLogs.push(log);

  // Recalculate streak
  _streak = calculateStreak(_state.workoutLogs, _state.recordStreak);

  // Update record
  if (_streak.record > _state.recordStreak) {
    _state.recordStreak = _streak.record;
  }

  // Evaluate achievements
  const newlyUnlocked = evaluateAchievements(_state, _streak);
  if (newlyUnlocked.length > 0) {
    _state.unlockedAchievementIds = [
      ...new Set([..._state.unlockedAchievementIds, ...newlyUnlocked])
    ];
    _achievementQueue.push(...newlyUnlocked);
  }

  saveAppState(_state);

  // Re-render dashboard with "just completed" flag
  renderDashboard(_state, _streak, true);

  // Show achievement modals if any
  setTimeout(showNextAchievementModal, 600);

  showToast('🎉 Treino salvo com sucesso!', 'success');
}

// =====================================================
// Achievement modal
// =====================================================

function showNextAchievementModal() {
  if (_achievementModalShowing || _achievementQueue.length === 0) return;

  const id = _achievementQueue.shift();
  const ach = getAchievementById(id);
  if (!ach) return showNextAchievementModal();

  document.getElementById('ach-modal-icon').textContent = ach.icon;
  document.getElementById('ach-modal-name').textContent = ach.name;
  document.getElementById('ach-modal-desc').textContent = ach.description;
  document.getElementById('achievement-modal').classList.add('active');

  _achievementModalShowing = true;
}

// =====================================================
// AppRef — interface for settings view callbacks
// =====================================================

const AppRef = {
  getState: () => _state,

  updateSetting: (key, value) => {
    _state.settings[key] = value;
    saveAppState(_state);
  },

  refreshDashboard: () => {
    renderDashboard(_state, _streak, false);
  },

  replaceState: (newState) => {
    _state = { ...getDefaultState(), ...newState, settings: { ...getDefaultState().settings, ...(newState.settings || {}) } };
    _streak = calculateStreak(_state.workoutLogs, _state.recordStreak || 0);
    if (_streak.record > (_state.recordStreak || 0)) {
      _state.recordStreak = _streak.record;
    }
    saveAppState(_state);
    renderDashboard(_state, _streak);
    renderSettings(_state);
    renderWorkoutList(_state.settings.prefersLowImpact);
    if (_currentPage === 'calendario') renderCalendar(_state, _streak);
    if (_currentPage === 'conquistas') renderAchievements(_state, _streak);
    if (_currentPage === 'estatisticas') renderStats(_state, _streak);
    showToast('Dados importados!', 'success');
  },

  resetAll: () => {
    clearAllData();
    _state = loadAppState();
    _streak = calculateStreak(_state.workoutLogs, 0);
    renderDashboard(_state, _streak);
    renderSettings(_state);
    renderWorkoutList(_state.settings.prefersLowImpact);
    if (_currentPage === 'calendario') renderCalendar(_state, _streak);
    if (_currentPage === 'conquistas') renderAchievements(_state, _streak);
    if (_currentPage === 'estatisticas') renderStats(_state, _streak);
  },

  runSimulation: (simType) => {
    const todayStr = today();
    let datesToAdd = [];

    if (simType === '7') {
      for (let i = 6; i >= 0; i--) datesToAdd.push(addDays(todayStr, -i));
    } else if (simType === '14') {
      for (let i = 13; i >= 0; i--) datesToAdd.push(addDays(todayStr, -i));
    } else if (simType === '30') {
      for (let i = 29; i >= 0; i--) datesToAdd.push(addDays(todayStr, -i));
    } else if (simType === 'gap') {
      // Simula sequência com gap de 1 dia (em risco)
      for (let i = 10; i >= 2; i--) datesToAdd.push(addDays(todayStr, -i));
      // Skip yesterday — triggers at_risk
    }

    const existingDates = new Set(_state.workoutLogs.map(l => l.date));
    const workoutTemplates = WORKOUTS;

    datesToAdd.forEach((date, idx) => {
      if (existingDates.has(date)) return;
      const w = workoutTemplates[idx % workoutTemplates.length];
      const fakeTime = new Date(`${date}T${10 + (idx % 8)}:00:00`);
      _state.workoutLogs.push({
        id: `sim-${date}-${idx}`,
        workoutId: w.id,
        workoutTitle: w.title,
        completedAt: fakeTime.toISOString(),
        date: date,
        durationSeconds: w.durationSeconds,
        durationMinutes: w.duration,
        difficulty: w.difficulty,
        exercisesCompleted: w.exercises.length,
        lowImpactUsed: false
      });
    });

    _streak = calculateStreak(_state.workoutLogs, _state.recordStreak);
    if (_streak.record > _state.recordStreak) _state.recordStreak = _streak.record;

    const newlyUnlocked = evaluateAchievements(_state, _streak);
    if (newlyUnlocked.length > 0) {
      _state.unlockedAchievementIds = [...new Set([..._state.unlockedAchievementIds, ...newlyUnlocked])];
    }

    saveAppState(_state);
    renderDashboard(_state, _streak);
    if (_currentPage === 'calendario') renderCalendar(_state, _streak);
    if (_currentPage === 'conquistas') renderAchievements(_state, _streak);
    if (_currentPage === 'estatisticas') renderStats(_state, _streak);

    showToast(`✅ Simulação de ${simType} dias adicionada!`, 'success');
  }
};

// Expose startWorkout globally for workout card/list onclick
window.App = {
  startWorkout,
  navigateTo
};

// =====================================================
// Toast notifications
// =====================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

// =====================================================
// Default state helper (needed by AppRef.replaceState)
// =====================================================

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

// =====================================================
// Bootstrap
// =====================================================

document.addEventListener('DOMContentLoaded', initApp);
