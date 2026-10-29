// =====================================================
// settingsView.js — Render and handle settings page
// =====================================================

let _notifTimer = null;

/**
 * Render the settings section, restoring values from state.
 * @param {object} state
 */
function renderSettings(state) {
  const s = state.settings;

  document.getElementById('input-user-name').value = s.userName || '';
  document.getElementById('toggle-reminder').checked = s.reminderEnabled;
  document.getElementById('input-reminder-time').value = s.reminderTime || '19:00';
  document.getElementById('toggle-sound').checked = s.soundEnabled !== false;
  document.getElementById('toggle-low-impact').checked = s.prefersLowImpact || false;

  // Show/hide time row
  document.getElementById('reminder-time-row').style.display =
    s.reminderEnabled ? 'flex' : 'none';

  // Notification status
  updateNotificationStatus();
}

/**
 * Update the notification permission status label.
 */
function updateNotificationStatus() {
  const el = document.getElementById('notification-status');
  if (!('Notification' in window)) {
    el.textContent = '⚠️ Este navegador não suporta notificações.';
    return;
  }
  const perm = Notification.permission;
  if (perm === 'granted') {
    el.textContent = '✅ Permissão concedida. Lembretes ativos.';
  } else if (perm === 'denied') {
    el.textContent = '❌ Notificações bloqueadas. Ative nas configurações do navegador.';
  } else {
    el.textContent = 'ℹ️ Permissão pendente. Ative o lembrete para solicitar autorização.';
  }
}

/**
 * Request notification permission.
 * @returns {Promise<string>}
 */
async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  const result = await Notification.requestPermission();
  return result;
}

/**
 * Schedule a daily notification using setInterval (in-tab only).
 * NOTE: Requires page to remain open. For reliable background notifications,
 * a service worker + Push API would be needed.
 * @param {string} time — "HH:MM"
 */
function scheduleDailyReminder(time) {
  clearDailyReminder();

  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const [targetH, targetM] = time.split(':').map(Number);

  function checkAndNotify() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();

    if (h === targetH && m === targetM) {
      new Notification('💪 DISCIPLINA — Hora de treinar!', {
        body: 'Não deixe sua sequência em risco. Um treino rápido te esperando!',
        icon: '/favicon.ico',
        tag: 'daily-reminder'
      });
    }
  }

  // Check every minute
  _notifTimer = setInterval(checkAndNotify, 60 * 1000);
  checkAndNotify();
}

/**
 * Clear any scheduled reminder.
 */
function clearDailyReminder() {
  if (_notifTimer) {
    clearInterval(_notifTimer);
    _notifTimer = null;
  }
}

/**
 * Bind settings event handlers. Call once on app init.
 * @param {object} appRef — reference to App for state access/mutation
 */
function bindSettingsEvents(appRef) {
  // Save name
  document.getElementById('btn-save-name').addEventListener('click', () => {
    const name = document.getElementById('input-user-name').value.trim();
    appRef.updateSetting('userName', name);
    showToast(`Nome salvo: ${name || '(sem nome)'}`, 'success');
    appRef.refreshDashboard();
  });

  // Reminder toggle
  document.getElementById('toggle-reminder').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    document.getElementById('reminder-time-row').style.display = enabled ? 'flex' : 'none';

    if (enabled) {
      const perm = await requestNotificationPermission();
      updateNotificationStatus();
      if (perm === 'granted') {
        const time = document.getElementById('input-reminder-time').value;
        appRef.updateSetting('reminderEnabled', true);
        scheduleDailyReminder(time);
        showToast('Lembrete ativado!', 'success');
      } else {
        // Revert toggle
        e.target.checked = false;
        document.getElementById('reminder-time-row').style.display = 'none';
        appRef.updateSetting('reminderEnabled', false);
        showToast('Permissão de notificação negada.', 'error');
      }
    } else {
      appRef.updateSetting('reminderEnabled', false);
      clearDailyReminder();
      showToast('Lembrete desativado.', 'success');
    }
  });

  // Reminder time
  document.getElementById('input-reminder-time').addEventListener('change', (e) => {
    appRef.updateSetting('reminderTime', e.target.value);
    if (appRef.getState().settings.reminderEnabled) {
      scheduleDailyReminder(e.target.value);
      showToast(`Horário atualizado para ${e.target.value}.`, 'success');
    }
  });

  // Sound toggle
  document.getElementById('toggle-sound').addEventListener('change', (e) => {
    appRef.updateSetting('soundEnabled', e.target.checked);
  });

  // Low impact toggle
  document.getElementById('toggle-low-impact').addEventListener('change', (e) => {
    appRef.updateSetting('prefersLowImpact', e.target.checked);
  });

  // Export
  document.getElementById('btn-export').addEventListener('click', () => {
    exportData(appRef.getState());
    showToast('Dados exportados com sucesso!', 'success');
  });

  // Import
  document.getElementById('btn-import-trigger').addEventListener('click', () => {
    document.getElementById('input-import-file').click();
  });

  document.getElementById('input-import-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = await importData(file);
      appRef.replaceState(imported);
      showToast('Dados importados com sucesso!', 'success');
    } catch (err) {
      showToast(`Erro ao importar: ${err.message}`, 'error');
    }
    e.target.value = '';
  });

  // Simulation buttons
  document.querySelectorAll('[data-sim]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sim = btn.dataset.sim;
      appRef.runSimulation(sim);
    });
  });

  // Reset
  document.getElementById('btn-reset-all').addEventListener('click', () => {
    if (!confirm('⚠️ Tem certeza? Todos os seus dados serão apagados permanentemente!')) return;
    if (!confirm('Esta ação é irreversível. Confirmar apagamento de todos os dados?')) return;
    appRef.resetAll();
    showToast('Todos os dados foram apagados.', 'success');
  });
}
