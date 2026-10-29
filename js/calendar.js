// =====================================================
// calendar.js — Monthly calendar rendering
// =====================================================

let _calendarYear = null;
let _calendarMonth = null; // 1-indexed

/**
 * Initialize calendar to current month.
 */
function initCalendar() {
  const now = new Date();
  _calendarYear = now.getFullYear();
  _calendarMonth = now.getMonth() + 1;
}

/**
 * Render the calendar for the current _calendarYear/_calendarMonth.
 * @param {object} state
 * @param {{ trainedDates: string[], status: string, current: number }} streak
 */
function renderCalendar(state, streak) {
  if (!_calendarYear) initCalendar();

  const year = _calendarYear;
  const month = _calendarMonth;

  // Update label
  document.getElementById('calendar-month-label').textContent =
    getPtBrMonthName(year, month).charAt(0).toUpperCase() +
    getPtBrMonthName(year, month).slice(1);

  // Build sets of trained and missed dates
  const trainedSet = new Set(state.workoutLogs.map(l => l.date));
  const todayStr = today();

  // Days in this month
  const daysInMonth = new Date(year, month, 0).getDate();
  // Day of week the 1st falls on (0=Sunday)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const container = document.getElementById('calendar-days');
  container.innerHTML = '';

  // Empty cells before 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day empty';
    container.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isFuture = dateStr > todayStr;
    const isToday = dateStr === todayStr;
    const isTrained = trainedSet.has(dateStr);

    // Only mark as "missed" if past, not trained, and not today
    const isMissed = !isFuture && !isToday && !isTrained && dateStr >= getEarliestRelevantDate(state);

    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    if (isToday) cell.classList.add('today');
    if (isFuture) cell.classList.add('future');
    if (isTrained) cell.classList.add('trained');
    else if (isMissed) cell.classList.add('missed');
    cell.dataset.date = dateStr;

    const numEl = document.createElement('div');
    numEl.className = 'calendar-day-num';
    if (isTrained) numEl.classList.add('trained');
    else if (isMissed) numEl.classList.add('missed');
    numEl.textContent = d;

    const dot = document.createElement('div');
    dot.className = 'calendar-day-dot';

    cell.appendChild(numEl);
    cell.appendChild(dot);

    if (!isFuture) {
      cell.addEventListener('click', () => showDayModal(dateStr, state));
    }

    container.appendChild(cell);
  }

  // Bind nav buttons (re-bind each render to avoid duplicates)
  const prevBtn = document.getElementById('cal-prev-btn');
  const nextBtn = document.getElementById('cal-next-btn');

  const prevBtnNew = prevBtn.cloneNode(true);
  const nextBtnNew = nextBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(prevBtnNew, prevBtn);
  nextBtn.parentNode.replaceChild(nextBtnNew, nextBtn);

  prevBtnNew.addEventListener('click', () => {
    _calendarMonth--;
    if (_calendarMonth < 1) { _calendarMonth = 12; _calendarYear--; }
    renderCalendar(state, streak);
  });

  nextBtnNew.addEventListener('click', () => {
    const now = new Date();
    // Don't navigate past current month
    if (_calendarYear === now.getFullYear() && _calendarMonth >= now.getMonth() + 1) return;
    _calendarMonth++;
    if (_calendarMonth > 12) { _calendarMonth = 1; _calendarYear++; }
    renderCalendar(state, streak);
  });
}

/**
 * Get the earliest date from which we should mark days as missed.
 * We only mark days as missed if there has been at least one workout log.
 * @param {object} state
 * @returns {string}
 */
function getEarliestRelevantDate(state) {
  if (state.workoutLogs.length === 0) return '9999-12-31'; // nothing is missed
  const sorted = state.workoutLogs.map(l => l.date).sort();
  return sorted[0];
}

/**
 * Show day detail modal.
 * @param {string} dateStr
 * @param {object} state
 */
function showDayModal(dateStr, state) {
  const logs = state.workoutLogs.filter(l => l.date === dateStr);
  const modal = document.getElementById('day-modal');
  const title = document.getElementById('day-modal-title');
  const content = document.getElementById('day-modal-content');

  title.textContent = formatPtBrLong(dateStr);

  if (logs.length === 0) {
    content.innerHTML = `<p style="color:var(--text-muted)">Nenhum treino registrado neste dia.</p>`;
  } else {
    content.innerHTML = logs.map(l => `
      <div style="background:var(--bg-secondary);border-radius:var(--radius);padding:12px;margin-bottom:8px">
        <div style="font-weight:700;margin-bottom:4px">${l.workoutTitle}</div>
        <div style="font-size:0.82rem;color:var(--text-muted)">
          ⏱ ${l.durationMinutes} min &nbsp;|&nbsp; 
          🕐 ${formatTime(l.completedAt)} &nbsp;|&nbsp;
          ${l.lowImpactUsed ? '💡 Baixo impacto' : '💪 Impacto normal'}
        </div>
      </div>
    `).join('');
  }

  modal.classList.add('active');
}
