// Habit Tracker functionality
document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const habitsList = document.getElementById("habits-list");
  const emptyHabitsMessage = document.getElementById("empty-habits-message");
  const addHabitBtn = document.getElementById("add-habit-btn");
  const addHabitModal = document.getElementById("add-habit-modal");
  const closeModalBtns = document.querySelectorAll(".close-modal");
  const saveHabitBtn = document.getElementById("save-habit-btn");
  const habitNameInput = document.getElementById("habit-name");
  const habitDescInput = document.getElementById("habit-description");
  const habitIconInput = document.getElementById("habit-icon");
  const iconOptions = document.querySelectorAll(".icon-option");

  // Stats elements
  const weeklyCompletionEl = document.getElementById("weekly-completion");
  const longestStreakEl = document.getElementById("longest-streak");
  const activeHabitsEl = document.getElementById("active-habits");

  // Initialize habit tracker
  initializeHabitTracker();

  // Event listeners
  if (addHabitBtn) {
    addHabitBtn.addEventListener("click", openAddHabitModal);
  }

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  if (saveHabitBtn) {
    saveHabitBtn.addEventListener("click", saveHabit);
  }

  // Add event listeners to icon options
  iconOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      iconOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // Update hidden input value
      habitIconInput.value = this.getAttribute("data-icon");
    });
  });

  // Set default selected icon
  if (iconOptions.length > 0) {
    iconOptions[0].classList.add("selected");
  }

  // Function to initialize habit tracker
  function initializeHabitTracker() {
    // Load habits from localStorage
    const habits = window.appHelpers.getData("habits") || [];

    // Show or hide empty state message
    if (habits.length === 0) {
      if (emptyHabitsMessage) {
        emptyHabitsMessage.style.display = "block";
      }
    } else {
      if (emptyHabitsMessage) {
        emptyHabitsMessage.style.display = "none";
      }

      // Render habits
      renderHabits(habits);
    }

    // Update stats
    updateHabitStats();
  }

  // Function to open add habit modal
  function openAddHabitModal() {
    if (addHabitModal) {
      addHabitModal.classList.add("active");

      // Clear form fields
      habitNameInput.value = "";
      habitDescInput.value = "";

      // Reset icon selection
      iconOptions.forEach((opt) => opt.classList.remove("selected"));
      iconOptions[0].classList.add("selected");
      habitIconInput.value = iconOptions[0].getAttribute("data-icon");
    }
  }

  // Function to close modals
  function closeModal() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => modal.classList.remove("active"));
  }

  // Function to save a new habit
  function saveHabit() {
    const name = habitNameInput.value.trim();
    const description = habitDescInput.value.trim();
    const icon = habitIconInput.value;

    if (!name) {
      alert("يرجى إدخال اسم العادة");
      return;
    }

    // Get existing habits
    const habits = window.appHelpers.getData("habits") || [];

    // Check if we already have 5 habits
    if (habits.length >= 5) {
      alert(
        "لا يمكنك إضافة أكثر من 5 عادات. يرجى حذف إحدى العادات الحالية أولاً."
      );
      closeModal();
      return;
    }

    // Create new habit object
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newHabit = {
      id: Date.now(),
      name: name,
      description: description,
      icon: icon,
      createdAt: today.toISOString(),
      streak: 0,
      longestStreak: 0,
      completionLog: {}, // Object with dates as keys and completion status as values
    };

    // Add new habit to array
    habits.push(newHabit);

    // Save to localStorage
    window.appHelpers.saveData("habits", habits);

    // Close modal
    closeModal();

    // Refresh habits display
    renderHabits(habits);

    // Hide empty message
    if (emptyHabitsMessage) {
      emptyHabitsMessage.style.display = "none";
    }

    // Update stats
    updateHabitStats();
  }

  // Function to render habits
  function renderHabits(habits) {
    if (!habitsList) return;

    // Clear habits list
    habitsList.innerHTML = "";

    // Render each habit
    habits.forEach((habit) => {
      const habitElement = createHabitElement(habit);
      habitsList.appendChild(habitElement);
    });
  }

  // Function to create a habit element
  function createHabitElement(habit) {
    const habitCard = document.createElement("div");
    habitCard.classList.add("habit-card");
    habitCard.setAttribute("data-id", habit.id);

    // Create streak calendar
    const streakCalendar = createStreakCalendar(habit);

    // Calculate completion percentage
    const completionPercentage = calculateCompletionPercentage(habit);

    habitCard.innerHTML = `
            <div class="habit-header">
                <div class="habit-icon">
                    <i class="fas ${habit.icon}"></i>
                </div>
                <div class="habit-info">
                    <div class="habit-name">${habit.name}</div>
                    <div class="habit-description">${
                      habit.description || ""
                    }</div>
                </div>
                <div class="habit-actions">
                    <button class="habit-action-btn habit-delete" data-id="${
                      habit.id
                    }">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="streak-calendar">
                ${streakCalendar}
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${completionPercentage}%"></div>
            </div>
            <div class="progress-stats">
                <div class="completion-percentage">${completionPercentage}% إنجاز</div>
                <div class="current-streak">
                    <i class="fas fa-fire"></i> ${habit.streak} أيام متتالية
                </div>
            </div>
        `;

    // Add event listener to delete button
    const deleteBtn = habitCard.querySelector(".habit-delete");
    deleteBtn.addEventListener("click", function () {
      deleteHabit(habit.id);
    });
    habitCard.querySelector(".habit-header").onclick = () => {
      habitCard.classList.toggle("open");
    };

    // Add event listeners to day circles
    const dayCircles = habitCard.querySelectorAll(".day-circle");
    dayCircles.forEach((circle) => {
      circle.addEventListener("click", function () {
        const date = this.getAttribute("data-date");
        toggleHabitCompletion(habit.id, date);
      });
    });

    return habitCard;
  }

  // Function to create streak calendar
  //   function createStreakCalendar(habit) {
  //     const days = 7; // Show last 7 days
  //     let calendarHTML = "";

  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);

  //     for (let i = days - 1; i >= 0; i--) {
  //       const date = new Date(today);
  //       date.setDate(date.getDate() - i);

  //       const dateStr = date.toISOString().split("T")[0];
  //       const dayName = getDayName(date.getDay());
  //       const isToday = i === 0;

  //       const completed = habit.completionLog[dateStr] === true;
  //       const missed = date < today && habit.completionLog[dateStr] === false;

  //       let classes = "day-circle";
  //       if (isToday) classes += " today";
  //       if (completed) classes += " completed";
  //       if (missed) classes += " missed";

  //       const dayNumber = date.getDate();

  //       calendarHTML += `
  //                 <div class="${classes}" data-date="${dateStr}">
  //                     ${dayNumber}
  //                     <span class="day-label">${dayName}</span>
  //                 </div>
  //             `;
  //     }

  //     return calendarHTML;
  //   }
  // function createStreakCalendar(habit) {
  //   if (!habit.completionLog) habit.completionLog = {}; // ✅ يحمي من undefined

  //   const days = 7;
  //   let calendarHTML = "";
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   for (let i = days - 1; i >= 0; i--) {
  //     const date = new Date(today);
  //     date.setDate(date.getDate() - i);
  //     const dateStr = date.toISOString().split("T")[0];
  //     const dayName = getDayName(date.getDay());
  //     const isToday = i === 0;

  //     const completed = habit.completionLog[dateStr] === true;
  //     const missed = date < today && habit.completionLog[dateStr] === false;

  //     let classes = "day-circle";
  //     if (isToday) classes += " today";
  //     if (completed) classes += " completed";
  //     if (missed) classes += " missed";

  //     const dayNumber = date.getDate();

  //     calendarHTML += `
  //       <div class="${classes}" data-date="${dateStr}">
  //         ${dayNumber}
  //         <span class="day-label">${dayName}</span>
  //       </div>
  //     `;
  //   }

  //   return calendarHTML;
  // }
  // Function to create streak calendar with reversed day order
  function createStreakCalendar(habit) {
    if (!habit.completionLog) habit.completionLog = {}; // ✅ يحمي من undefined

    const days = 7;
    let calendarHTML = "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create the days in reverse order (from today to 7 days ago)
    for (let i = 0; i <= days - 1; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = getDayName(date.getDay());
      const isToday = i === 0;

      const completed = habit.completionLog[dateStr] === true;
      const missed = date < today && habit.completionLog[dateStr] === false;

      let classes = "day-circle";
      if (isToday) classes += " today";
      if (completed) classes += " completed";
      if (missed) classes += " missed";

      const dayNumber = date.getDate();

      calendarHTML += `
      <div class="${classes}" data-date="${dateStr}">
        ${dayNumber}
        <span class="day-label">${dayName}</span>
      </div>
    `;
    }

    return calendarHTML;
  }

  // Function to get Arabic day name
  function getDayName(dayIndex) {
    const days = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    return days[dayIndex];
  }

  // Function to calculate completion percentage
  function calculateCompletionPercentage(habit) {
    const days = 7; // Calculate for last 7 days
    let completed = 0;
    let total = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      if (date < new Date(habit.createdAt)) {
        continue; // Skip days before habit was created
      }

      const dateStr = date.toISOString().split("T")[0];

      total++;
      if (habit.completionLog[dateStr] === true) {
        completed++;
      }
    }

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  // Function to toggle habit completion
  function toggleHabitCompletion(habitId, dateStr) {
    // Get habits from localStorage
    const habits = window.appHelpers.getData("habits") || [];

    // Find habit by id
    const habitIndex = habits.findIndex((h) => h.id === habitId);
    if (habitIndex === -1) return;

    const habit = habits[habitIndex];

    // Toggle completion status
    if (!habit.completionLog) {
      habit.completionLog = {};
    }

    habit.completionLog[dateStr] = !habit.completionLog[dateStr];

    // Update streak
    updateHabitStreak(habit);

    // Save updated habits
    habits[habitIndex] = habit;
    window.appHelpers.saveData("habits", habits);

    // Re-render habits
    renderHabits(habits);

    // Update stats
    updateHabitStats();
  }

  // Function to update habit streak
  function updateHabitStreak(habit) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let date = new Date(today);

    // Count backwards from today to calculate current streak
    while (true) {
      const dateStr = date.toISOString().split("T")[0];

      // If this date is before habit was created, break
      if (date < new Date(habit.createdAt)) {
        break;
      }

      // If completion is false or undefined for any day, break the streak
      if (habit.completionLog[dateStr] !== true) {
        break;
      }

      currentStreak++;
      date.setDate(date.getDate() - 1);
    }

    // Update streak
    habit.streak = currentStreak;

    // Update longest streak if current streak is longer
    if (currentStreak > habit.longestStreak) {
      habit.longestStreak = currentStreak;
    }
  }

  // Function to delete a habit
  function deleteHabit(habitId) {
    if (!confirm("هل أنت متأكد من حذف هذه العادة؟")) {
      return;
    }

    // Get habits from localStorage
    const habits = window.appHelpers.getData("habits") || [];

    // Filter out the habit to delete
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);

    // Save updated habits
    window.appHelpers.saveData("habits", updatedHabits);

    // Show empty message if no habits left
    if (updatedHabits.length === 0 && emptyHabitsMessage) {
      emptyHabitsMessage.style.display = "block";
    }

    // Re-render habits
    renderHabits(updatedHabits);

    // Update stats
    updateHabitStats();
  }

  // Function to update habit stats
  function updateHabitStats() {
    const habits = window.appHelpers.getData("habits") || [];

    // Calculate weekly completion percentage across all habits
    let totalCompletions = 0;
    let totalPossible = 0;

    // Find longest streak across all habits
    let maxStreak = 0;

    habits.forEach((habit) => {
      // Add to weekly completion calculation
      const completionPercentage = calculateCompletionPercentage(habit);
      totalCompletions += completionPercentage;
      totalPossible += 100;

      // Update max streak
      if (habit.longestStreak > maxStreak) {
        maxStreak = habit.longestStreak;
      }
    });

    // Calculate overall weekly completion
    const weeklyCompletion =
      totalPossible > 0
        ? Math.round((totalCompletions / totalPossible) * 100)
        : 0;

    // Update stats display
    if (weeklyCompletionEl) {
      weeklyCompletionEl.textContent = `${weeklyCompletion}%`;
    }

    if (longestStreakEl) {
      longestStreakEl.textContent = `${maxStreak} أيام`;
    }

    if (activeHabitsEl) {
      activeHabitsEl.textContent = `${habits.length}/5`;
    }
  }
});
