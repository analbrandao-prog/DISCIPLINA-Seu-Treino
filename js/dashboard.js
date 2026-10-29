// =====================================================
// dashboard.js — Render dashboard section
// =====================================================

/**
 * Render or update the dashboard section with current state and streak.
 * @param {object} state
 * @param {{ current: number, record: number, status: string }} streak
 * @param {boolean} justCompleted
 */
function renderDashboard(state, streak, justCompleted = false) {
  const todayStr = today();
  const trainedToday = state.workoutLogs.some(l => l.date === todayStr);

  // Greeting
  const greeting = getTimeGreeting();
  const name = state.settings.userName ? `, ${state.settings.userName}` : '';
  document.getElementById('dashboard-greeting').textContent = `${greeting}${name}! 👋`;
  document.getElementById('dashboard-greeting-sub').textContent =
    trainedToday ? 'Treino concluído hoje. Você é imparável!' : 'Você vai continuar evoluindo hoje?';

  // Streak hero
  document.getElementById('streak-number').textContent = streak.current;
  document.getElementById('streak-label').textContent =
    streak.current === 1 ? 'DIA DE OFENSIVA' : 'DIAS DE OFENSIVA';

  const streakMsg = document.getElementById('streak-message');
  if (streak.current === 0) {
    streakMsg.textContent = 'Comece hoje e construa sua sequência!';
  } else if (streak.current >= 30) {
    streakMsg.textContent = 'Você é uma lenda da disciplina. Continue imparável!';
  } else if (streak.current >= 14) {
    streakMsg.textContent = 'Consistência de campeão. Não pare agora!';
  } else if (streak.current >= 7) {
    streakMsg.textContent = 'Uma semana de disciplina. Você já provou que consegue!';
  } else if (streak.current >= 3) {
    streakMsg.textContent = 'O hábito está se formando. Continue!';
  } else {
    streakMsg.textContent = 'Cada dia conta. Construa o hábito!';
  }

  // Risk badge
  const { text, cls } = getRiskBadgeInfo(streak.status, trainedToday);
  document.getElementById('risk-badge-container').innerHTML =
    `<div class="risk-badge ${cls}">${text}</div>`;

  // Motivational quote
  const quote = getSmartMotivationalQuote(streak, trainedToday, justCompleted);
  document.getElementById('motivational-quote').textContent = `"${quote}"`;

  // Stats
  document.getElementById('stat-streak').textContent = streak.current;
  document.getElementById('stat-record').textContent = streak.record;
  document.getElementById('stat-total').textContent = state.workoutLogs.length;
  const totalMinutes = state.workoutLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
  document.getElementById('stat-minutes').textContent = totalMinutes;

  // CTA Button
  const btnStart = document.getElementById('btn-start-workout');
  if (trainedToday) {
    btnStart.textContent = '✓ TREINO CONCLUÍDO HOJE';
    btnStart.classList.add('completed');
    btnStart.disabled = false; // still clickable to go to workouts page
    btnStart.title = 'Você já treinou hoje!';
  } else {
    btnStart.textContent = 'COMEÇAR MEU TREINO';
    btnStart.classList.remove('completed');
    btnStart.disabled = false;
    btnStart.title = '';
  }

  // Quick workout cards
  renderQuickWorkoutCards();
}

/**
 * Render the 4 quick workout cards on the dashboard.
 */
function renderQuickWorkoutCards() {
  const container = document.getElementById('quick-workout-cards');
  if (!container) return;

  container.innerHTML = WORKOUTS.map(w => `
    <div class="workout-card" style="--card-color:${w.color}" data-workout-id="${w.id}">
      <div class="workout-card-title">${w.emoji} ${w.title}</div>
      <div class="workout-card-duration">${w.subtitle}</div>
      <div class="workout-card-tag" style="background:${w.color}22;color:${w.color}">${w.difficulty}</div>
      <div class="workout-card-exercises">${w.exercises.length} exercícios</div>
    </div>
  `).join('');

  // Add click handlers
  container.querySelectorAll('.workout-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.workoutId;
      const workout = WORKOUTS.find(w => w.id === id);
      if (workout) {
        window.App && window.App.startWorkout(workout);
      }
    });
  });
}
