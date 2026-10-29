// =====================================================
// dateUtils.js — Date helper functions
// =====================================================

/**
 * Returns the local date string in YYYY-MM-DD format.
 * @param {Date} [date] - Defaults to now
 */
function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse a YYYY-MM-DD string as midnight local time to avoid UTC offset issues.
 * @param {string} dateStr
 * @returns {Date}
 */
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get the difference in calendar days between two YYYY-MM-DD strings.
 * Positive if b is after a.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function diffInDays(a, b) {
  const da = parseLocalDate(a);
  const db = parseLocalDate(b);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((db - da) / msPerDay);
}

/**
 * Add N days to a YYYY-MM-DD string and return the new YYYY-MM-DD string.
 * @param {string} dateStr
 * @param {number} n
 * @returns {string}
 */
function addDays(dateStr, n) {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + n);
  return getLocalDateString(d);
}

/**
 * Format a YYYY-MM-DD string in Brazilian Portuguese long form.
 * e.g. "29 de outubro de 2026"
 * @param {string} dateStr
 * @returns {string}
 */
function formatPtBrLong(dateStr) {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format a YYYY-MM-DD string in Brazilian Portuguese short form.
 * e.g. "29/10/2026"
 * @param {string} dateStr
 * @returns {string}
 */
function formatPtBrShort(dateStr) {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Format a Date or ISO string to time HH:MM.
 * @param {string|Date} dt
 * @returns {string}
 */
function formatTime(dt) {
  const d = typeof dt === 'string' ? new Date(dt) : dt;
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Return the month name in Portuguese for a given year/month (1-indexed).
 * @param {number} year
 * @param {number} month 1-indexed
 * @returns {string}
 */
function getPtBrMonthName(year, month) {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

/**
 * Get the current hour (0-23) in local time.
 * @returns {number}
 */
function getCurrentHour() {
  return new Date().getHours();
}

/**
 * Get today's date string in YYYY-MM-DD format.
 * @returns {string}
 */
function today() {
  return getLocalDateString();
}
