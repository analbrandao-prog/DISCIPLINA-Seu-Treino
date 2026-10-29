// =====================================================
// settingsView.js — Render workout list page
// Also handles workout list filter chips
// =====================================================

let _workoutFilter = 'all';

/**
 * Render the workout list section.
 * @param {boolean} lowImpact - Whether to highlight low impact option
 */
function renderWorkoutList(lowImpact = false) {
  // Filter chips
  document.querySelectorAll('#workout-filter-chips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === _workoutFilter);
    chip.onclick = () => {
      _workoutFilter = chip.dataset.filter;
      renderWorkoutList(lowImpact);
    };
  });

  let filtered = WORKOUTS;
  if (_workoutFilter !== 'all') {
    filtered = WORKOUTS.filter(w => w.id.includes(_workoutFilter));
  }

  const list = document.getElementById('workout-list');
  list.innerHTML = filtered.map((w, idx) => `
    <div class="workout-list-item" id="wlist-${w.id}">
      <div class="workout-list-header" onclick="toggleWorkoutItem('${w.id}')">
        <div class="workout-list-icon" style="background:${w.color}22;color:${w.color}">
          ${w.emoji}
        </div>
        <div class="workout-list-info">
          <div class="workout-list-title">${w.title}</div>
          <div class="workout-list-meta">
            <span>⏱ ${w.subtitle}</span>
            <span>💪 ${w.exercises.length} exercícios</span>
            <span style="color:${w.color}">${w.difficulty}</span>
          </div>
        </div>
        <div class="workout-list-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <div class="workout-list-body">
        <div class="exercise-list">
          ${w.exercises.map((ex, i) => `
            <div class="exercise-item">
              <div class="exercise-num">${i + 1}</div>
              <div class="exercise-info">
                <div class="exercise-name">${ex.name}</div>
                <div class="exercise-duration">⏱ ${ex.seconds}s${lowImpact && ex.lowImpactInstructions ? '' : ''}</div>
                ${lowImpact && ex.lowImpactInstructions
                  ? `<div class="exercise-alt">💡 ${ex.lowImpactInstructions}</div>`
                  : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="App.startWorkout(WORKOUTS.find(w=>w.id==='${w.id}'))">
            ▶ Iniciar Treino
          </button>
          <span style="font-size:0.82rem;color:var(--text-muted);align-self:center">
            Descanso: ${w.restSeconds}s entre exercícios
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Toggle expand/collapse of a workout list item.
 * @param {string} workoutId
 */
function toggleWorkoutItem(workoutId) {
  const item = document.getElementById(`wlist-${workoutId}`);
  if (!item) return;
  const isExpanded = item.classList.contains('expanded');

  // Collapse all
  document.querySelectorAll('.workout-list-item.expanded').forEach(el => {
    el.classList.remove('expanded');
  });

  // Expand clicked (if it wasn't already expanded)
  if (!isExpanded) {
    item.classList.add('expanded');
  }
}
