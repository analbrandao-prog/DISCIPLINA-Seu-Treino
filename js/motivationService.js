// =====================================================
// motivationService.js — Smart motivational quotes
// =====================================================

/**
 * Get a time-based greeting string.
 * @returns {string}
 */
function getTimeGreeting() {
  const h = getCurrentHour();
  if (h >= 5 && h < 12) return 'Bom dia';
  if (h >= 12 && h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Pick a quote from an array, trying to avoid the last used index.
 * @param {string[]} arr
 * @param {number} [lastIndex=-1]
 * @returns {{ quote: string, index: number }}
 */
function pickQuote(arr, lastIndex = -1) {
  if (arr.length === 0) return { quote: 'Continue evoluindo!', index: 0 };
  let idx;
  if (arr.length === 1) {
    idx = 0;
  } else {
    do {
      idx = Math.floor(Math.random() * arr.length);
    } while (idx === lastIndex);
  }
  return { quote: arr[idx], index: idx };
}

// Track last quote to avoid immediate repeats
let _lastQuoteKey = '';
let _lastQuoteIndex = -1;

/**
 * Get a contextually appropriate motivational quote.
 * @param {{ status: string, current: number }} streak
 * @param {boolean} trainedToday
 * @param {boolean} justCompleted
 * @returns {string}
 */
function getSmartMotivationalQuote(streak, trainedToday, justCompleted) {
  const h = getCurrentHour();
  let category;

  if (justCompleted) {
    category = 'concluido';
  } else if (streak.status === 'broken' && streak.current === 0 && (streak.lastTrainedDate !== null)) {
    category = 'recomeco';
  } else if (streak.status === 'at_risk') {
    category = 'urgente';
  } else if (streak.status === 'warning_today' && !trainedToday) {
    category = 'urgente';
  } else if (trainedToday) {
    category = streak.current >= 7 ? 'sequencia_longa' : 'concluido';
  } else if (streak.current >= 7) {
    category = 'sequencia_longa';
  } else if (h >= 5 && h < 10) {
    category = 'manha';
  } else if (h >= 20) {
    category = 'noite';
  } else if (!trainedToday) {
    category = Math.random() < 0.5 ? 'antipreguica' : 'lembrete_hoje';
  } else {
    category = 'antipreguica';
  }

  const pool = QUOTES[category] || QUOTES.antipreguica;
  const lastIdx = _lastQuoteKey === category ? _lastQuoteIndex : -1;
  const { quote, index } = pickQuote(pool, lastIdx);

  _lastQuoteKey = category;
  _lastQuoteIndex = index;

  return quote;
}

/**
 * Get risk badge text and CSS class for a given streak status.
 * @param {'safe'|'warning_today'|'at_risk'|'broken'} status
 * @param {boolean} trainedToday
 * @returns {{ text: string, cls: string }}
 */
function getRiskBadgeInfo(status, trainedToday) {
  if (trainedToday) {
    return { text: '✅ Sua ofensiva está segura. Continue assim!', cls: 'safe' };
  }
  switch (status) {
    case 'safe':
      return { text: '✅ Treino feito hoje. Ofensiva segura!', cls: 'safe' };
    case 'warning_today':
      return { text: '⚠️ Você ainda não treinou hoje. Não deixe sua sequência em risco!', cls: 'warning' };
    case 'at_risk':
      return { text: '🚨 Sua ofensiva está em risco! Faça um treino rápido para continuar evoluindo.', cls: 'danger' };
    case 'broken':
      return { text: '💔 Sua ofensiva foi quebrada. Não desista: hoje é o dia 1 de uma nova jornada.', cls: 'broken' };
    default:
      return { text: '🏁 Comece seu primeiro treino!', cls: 'broken' };
  }
}
