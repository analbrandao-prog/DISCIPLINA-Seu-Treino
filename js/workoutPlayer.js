// =====================================================
// workoutPlayer.js — Workout player with timer
// =====================================================

class WorkoutPlayer {
  constructor(workout, options = {}) {
    this.workout = workout;
    this.soundEnabled = options.soundEnabled !== false;
    this.lowImpact = options.lowImpact || false;
    this.onComplete = options.onComplete || (() => {});

    // State
    this.phase = 'countdown'; // countdown | exercise | rest | finished
    this.countdownValue = 5;
    this.exerciseIndex = 0;
    this.isRestPhase = false;
    this.isPaused = false;
    this.timeRemaining = 0;
    this.totalSecondsElapsed = 0;
    this.exercisesCompleted = 0;

    this._timer = null;
    this._countdownTimer = null;
    this._startedAt = null;

    // Timer ring circumference: r=88, C = 2πr ≈ 553
    this.ringCircumference = 2 * Math.PI * 88;

    this._bindElements();
    this._bindEvents();
  }

  _bindElements() {
    this.overlay = document.getElementById('workout-player-overlay');
    this.phaseCountdown = document.getElementById('player-phase-countdown');
    this.phaseExercise = document.getElementById('player-phase-exercise');
    this.phaseFinish = document.getElementById('player-phase-finish');

    this.countdownNumberEl = document.getElementById('countdown-number');
    this.phaseLabelEl = document.getElementById('player-phase-label');
    this.exerciseNameEl = document.getElementById('player-exercise-name');
    this.exerciseInstructionsEl = document.getElementById('player-exercise-instructions');
    this.exerciseAltEl = document.getElementById('player-exercise-alt');
    this.timerRingProgress = document.getElementById('timer-ring-progress');
    this.timerTimeEl = document.getElementById('timer-ring-time');
    this.timerPhaseEl = document.getElementById('timer-ring-phase');
    this.exerciseCounterEl = document.getElementById('player-exercise-counter');
    this.progressFill = document.getElementById('player-progress-fill');
    this.workoutTitleEl = document.getElementById('player-workout-title');

    this.pauseBtn = document.getElementById('player-pause-btn');
    this.prevBtn = document.getElementById('player-prev-btn');
    this.nextBtn = document.getElementById('player-next-btn');
    this.closeBtn = document.getElementById('player-close-btn');
    this.confirmBtn = document.getElementById('player-confirm-btn');
    this.discardBtn = document.getElementById('player-discard-btn');

    this.iconPause = document.getElementById('icon-pause');
    this.iconPlay = document.getElementById('icon-play');

    this.lowImpactToggle = document.getElementById('player-low-impact-toggle');
    this.soundToggle = document.getElementById('player-sound-toggle');
  }

  _bindEvents() {
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.prevBtn.addEventListener('click', () => this.skipPrev());
    this.nextBtn.addEventListener('click', () => this.skipNext());
    this.closeBtn.addEventListener('click', () => this.discard());
    this.discardBtn.addEventListener('click', () => this.discard());
    this.confirmBtn.addEventListener('click', () => this.confirm());

    this.lowImpactToggle.addEventListener('change', () => {
      this.lowImpact = this.lowImpactToggle.checked;
      this._updateExerciseDisplay();
    });

    this.soundToggle.addEventListener('change', () => {
      this.soundEnabled = this.soundToggle.checked;
    });
  }

  /**
   * Show overlay and start countdown
   */
  open() {
    // Set initial toggle states
    this.lowImpactToggle.checked = this.lowImpact;
    this.soundToggle.checked = this.soundEnabled;

    this.workoutTitleEl.textContent = this.workout.title;
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    this._showPhase('countdown');
    this._startCountdown();
  }

  /**
   * Close and clean up
   */
  close() {
    this._clearTimers();
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  discard() {
    if (this.phase !== 'finished') {
      if (!confirm('Deseja realmente abandonar o treino? O progresso não será salvo.')) return;
    }
    this.close();
  }

  confirm() {
    const durationSeconds = Math.round((Date.now() - this._startedAt) / 1000);
    const durationMinutes = Math.round(durationSeconds / 60) || this.workout.duration;
    this.close();
    this.onComplete({
      workoutId: this.workout.id,
      workoutTitle: this.workout.title,
      difficulty: this.workout.difficulty,
      durationSeconds,
      durationMinutes,
      exercisesCompleted: this.exercisesCompleted,
      lowImpactUsed: this.lowImpact
    });
  }

  _clearTimers() {
    clearInterval(this._timer);
    clearInterval(this._countdownTimer);
    this._timer = null;
    this._countdownTimer = null;
  }

  _showPhase(phase) {
    this.phaseCountdown.style.display = 'none';
    this.phaseExercise.style.display = 'none';
    this.phaseFinish.style.display = 'none';

    if (phase === 'countdown') this.phaseCountdown.style.display = 'block';
    if (phase === 'exercise' || phase === 'rest') this.phaseExercise.style.display = 'block';
    if (phase === 'finished') this.phaseFinish.style.display = 'block';
  }

  _startCountdown() {
    this._startedAt = Date.now();
    this.phase = 'countdown';
    this.countdownValue = 5;
    this.countdownNumberEl.textContent = this.countdownValue;

    this._countdownTimer = setInterval(() => {
      this.countdownValue--;
      if (this.soundEnabled) soundCountdown(this.countdownValue);

      if (this.countdownValue <= 0) {
        clearInterval(this._countdownTimer);
        this._startExercise(0);
      } else {
        this.countdownNumberEl.textContent = this.countdownValue;
      }
    }, 1000);
  }

  _startExercise(index) {
    this._clearTimers();
    this.exerciseIndex = index;
    this.isRestPhase = false;
    this.phase = 'exercise';

    const exercise = this.workout.exercises[index];
    this.timeRemaining = exercise.seconds;

    this._showPhase('exercise');
    this._updateExerciseDisplay();
    this._updateProgress();
    if (this.soundEnabled) soundGo();

    this._runTimer();
  }

  _startRest() {
    this._clearTimers();
    this.isRestPhase = true;
    this.phase = 'rest';

    this.timeRemaining = this.workout.restSeconds;
    this._showPhase('rest');

    this.phaseLabelEl.textContent = 'DESCANSO';
    this.exerciseNameEl.textContent = 'Descanse';
    this.exerciseInstructionsEl.textContent = 'Respire fundo. Próximo exercício em breve.';
    this.exerciseAltEl.style.display = 'none';

    // Ring color for rest
    this.timerRingProgress.classList.add('rest');
    this.timerPhaseEl.textContent = 'descanso';

    if (this.soundEnabled) soundRest();
    this._runTimer();
  }

  _updateExerciseDisplay() {
    if (this.isRestPhase) return;
    const exercise = this.workout.exercises[this.exerciseIndex];

    this.phaseLabelEl.textContent = 'EXERCÍCIO';
    this.exerciseNameEl.textContent = exercise.name;
    this.exerciseInstructionsEl.textContent = exercise.instructions;
    this.timerRingProgress.classList.remove('rest');
    this.timerPhaseEl.textContent = 'seg';

    if (this.lowImpact && exercise.lowImpactInstructions) {
      this.exerciseAltEl.textContent = `💡 Adaptação: ${exercise.lowImpactInstructions}`;
      this.exerciseAltEl.style.display = 'block';
    } else {
      this.exerciseAltEl.style.display = 'none';
    }
  }

  _updateProgress() {
    const total = this.workout.exercises.length;
    const current = this.exerciseIndex + 1;
    const pct = ((this.exerciseIndex) / total) * 100;

    this.exerciseCounterEl.textContent = `Exercício ${current} de ${total}`;
    this.progressFill.style.width = `${pct}%`;
  }

  _runTimer() {
    const totalSeconds = this.isRestPhase
      ? this.workout.restSeconds
      : this.workout.exercises[this.exerciseIndex].seconds;

    this._updateTimerDisplay(this.timeRemaining, totalSeconds);

    this._timer = setInterval(() => {
      if (this.isPaused) return;

      this.timeRemaining--;
      this.totalSecondsElapsed++;

      // Tick sound in last 3 seconds
      if (this.timeRemaining <= 3 && this.timeRemaining > 0 && this.soundEnabled) {
        soundTick();
      }

      this._updateTimerDisplay(this.timeRemaining, totalSeconds);

      if (this.timeRemaining <= 0) {
        clearInterval(this._timer);
        this._onPhaseComplete();
      }
    }, 1000);
  }

  _updateTimerDisplay(remaining, total) {
    this.timerTimeEl.textContent = remaining;

    // Update ring
    const progress = remaining / total;
    const offset = this.ringCircumference * (1 - progress);
    this.timerRingProgress.style.strokeDasharray = this.ringCircumference;
    this.timerRingProgress.style.strokeDashoffset = offset;
  }

  _onPhaseComplete() {
    if (this.isRestPhase) {
      // Rest done → next exercise
      const nextIndex = this.exerciseIndex + 1;
      if (nextIndex < this.workout.exercises.length) {
        this._startExercise(nextIndex);
      } else {
        this._finish();
      }
    } else {
      // Exercise done
      this.exercisesCompleted++;
      this._updateProgress();

      const nextIndex = this.exerciseIndex + 1;
      if (nextIndex < this.workout.exercises.length) {
        this._startRest();
      } else {
        this._finish();
      }
    }
  }

  _finish() {
    this._clearTimers();
    this.phase = 'finished';
    this._showPhase('finished');

    if (this.soundEnabled) soundFanfare();

    // Update finish stats
    const durationMinutes = Math.round((Date.now() - this._startedAt) / 60000) || this.workout.duration;
    document.getElementById('finish-duration').textContent = durationMinutes;
    document.getElementById('finish-exercises').textContent = this.exercisesCompleted;
    document.getElementById('finish-level').textContent = this.workout.difficulty;
    document.getElementById('finish-subtitle').textContent =
      this._getFinishMessage();

    // Update progress to 100%
    this.progressFill.style.width = '100%';

    // Launch confetti
    launchConfetti();
  }

  _getFinishMessage() {
    const msgs = [
      'Você arrasou hoje. Continue assim!',
      'Missão cumprida. Orgulhe-se disso.',
      'Mais um dia de disciplina na conta.',
      'Seu eu do futuro está agradecendo.',
      'Isso não foi sorte. Foi escolha!'
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.iconPause.style.display = 'none';
      this.iconPlay.style.display = 'block';
    } else {
      this.iconPause.style.display = 'block';
      this.iconPlay.style.display = 'none';
    }
  }

  skipNext() {
    this._clearTimers();
    if (this.isRestPhase) {
      const nextIndex = this.exerciseIndex + 1;
      if (nextIndex < this.workout.exercises.length) {
        this._startExercise(nextIndex);
      } else {
        this._finish();
      }
    } else {
      this.exercisesCompleted++;
      const nextIndex = this.exerciseIndex + 1;
      if (nextIndex < this.workout.exercises.length) {
        this._startRest();
      } else {
        this._finish();
      }
    }
  }

  skipPrev() {
    this._clearTimers();
    if (this.isRestPhase) {
      // Go back to current exercise
      this._startExercise(this.exerciseIndex);
    } else {
      const prevIndex = Math.max(0, this.exerciseIndex - 1);
      this._startExercise(prevIndex);
    }
  }
}

// ---- Confetti ----
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const particles = [];
  const colors = ['#ff2d75', '#f472b6', '#e879f9', '#fb7185', '#ffffff', '#fbbf24'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * W,
      y: -10 - Math.random() * 100,
      r: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      alpha: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }

  let frame;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    let alive = false;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.vy += 0.1; // gravity
      if (p.y < H + 20) alive = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, 1 - p.y / H);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    }

    if (alive) {
      frame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }

  animate();
  setTimeout(() => {
    cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);
  }, 5000);
}
