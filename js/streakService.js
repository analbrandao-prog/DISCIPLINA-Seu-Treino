// =====================================================
// streakService.js — Streak calculation logic
// =====================================================

/**
 * Status values for the streak risk indicator.
 * @typedef {'safe'|'warning_today'|'at_risk'|'broken'} StreakStatus
 */

/**
 * Calculate the current streak, record, and status from a list of workout logs.
 *
 * Rules:
 * - Multiple workouts on the same day count as 1 streak day.
 * - delta=0  (trained today): status = 'safe'
 * - delta=1  (trained yesterday): status = 'warning_today' (streak OK, train today to continue)
 * - delta=2  (1 day gap — e.g. Mon trained, Wed today, Tue missed): status = 'at_risk' (streak preserved IF they train today)
 * - delta>=3 (2+ days gap): status = 'broken', current streak = 0
 * - Record never resets.
 *
 * @param {Array<{date: string}>} workoutLogs - Array of workout log objects with a `date` field (YYYY-MM-DD)
 * @param {number} savedRecord - Previously saved record streak (in case logs were cleared)
 * @returns {{ current: number, record: number, status: StreakStatus, lastTrainedDate: string|null, trainedDates: string[] }}
 */
function calculateStreak(workoutLogs, savedRecord = 0) {
  // Build a sorted, deduplicated list of training dates
  const dateSet = new Set(workoutLogs.map(l => l.date));
  const sortedDates = Array.from(dateSet).sort();

  if (sortedDates.length === 0) {
    return {
      current: 0,
      record: savedRecord,
      status: 'broken',
      lastTrainedDate: null,
      trainedDates: []
    };
  }

  const todayStr = today();
  const lastDate = sortedDates[sortedDates.length - 1];
  const delta = diffInDays(lastDate, todayStr);

  // Calculate the current consecutive streak by walking backwards from lastDate
  let currentStreak = 1;
  for (let i = sortedDates.length - 2; i >= 0; i--) {
    const gap = diffInDays(sortedDates[i], sortedDates[i + 1]);
    if (gap === 1) {
      currentStreak++;
    } else {
      break; // gap > 1 means consecutive run is broken
    }
  }

  // Apply delta rule
  let streak;
  let status;

  if (delta === 0) {
    // Trained today — streak is the full consecutive run including today
    streak = currentStreak;
    status = 'safe';
  } else if (delta === 1) {
    // Trained yesterday — streak is maintained, pending today
    streak = currentStreak;
    status = 'warning_today';
  } else if (delta === 2) {
    // 1 gap day — at risk but preserved. If they train today, we add to streak.
    streak = currentStreak;
    status = 'at_risk';
  } else {
    // 2+ gap days — streak is broken
    streak = 0;
    status = 'broken';
  }

  const record = Math.max(streak, currentStreak, savedRecord);

  return {
    current: streak,
    record,
    status,
    lastTrainedDate: lastDate,
    trainedDates: sortedDates
  };
}
