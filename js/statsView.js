// =====================================================
// statsView.js — Render statistics page
// =====================================================

/**
 * Render the statistics section.
 * @param {object} state
 * @param {{ current: number, record: number }} streak
 */
function renderStats(state, streak) {
  const logs = state.workoutLogs;
  const todayStr = today();

  const totalMinutes = logs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
  const totalWorkouts = logs.length;

  // Unique training dates
  const trainedDates = [...new Set(logs.map(l => l.date))];

  // Consistency calculations
  const last7Days = getLast7Days(todayStr);
  const last30Days = getLast30Days(todayStr);
  const trained7 = last7Days.filter(d => trainedDates.includes(d)).length;
  const trained30 = last30Days.filter(d => trainedDates.includes(d)).length;
  const pct7 = last7Days.length > 0 ? Math.round((trained7 / last7Days.length) * 100) : 0;
  const pct30 = last30Days.length > 0 ? Math.round((trained30 / last30Days.length) * 100) : 0;

  // KPI Grid
  const kpiData = [
    { value: streak.current, label: 'Ofensiva Atual' },
    { value: streak.record, label: 'Recorde de Ofensiva' },
    { value: totalWorkouts, label: 'Treinos Totais' },
    { value: trainedDates.length, label: 'Dias Treinados' },
    { value: totalMinutes, label: 'Minutos Totais' },
    { value: `${pct7}%`, label: 'Consistência 7d' }
  ];

  document.getElementById('kpi-grid').innerHTML = kpiData.map(k => `
    <div class="kpi-card">
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
    </div>
  `).join('');

  // Consistency bars
  document.getElementById('consistency-bars').innerHTML = `
    <div class="consistency-item">
      <div class="consistency-label">Últimos 7 dias</div>
      <div class="consistency-bar-wrap">
        <div class="consistency-bar-fill" style="width:${pct7}%"></div>
      </div>
      <div class="consistency-pct">${pct7}%</div>
    </div>
    <div class="consistency-item">
      <div class="consistency-label">Últimos 30 dias</div>
      <div class="consistency-bar-wrap">
        <div class="consistency-bar-fill" style="width:${pct30}%"></div>
      </div>
      <div class="consistency-pct">${pct30}%</div>
    </div>
  `;

  // Weekly chart — last 7 days, minutes per day
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const weekDays = last7Days;
  const maxMinutes = Math.max(...weekDays.map(d => {
    return logs.filter(l => l.date === d).reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
  }), 1);

  const chartEl = document.getElementById('weekly-chart');
  const labelsEl = document.getElementById('weekly-labels');

  chartEl.innerHTML = weekDays.map(d => {
    const mins = logs.filter(l => l.date === d).reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
    const heightPct = (mins / maxMinutes) * 100;
    const isToday = d === todayStr;
    return `
      <div class="weekly-bar-wrap">
        <div class="weekly-bar ${mins === 0 ? 'empty' : ''} ${isToday ? 'today' : ''}"
             style="height:${heightPct}%;min-height:${mins > 0 ? 8 : 4}px"
             title="${mins} min — ${formatPtBrShort(d)}"></div>
      </div>
    `;
  }).join('');

  labelsEl.innerHTML = weekDays.map(d => {
    const dObj = parseLocalDate(d);
    return `<div class="weekly-day-label">${dayNames[dObj.getDay()]}</div>`;
  }).join('');

  // History
  const historyEl = document.getElementById('history-list');
  const recentLogs = [...logs].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 10);

  if (recentLogs.length === 0) {
    historyEl.innerHTML = `<div style="color:var(--text-muted);text-align:center;padding:20px">
      Nenhum treino registrado ainda. Comece agora!
    </div>`;
    return;
  }

  historyEl.innerHTML = recentLogs.map(l => {
    const workout = WORKOUTS.find(w => w.id === l.workoutId);
    const emoji = workout ? workout.emoji : '💪';
    return `
      <div class="history-item">
        <div class="history-item-icon">${emoji}</div>
        <div class="history-item-info">
          <div class="history-item-title">${l.workoutTitle}</div>
          <div class="history-item-meta">${formatPtBrShort(l.date)} às ${formatTime(l.completedAt)}</div>
        </div>
        <div class="history-item-time">${l.durationMinutes} min</div>
      </div>
    `;
  }).join('');
}

function getLast7Days(todayStr) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(addDays(todayStr, -i));
  }
  return days;
}

function getLast30Days(todayStr) {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    days.push(addDays(todayStr, -i));
  }
  return days;
}
