const STORAGE_KEYS = {
  streak: "forgefit_streak",
  history: "forgefit_history",
  lastWorkout: "forgefit_last_workout",
};

const exercises = [
  {
    id: "bench-press",
    name: "Bench Press",
    category: "Chest",
    difficulty: "Intermediate",
    sets: 3,
    reps: 12,
    duration: 45,
    description: "Powerful compound press for chest strength and control.",
    instructions: [
      "Plant your feet firmly and brace your core.",
      "Lower the bar slowly to your mid-chest.",
      "Push explosively while keeping your shoulder blades tucked.",
      "Pause briefly at the top before the next rep."
    ]
  },
  {
    id: "pull-up",
    name: "Pull Up",
    category: "Back",
    difficulty: "Advanced",
    sets: 3,
    reps: 10,
    duration: 40,
    description: "Build upper-back strength and stronger pulls.",
    instructions: [
      "Grip the bar with hands slightly wider than shoulder width.",
      "Engage your lats and pull your chest toward the bar.",
      "Keep your core tight and avoid swinging.",
      "Lower slowly under control."
    ]
  },
  {
    id: "squat",
    name: "Squat",
    category: "Legs",
    difficulty: "Intermediate",
    sets: 4,
    reps: 12,
    duration: 50,
    description: "Full lower-body strength movement for power and control.",
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Drive through your heels as you sit back and down.",
      "Keep knees tracking over toes.",
      "Stand tall and squeeze glutes at the top."
    ]
  },
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    category: "Arms",
    difficulty: "Beginner",
    sets: 3,
    reps: 12,
    duration: 30,
    description: "Target the biceps with controlled tempo.",
    instructions: [
      "Hold dumbbells with palms facing forward.",
      "Keep elbows pinned to your sides.",
      "Curl upward without swinging.",
      "Lower slowly for a full range of motion."
    ]
  },
  {
    id: "crunch",
    name: "Crunch",
    category: "Abs",
    difficulty: "Beginner",
    sets: 3,
    reps: 15,
    duration: 25,
    description: "Core-focused movement for definition and stability.",
    instructions: [
      "Lay on your back with knees bent.",
      "Lift your shoulders slightly off the floor.",
      "Keep the movement slow and controlled.",
      "Exhale on the way up."
    ]
  },
  {
    id: "burpees",
    name: "Burpees",
    category: "Cardio/HIIT",
    difficulty: "Advanced",
    sets: 4,
    reps: 12,
    duration: 35,
    description: "Explosive cardio blast that builds stamina and power.",
    instructions: [
      "Drop into a squat position and place your hands on the floor.",
      "Kick your feet back into a plank.",
      "Perform a push-up if comfortable, then jump up.",
      "Land softly and immediately continue the next rep."
    ]
  }
];

const appState = {
  selectedCategory: "Chest",
  selectedExercise: exercises[0],
  currentSet: 1,
  currentReps: 0,
  workoutSeconds: 0,
  timerSeconds: 45,
  timerMode: "exercise",
  isRunning: false,
  stopwatchSeconds: 0,
  timerInterval: null,
  stopwatchInterval: null,
  streak: 0,
  history: [],
  currentStep: 0,
};

function loadState() {
  const streakValue = Number(localStorage.getItem(STORAGE_KEYS.streak) || 0);
  const historyValue = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || "[]");
  appState.streak = streakValue;
  appState.history = historyValue;
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.streak, String(appState.streak));
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(appState.history));
}

function getCategoryExercises(category) {
  return exercises.filter((exercise) => exercise.category === category);
}

function updateStreakBadge() {
  const badge = document.getElementById("streakBadge");
  badge.textContent = `${appState.streak} day${appState.streak === 1 ? "" : "s"}`;
}

function renderCategories() {
  const categoryList = document.getElementById("categoryList");
  const categories = [...new Set(exercises.map((ex) => ex.category))];

  categoryList.innerHTML = categories
    .map((category) => {
      const isActive = appState.selectedCategory === category;
      return `
        <button
          data-category="${category}"
          class="category-btn w-full rounded-2xl border px-4 py-3 text-left ${isActive ? "border-orange-500 bg-orange-500/10 text-orange-200" : "border-white/5 bg-slate-800 text-slate-300"}"
        >
          <div class="flex items-center justify-between">
            <span class="font-semibold">${category}</span>
            <span class="rounded-full bg-white/5 px-2 py-1 text-xs">${getCategoryExercises(category).length}</span>
          </div>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.selectedCategory = btn.dataset.category;
      appState.selectedExercise = getCategoryExercises(appState.selectedCategory)[0];
      renderAll();
    });
  });
}

function renderExerciseGrid() {
  const grid = document.getElementById("exerciseGrid");
  const filtered = getCategoryExercises(appState.selectedCategory);

  grid.innerHTML = filtered
    .map((exercise) => {
      const isSelected = appState.selectedExercise.id === exercise.id;
      return `
        <button
          data-exercise-id="${exercise.id}"
          class="exercise-card rounded-3xl p-4 text-left ${isSelected ? "border border-orange-500 shadow-lg shadow-orange-500/10" : ""}"
        >
          <div class="card-accent"></div>
          <div class="mb-4 flex items-center justify-between">
            <div class="rounded-full bg-slate-700/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">${exercise.category}</div>
            <div class="text-lg">🏋️</div>
          </div>

          <div class="mb-3">
            <h3 class="text-xl font-black">${exercise.name}</h3>
            <p class="mt-2 text-sm text-slate-300">${exercise.description}</p>
          </div>

          <div class="flex items-center justify-between text-sm text-slate-300">
            <span>${exercise.sets} sets</span>
            <span>${exercise.reps} reps</span>
          </div>

          <div class="mt-4 rounded-2xl bg-slate-800/80 p-3">
            <div class="flex justify-between text-xs uppercase tracking-[0.14em] text-slate-400">
              <span>Difficulty</span>
              <span>${exercise.difficulty}</span>
            </div>
          </div>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".exercise-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.exerciseId;
      const selected = exercises.find((e) => e.id === id);
      if (!selected) return;
      appState.selectedExercise = selected;
      appState.currentSet = 1;
      appState.currentReps = 0;
      appState.currentStep = 0;
      appState.workoutSeconds = 0;
      beginExerciseTimer();
      renderAll();
      showGuidedView();
    });
  });
}

function renderHistory() {
  const historyGrid = document.getElementById("historyGrid");
  if (!appState.history.length) {
    historyGrid.innerHTML = `
      <div class="rounded-3xl border border-dashed border-white/10 bg-slate-900 p-8 text-center text-slate-400">
        No workouts logged yet.
      </div>
    `;
    return;
  }

  historyGrid.innerHTML = appState.history
    .slice(0, 8)
    .map((entry) => `
      <div class="rounded-3xl border border-white/10 bg-slate-900 p-4">
        <div class="flex items-center justify-between">
          <div class="text-lg font-bold">${entry.name}</div>
          <div class="text-xs uppercase tracking-[0.2em] text-emerald-400">${entry.category}</div>
        </div>
        <div class="mt-3 text-sm text-slate-300">
          <div>Completed: ${entry.date}</div>
          <div>Duration: ${formatSeconds(entry.seconds)}</div>
          <div>Sets: ${entry.sets}</div>
        </div>
      </div>
    `)
    .join("");
}

function showHomeView() {
  document.getElementById("homeView").classList.remove("hidden");
  document.getElementById("guidedView").classList.add("hidden");
  document.getElementById("historyView").classList.remove("hidden");
}

function showGuidedView() {
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("guidedView").classList.remove("hidden");
  document.getElementById("historyView").classList.remove("hidden");
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateExerciseScreen() {
  const exc = appState.selectedExercise;

  document.getElementById("exerciseCategoryTag").textContent = exc.category;
  document.getElementById("exerciseTitle").textContent = exc.name;
  document.getElementById("exerciseLevel").textContent = exc.difficulty;
  document.getElementById("stepCounter").textContent = `Step ${appState.currentStep + 1} / ${exc.instructions.length}`;
  document.getElementById("instructionBox").textContent = exc.instructions[appState.currentStep];
  document.getElementById("targetSetLabel").textContent = exc.sets;
  document.getElementById("targetRepLabel").textContent = exc.reps;
  document.getElementById("setDisplay").textContent = appState.currentSet;
  document.getElementById("repDisplay").textContent = appState.currentReps;

  const setProgress = (appState.currentSet / exc.sets) * 100;
  document.getElementById("setProgressBar").style.width = `${Math.min(setProgress, 100)}%`;

  const repProgress = (appState.currentReps / exc.reps) * 100;
  document.getElementById("repProgressBar").style.width = `${Math.min(repProgress, 100)}%`;

  document.getElementById("timerDisplay").textContent = formatSeconds(appState.timerSeconds);
  document.getElementById("stopwatchDisplay").textContent = formatSeconds(appState.workoutSeconds);
  document.getElementById("timerModeTag").textContent =
    appState.timerMode === "exercise" ? "Exercise mode" : "Rest mode";
}

function startStopwatch() {
  if (appState.stopwatchInterval) return;
  appState.stopwatchInterval = setInterval(() => {
    appState.workoutSeconds += 1;
    updateExerciseScreen();
  }, 1000);
}

function stopStopwatch() {
  if (appState.stopwatchInterval) {
    clearInterval(appState.stopwatchInterval);
    appState.stopwatchInterval = null;
  }
}

function playTone(frequency = 880, duration = 0.18) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const audioCtx = new AudioCtx();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gainNode.gain.value = 0.04;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => audioCtx.close(), 250);
}

function triggerFeedback() {
  if ("vibrate" in navigator) navigator.vibrate(200);
  playTone(880, 0.18);
}

function beginExerciseTimer() {
  appState.timerMode = "exercise";
  appState.timerSeconds = appState.selectedExercise.duration || 45;
  updateExerciseScreen();
}

function beginRestTimer() {
  appState.timerMode = "rest";
  appState.timerSeconds = 20;
  updateExerciseScreen();
}

function startTimerLoop() {
  if (appState.timerInterval) return;

  appState.timerInterval = setInterval(() => {
    if (appState.timerSeconds > 0) {
      appState.timerSeconds -= 1;
      updateExerciseScreen();
      return;
    }

    if (appState.timerMode === "exercise") {
      advanceToRest();
    } else {
      advanceToNextSet();
    }
  }, 1000);
}

function advanceToRest() {
  appState.timerMode = "rest";
  appState.timerSeconds = 20;
  triggerFeedback();
  updateExerciseScreen();
}

function advanceToNextSet() {
  appState.currentSet += 1;
  appState.currentReps = 0;
  appState.currentStep = 0;
  appState.timerMode = "exercise";
  appState.timerSeconds = appState.selectedExercise.duration || 45;
  triggerFeedback();
  updateExerciseScreen();

  if (appState.currentSet > appState.selectedExercise.sets) {
    finishWorkout();
  }
}

function finishWorkout() {
  stopTimer();
  stopStopwatch();
  appState.isRunning = false;
  updateControlButtons();

  const finishedEntry = {
    name: appState.selectedExercise.name,
    category: appState.selectedExercise.category,
    date: new Date().toLocaleDateString(),
    seconds: appState.workoutSeconds,
    sets: appState.currentSet,
  };

  appState.history.unshift(finishedEntry);
  appState.streak += 1;
  saveState();
  renderHistory();
  updateStreakBadge();

  alert(`${appState.selectedExercise.name} completed! Great job.`);
}

function startWorkout() {
  if (!appState.selectedExercise) return;

  appState.isRunning = true;
  appState.currentSet = 1;
  appState.currentReps = 0;
  appState.currentStep = 0;
  appState.workoutSeconds = 0;
  beginExerciseTimer();
  startTimerLoop();
  startStopwatch();
  updateControlButtons();
}

function stopTimer() {
  if (appState.timerInterval) {
    clearInterval(appState.timerInterval);
    appState.timerInterval = null;
  }
}

function updateControlButtons() {
  const startBtn = document.getElementById("startWorkoutBtn");
  const pauseBtn = document.getElementById("pauseWorkoutBtn");

  if (appState.isRunning) {
    startBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
  } else {
    startBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
  }
}

function togglePause() {
  if (!appState.isRunning) return;

  appState.isRunning = !appState.isRunning;

  if (appState.isRunning) {
    startTimerLoop();
    startStopwatch();
  } else {
    stopTimer();
    stopStopwatch();
  }

  updateControlButtons();
}

function nextSet() {
  if (appState.currentSet >= appState.selectedExercise.sets) {
    finishWorkout();
    return;
  }

  appState.currentSet += 1;
  appState.currentReps = 0;
  appState.currentStep = 0;
  beginExerciseTimer();
  updateExerciseScreen();
}

function cycleInstructionStep() {
  const exc = appState.selectedExercise;
  if (appState.currentStep < exc.instructions.length - 1) {
    appState.currentStep += 1;
  } else {
    appState.currentStep = 0;
  }
  updateExerciseScreen();
}

function attachEvents() {
  document.getElementById("backToLibraryBtn").addEventListener("click", () => {
    showHomeView();
  });

  document.getElementById("startWorkoutBtn").addEventListener("click", () => {
    startWorkout();
  });

  document.getElementById("pauseWorkoutBtn").addEventListener("click", () => {
    togglePause();
  });

  document.getElementById("nextSetBtn").addEventListener("click", () => {
    nextSet();
  });

  document.getElementById("finishWorkoutBtn").addEventListener("click", () => {
    finishWorkout();
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      cycleInstructionStep();
    }
  });
}

function renderAll() {
  renderCategories();
  renderExerciseGrid();
  renderHistory();
  updateStreakBadge();
  updateExerciseScreen();
}

function init() {
  loadState();
  renderAll();
  attachEvents();
}

init();
