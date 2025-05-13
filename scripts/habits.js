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
  let editHabitId = null;

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
  // function initializeHabitTracker() {
  //   // Load habits from localStorage
  //   const habits = window.appHelpers.getData("habits") || [];

  //   // Show or hide empty state message
  //   if (habits.length === 0) {
  //     if (emptyHabitsMessage) {
  //       emptyHabitsMessage.style.display = "block";
  //     }
  //   } else {
  //     if (emptyHabitsMessage) {
  //       emptyHabitsMessage.style.display = "none";
  //     }

  //     // Render habits
  //     renderHabits(habits);
  //   }

  //   // Update stats
  //   updateHabitStats();
  // }
  function initializeHabitTracker() {
    if (localStorage.getItem("token")) {
      // ✅ مستخدم مسجل → حمّل من السيرفر
      fetchAndRenderHabits();
    } else {
      // 🟡 زائر → حمّل من localStorage بعد فلترة userId
      const habits = getFilteredLocalHabits();

      if (habits.length === 0) {
        if (emptyHabitsMessage) {
          emptyHabitsMessage.style.display = "block";
        }
      } else {
        if (emptyHabitsMessage) {
          emptyHabitsMessage.style.display = "none";
        }

        renderHabits(habits);
      }

      updateHabitStats(habits);
    }
  }

  // Function to open add habit modal
  function openAddHabitModal() {
    if (addHabitModal) {
      addHabitModal.classList.add("active");

      // 🧼 Reset edit mode
      editHabitId = null;
      saveHabitBtn.textContent = "حفظ العادة";
      addHabitModal.querySelector(".modal-header h3").textContent =
        "اضافة عادة جديدة";

      // 🧼 Clear form fields
      habitNameInput.value = "";
      habitDescInput.value = "";

      // 🧼 Reset icon selection
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

    if (editHabitId !== null) {
      const payload = { name, description, icon };
      if (localStorage.getItem("token")) {
        // تعديل في قاعدة البيانات
        fetch(`https://rafeeq1.netlify.app//habits/${editHabitId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name, description, icon }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("فشل في التحديث");
            return res.json();
          })
          .then((data) => {
            closeModal();
            fetchAndRenderHabits();
            updateHabitStats();
          })
          .catch((err) => {
            console.error("❌ Error updating habit:", err);
            alert("فشل في تحديث العادة");
          });
      } else {
        // تعديل في localStorage
        const habits = getFilteredLocalHabits(); // Get current guest habits
        const index = habits.findIndex(
          (h) =>
            String(h.id) === String(editHabitId) ||
            String(h._id) === String(editHabitId)
        );
        if (index !== -1) {
          // Update the specific habit
          habits[index] = { ...habits[index], name, description, icon };

          window.appHelpers.saveData("habits", habits);
          closeModal();
          renderHabits(habits);
          updateHabitStats(habits);
        } else {
          console.error("Guest habit to edit not found:", editHabitId);
          alert("خطأ: لم يتم العثور على العادة المراد تعديلها.");
        }
      }

      editHabitId = null;
      saveHabitBtn.textContent = "حفظ العادة";
      return;
    }

    // 🟢 مستخدم مسجل: أرسل للسيرفر
    if (localStorage.getItem("token")) {
      fetch("https://rafeeq1.netlify.app//habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, description, icon }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("فشل في الإضافة");
          return res.json();
        })
        .then((data) => {
          closeModal();
          fetchAndRenderHabits(); // نحصل على العادات من السيرفر ونعرضها
          updateHabitStats(); // لو في حاجة لتحديث الإحصائيات
        })
        .catch((err) => {
          console.error("❌ Error:", err);
          alert("فشل في إضافة العادة");
        });
    } else {
      // 🟡 زائر → احفظ في localStorage
      const habits = getFilteredLocalHabits();
      if (habits.length >= 5) {
        alert("لا يمكنك إضافة أكثر من 5 عادات.");
        closeModal();
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newHabit = {
        id: Date.now(),
        name,
        description,
        icon,
        createdAt: today.toISOString(),
        streak: 0,
        longestStreak: 0,
        completionLog: {},
      };

      habits.push(newHabit);
      window.appHelpers.saveData("habits", habits);
      closeModal();
      renderHabits(habits);
      updateHabitStats(habits);
    }

    saveHabitBtn.textContent = "حفظ العادة";
    editHabitId = null;
  }

  function getFilteredLocalHabits() {
    const allHabits = window.appHelpers.getData("habits") || [];

    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?._id;

    return allHabits.filter((h) => !h.userId || h.userId === currentUserId);
  }

  // Function to render habits
  function renderHabits(habits) {
    if (!habitsList) return;

    // Clear habits list
    habitsList.innerHTML = "";

    // Render each habit
    habits.forEach((habit) => {
      // ⭐️ أضفنا هذا السطر ليتوافق _id مع باقي الكود
      habit.id = habit._id || habit.id;

      const habitElement = createHabitElement(habit);
      habitsList.appendChild(habitElement);
    });
  }

  function fetchAndRenderHabits() {
    // Show loading indicator maybe?
    habitsList.innerHTML = '<div class="loading">جاري تحميل العادات...</div>'; // Example loader

    fetch("https://rafeeq1.netlify.app//habits", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`فشل جلب العادات (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (data.habits && Array.isArray(data.habits)) {
          if (data.habits.length === 0) {
            if (emptyHabitsMessage) emptyHabitsMessage.style.display = "block";
            habitsList.innerHTML = ""; // Clear loading/list
          } else {
            if (emptyHabitsMessage) emptyHabitsMessage.style.display = "none";
            renderHabits(data.habits);
          }
          updateHabitStats(data.habits); // Pass fetched habits
        } else {
          console.warn("No habits array found in API response:", data);
          if (emptyHabitsMessage) emptyHabitsMessage.style.display = "block";
          habitsList.innerHTML = ""; // Clear loading/list
          updateHabitStats([]); // Update with empty array
        }
      })
      .catch((err) => {
        console.error("❌ Error loading habits:", err);
        habitsList.innerHTML = `<div class="error">فشل تحميل العادات: ${err.message}</div>`; // Show error
        updateHabitStats([]); // Update with empty array on error
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
                    <button class="habit-action-btn habit-edit" data-id="${
                      habit.id
                    }">
                     <i class="fas fa-pen"></i>
                    </button>
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
    deleteBtn.addEventListener("click", () => {
      if (localStorage.getItem("token")) {
        fetch(`https://rafeeq1.netlify.app//habits/${habit.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then(() => {
            fetchAndRenderHabits();
            updateHabitStats();
          })
          .catch((err) => {
            console.error("❌ Error deleting habit:", err);
          });
      } else {
        const habits = window.appHelpers.getData("habits") || [];
        const updated = habits.filter((h) => h.id !== habit.id);
        window.appHelpers.saveData("habits", updated);
        renderHabits(updated);
        updateHabitStats(updated);
      }
    });

    const editBtn = habitCard.querySelector(".habit-edit");
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // عشان ما يفتح/يقفل الكارد

      // خزّن الـ ID مؤقتًا
      editHabitId = habit.id;

      // عبّ البيانات في المودال
      habitNameInput.value = habit.name;
      habitDescInput.value = habit.description || "";
      habitIconInput.value = habit.icon;

      // فعّل الأيقونة المحددة
      iconOptions.forEach((opt) => {
        if (opt.getAttribute("data-icon") === habit.icon) {
          opt.classList.add("selected");
        } else {
          opt.classList.remove("selected");
        }
      });

      // غيّر نص الزر إذا حبيت
      saveHabitBtn.textContent = "تحديث العادة";
      addHabitModal.querySelector(".modal-header h3").textContent =
        "تحديث العادة";

      // أظهر المودال
      addHabitModal.classList.add("active");
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
  // --- In habits.js ---

  // Function to toggle habit completion
  function toggleHabitCompletion(habitId, dateStr) {
    // Find the clicked circle element to update UI optimistically
    const habitCard = document.querySelector(
      `.habit-card[data-id="${habitId}"]`
    );
    const circle = habitCard?.querySelector(
      `.day-circle[data-date="${dateStr}"]`
    );
    if (!circle) return; // Safety check

    // Determine the *intended* new state based on current classes
    const isCurrentlyCompleted = circle.classList.contains("completed");
    const intendedNewState = !isCurrentlyCompleted; // true for complete, false for uncomplete

    // --- Optimistic UI Update ---
    // Immediately toggle the visual state for instant feedback
    circle.classList.toggle("completed", intendedNewState);
    circle.classList.remove("missed"); // Remove missed if toggling to complete
    if (
      !intendedNewState &&
      new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0))
    ) {
      // If toggling off for a *past* date, mark it as missed
      circle.classList.add("missed");
    }
    // --- End Optimistic UI Update ---

    if (localStorage.getItem("token")) {
      // ✅ مستخدم مسجل → إرسال لـ backend (Unified Endpoint)
      fetch(
        `https://rafeeq1.netlify.app//habits/${habitId}/toggle/${dateStr}`,
        {
          // Use the new endpoint
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          // No body needed as info is in the URL
        }
      )
        .then(async (res) => {
          // Make async to parse error JSON
          if (!res.ok) {
            const errorData = await res
              .json()
              .catch(() => ({ message: "فشل في التحديث" }));
            throw new Error(
              errorData.message || `فشل في التحديث (${res.status})`
            );
          }
          return res.json(); // Return the parsed JSON data
        })
        .then((data) => {
          // data contains the updated habit
          console.log("Habit toggled successfully via API", data);
          // Refresh the specific card or the whole list less disruptively
          // Option 1: Refresh whole list (simpler but might cause flicker)
          fetchAndRenderHabits(); // Keep this for simplicity for now
          updateHabitStats();

          // Option 2 (More Advanced): Update only the affected card using data.habit
          // This avoids full re-render flicker but requires more complex logic
          // updateSingleHabitCard(data.habit);
        })
        .catch((err) => {
          console.error("❌ فشل في تحديث الإنجاز:", err);
          alert(`فشل في تحديث حالة اليوم: ${err.message}`);
          // --- Revert Optimistic UI Update on Error ---
          circle.classList.toggle("completed", !intendedNewState); // Toggle back
          circle.classList.remove("missed"); // Clear potential missed state
          if (
            isCurrentlyCompleted &&
            new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0))
          ) {
            // If it WAS completed and is a past date, mark it missed again? Or just revert? Reverting is safer.
          }
          if (
            !isCurrentlyCompleted &&
            new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0))
          ) {
            // If it WAS NOT completed and is a past date, mark it missed
            circle.classList.add("missed");
          }
          // --- End Revert ---
        });
    } else {
      // --- 🟡 زائر → localStorage --- (Logic remains similar)
      const habits = getFilteredLocalHabits(); // Use the filtering function
      const habitIndex = habits.findIndex(
        (h) =>
          String(h.id) === String(habitId) || String(h._id) === String(habitId)
      ); // Check both id and _id
      if (habitIndex === -1) {
        console.error("Guest habit not found for ID:", habitId);
        // Revert optimistic UI if habit not found
        circle.classList.toggle("completed", !intendedNewState);
        return;
      }

      const habit = habits[habitIndex];
      if (!habit.completionLog) habit.completionLog = {};

      // Toggle status in local data
      habit.completionLog[dateStr] = intendedNewState; // Set based on intended state

      // Recalculate streak based on local data
      updateHabitStreak(habit);
      habits[habitIndex] = habit;
      window.appHelpers.saveData("habits", habits); // Ensure appHelpers exists or replace with direct localStorage

      // Re-render immediately reflects the change
      // Instead of full re-render, could update just the one card for better UX
      renderHabits(habits); // Keep for simplicity
      updateHabitStats(habits);
    }
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
  // --- In habits.js ---

  // Function to update habit stats
  // function updateHabitStats() {                                // OLD Definition
  //   const habits = window.appHelpers.getData("habits") || [];  // REMOVE THIS LINE

  function updateHabitStats(habits = []) {
    // NEW Definition - Accepts habits array
    // Ensure habits is always an array
    if (!Array.isArray(habits)) {
      console.warn("updateHabitStats received non-array:", habits);
      habits = [];
    }

    // Calculate weekly completion percentage across all habits
    let totalCompletions = 0;
    let totalPossibleCompletions = 0; // Renamed for clarity

    // Find longest streak across all habits
    let maxStreak = 0;

    habits.forEach((habit) => {
      // Ensure habit object is valid and has necessary properties
      if (!habit || typeof habit !== "object") return;
      if (typeof habit.completionLog !== "object") habit.completionLog = {};
      if (typeof habit.longestStreak !== "number") habit.longestStreak = 0;

      // Add to weekly completion calculation
      const { completedCount, possibleCount } =
        calculateCompletionCounts(habit); // Use helper
      totalCompletions += completedCount;
      totalPossibleCompletions += possibleCount;

      // Update max streak
      // Use habit.longestStreak directly as it should be calculated on backend/local save
      if (habit.longestStreak > maxStreak) {
        maxStreak = habit.longestStreak;
      }
    });

    // Calculate overall weekly completion
    const weeklyCompletion =
      totalPossibleCompletions > 0
        ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
        : 0;

    // Update stats display
    if (weeklyCompletionEl) {
      weeklyCompletionEl.textContent = `${weeklyCompletion}%`;
    }

    if (longestStreakEl) {
      // Ensure maxStreak is a valid number
      longestStreakEl.textContent = `${!isNaN(maxStreak) ? maxStreak : 0} أيام`;
    }

    if (activeHabitsEl) {
      // Display count. The "/5" limit might only apply to guests?
      // Decide if you want to show the limit for logged-in users too.
      // For now, keep the "/5" for guests, show only count for logged-in.
      // OR just show count always:
      // activeHabitsEl.textContent = `${habits.length}`;
      // OR keep original:
      activeHabitsEl.textContent = `${habits.length}/5`;
    }
  }

  // Helper function to calculate completions for the last 7 days for ONE habit
  // (Extracted from old calculateCompletionPercentage logic for clarity)
  function calculateCompletionCounts(habit) {
    const days = 7;
    let completedCount = 0;
    let possibleCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const habitStartDate = habit.createdAt
      ? new Date(habit.createdAt)
      : new Date(0); // Handle missing createdAt
    habitStartDate.setHours(0, 0, 0, 0);

    if (!habit.completionLog) habit.completionLog = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Skip days before habit was created
      if (date < habitStartDate) {
        continue;
      }

      possibleCount++; // This day is a possible day to complete
      const dateStr = date.toISOString().split("T")[0];
      if (habit.completionLog[dateStr] === true) {
        completedCount++;
      }
    }
    return { completedCount, possibleCount };
  }
});
