// document.addEventListener("DOMContentLoaded", () => {
//   /* عناصر المؤقّت */
//   const recoveryDaysEl = document.getElementById("recovery-days");
//   const recoveryTimeDetails = document.getElementById("recovery-time-details");
//   const startBtn = document.getElementById("start-recovery-btn");
//   const resetBtn = document.getElementById("reset-recovery-btn");

//   /* نافذة الانتكاسة */
//   const relapseModal = document.getElementById("relapse-modal");
//   const confirmRelapseBtn = document.getElementById("confirm-relapse-btn");
//   document
//     .querySelectorAll(".close-modal")
//     .forEach(
//       (b) => (b.onclick = () => relapseModal.classList.remove("active"))
//     );

//   /* مؤقّت */
//   let timerInterval;
//   const savedISO = window.appHelpers.getData("recoveryStartDate");
//   if (savedISO) initExisting(savedISO);
//   startBtn.onclick = () => {
//     const iso = new Date().toISOString();
//     window.appHelpers.saveData("recoveryStartDate", iso);
//     initExisting(iso);

//     // إرسال إشعار بالتغيير للمستمعين الآخرين (مثل bouncing.js)
//     window.dispatchEvent(
//       new StorageEvent("storage", {
//         key: "recoveryStartDate",
//         newValue: iso,
//       })
//     );
//   };

//   /* الانتكاسة */
//   resetBtn.onclick = () => relapseModal.classList.add("active");
//   confirmRelapseBtn.onclick = () => {
//     // حفظ قيمة null لتاريخ البدء
//     window.appHelpers.saveData("recoveryStartDate", null);

//     // إيقاف المؤقت
//     clearInterval(timerInterval);

//     // إعادة تعيين عناصر العرض
//     recoveryDaysEl.textContent = "0";
//     recoveryTimeDetails.textContent = "⌛ 0 ساعة و 0 دقيقة و 0 ثانية";

//     // إظهار زر البدء وإخفاء زر الإعادة
//     startBtn.style.display = "inline-block";
//     resetBtn.style.display = "none";

//     // إغلاق نافذة التأكيد
//     relapseModal.classList.remove("active");

//     // إرسال إشعار صريح إلى المستمعين الآخرين للتأكد من إعادة الضبط
//     window.dispatchEvent(
//       new StorageEvent("storage", {
//         key: "recoveryStartDate",
//         newValue: null,
//       })
//     );
//   };

//   /* ————— الدوال ————— */
//   function initExisting(iso) {
//     startBtn.style.display = "none";
//     resetBtn.style.display = "inline-block";
//     startTimer(new Date(iso));
//   }

//   function startTimer(startDate) {
//     clearInterval(timerInterval);
//     updateTimer(startDate);
//     timerInterval = setInterval(() => updateTimer(startDate), 1000);
//   }

//   function updateTimer(startDate) {
//     const diff = Date.now() - startDate.getTime();
//     const d = Math.floor(diff / 864e5);
//     const h = Math.floor((diff / 36e5) % 24);
//     const m = Math.floor((diff / 6e4) % 60);
//     const s = Math.floor((diff / 1e3) % 60);
//     recoveryDaysEl.textContent = d;
//     recoveryTimeDetails.textContent = `⌛ ${h} ساعة و ${m} دقيقة و ${s} ثانية`;
//   }
// });

// --- START OF FILE timer.js ---

document.addEventListener("DOMContentLoaded", () => {
  /* API and Auth Helpers (Local to timer.js) */
  const API_URL = "https://rafiq-backend.onrender.com"; // Adjust if needed

  function isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  function getAuthToken() {
    return localStorage.getItem("token");
  }

  async function apiRequest(endpoint, method = "GET", data = null) {
    const token = getAuthToken();

    // No need to check token here for GET, POST, DELETE specifically
    // as the logic below handles guest/logged-in states separately.
    // However, POST/DELETE will require a token *if* logged in.

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials like cookies if needed
    };

    // Add Authorization header ONLY if logged in
    if (isLoggedIn() && token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, options);

      // If unauthorized specifically, maybe prompt login or handle differently
      if (response.status === 401) {
        console.error("Authentication error (401). Token might be invalid.");
        // Potentially clear token and redirect to login?
        // clearUserData(); // Example function to clear token/user
        // window.location.href = 'login.html';
        throw new Error("يرجى تسجيل الدخول مرة أخرى.");
      }

      if (!response.ok && response.status !== 404) {
        // Allow 404 (Not Found) for GET/DELETE as it means no record exists
        const errorData = await response.json().catch(() => ({})); // Try to parse error
        throw new Error(errorData.message || `فشل الطلب (${response.status})`);
      }
      // For 404 on GET/DELETE, return null or specific indicator
      if (response.status === 404) {
        return null; // Indicates resource not found
      }

      // Handle cases where response might be empty (e.g., successful DELETE)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        return null; // Or return { success: true } if needed for DELETE
      }
    } catch (error) {
      console.error("API Request Error:", error);
      throw error; // Re-throw to be caught by calling function
    }
  }

  // Helper to dispatch storage events for bouncing.js
  function dispatchStorageEvent(key, newValue) {
    try {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: key,
          newValue: newValue, // Can be string or null
          storageArea: localStorage, // Simulate localStorage event
        })
      );
      console.log(`Dispatched storage event for ${key}:`, newValue);
    } catch (e) {
      console.error("Error dispatching storage event:", e);
      // Fallback for older browsers or environments might be needed if critical
    }
  }

  /* Timer Elements */
  const recoveryDaysEl = document.getElementById("recovery-days");
  const recoveryTimeDetails = document.getElementById("recovery-time-details");
  const startBtn = document.getElementById("start-recovery-btn");
  const resetBtn = document.getElementById("reset-recovery-btn");

  /* Relapse Modal Elements */
  const relapseModal = document.getElementById("relapse-modal");
  const confirmRelapseBtn = document.getElementById("confirm-relapse-btn");
  document
    .querySelectorAll(".close-modal")
    .forEach(
      (b) => (b.onclick = () => relapseModal.classList.remove("active"))
    );

  /* Timer State */
  let timerInterval;
  let currentRecoveryStartDate = null; // Store the date object

  /* --- Core Logic --- */

  // Function to initialize the timer UI and state
  function initializeTimer(startDateIso) {
    if (startDateIso) {
      currentRecoveryStartDate = new Date(startDateIso);
      startBtn.style.display = "none";
      resetBtn.style.display = "inline-block";
      startTimerInterval(currentRecoveryStartDate);
    } else {
      resetTimerUI(); // Ensure UI is in reset state
    }
  }

  // Function to reset the timer UI
  function resetTimerUI() {
    clearInterval(timerInterval);
    timerInterval = null;
    currentRecoveryStartDate = null;
    recoveryDaysEl.textContent = "0";
    recoveryTimeDetails.textContent = "⌛ 0 ساعة و 0 دقيقة و 0 ثانية";
    startBtn.style.display = "inline-block";
    resetBtn.style.display = "none";
    relapseModal.classList.remove("active");
  }

  // Function to start the interval timer
  function startTimerInterval(startDate) {
    clearInterval(timerInterval); // Clear any existing interval
    updateTimerDisplay(startDate); // Initial display
    timerInterval = setInterval(() => updateTimerDisplay(startDate), 1000);
  }

  // Function to update the display elements
  function updateTimerDisplay(startDate) {
    if (!startDate) return;
    const diff = Date.now() - startDate.getTime();
    if (diff < 0) {
      // Handle potential clock skew or future date
      resetTimerUI();
      return;
    }
    const d = Math.floor(diff / 864e5); // Days
    const h = Math.floor((diff / 36e5) % 24); // Hours
    const m = Math.floor((diff / 6e4) % 60); // Minutes
    const s = Math.floor((diff / 1e3) % 60); // Seconds
    recoveryDaysEl.textContent = d;
    recoveryTimeDetails.textContent = `⌛ ${h} ساعة و ${m} دقيقة و ${s} ثانية`;
  }

  // --- Event Handlers ---

  // Start Recovery Button Click
  startBtn.onclick = async () => {
    const startDateIso = new Date().toISOString();
    startBtn.disabled = true; // Prevent double clicks

    try {
      if (isLoggedIn()) {
        // --- Logged-in User ---
        console.log("Attempting to start recovery via API...");
        await apiRequest("/recovery", "POST", {
          recoveryStartDate: startDateIso,
        });
        console.log("API: Recovery started successfully.");
        initializeTimer(startDateIso);
        dispatchStorageEvent("recoveryStartDate", startDateIso); // Notify bouncing.js
      } else {
        // --- Guest User ---
        console.log("Starting recovery locally (guest)...");
        localStorage.setItem("recoveryStartDate", startDateIso);
        initializeTimer(startDateIso);
        dispatchStorageEvent("recoveryStartDate", startDateIso); // Notify bouncing.js
      }
    } catch (error) {
      console.error("Error starting recovery:", error);
      alert(`فشل في بدء مؤقت التعافي: ${error.message}`);
    } finally {
      startBtn.disabled = false;
    }
  };

  // Show Relapse Modal
  resetBtn.onclick = () => {
    relapseModal.classList.add("active");
  };

  // Confirm Relapse Button Click
  confirmRelapseBtn.onclick = async () => {
    confirmRelapseBtn.disabled = true; // Prevent double clicks

    try {
      if (isLoggedIn()) {
        // --- Logged-in User ---
        console.log("Attempting to reset recovery via API...");
        // DELETE request - it's okay if it returns 404 (already deleted)
        await apiRequest("/recovery", "DELETE");
        console.log("API: Recovery reset successfully.");
        resetTimerUI();
        dispatchStorageEvent("recoveryStartDate", null); // Notify bouncing.js
      } else {
        // --- Guest User ---
        console.log("Resetting recovery locally (guest)...");
        localStorage.removeItem("recoveryStartDate");
        resetTimerUI();
        dispatchStorageEvent("recoveryStartDate", null); // Notify bouncing.js
      }
    } catch (error) {
      console.error("Error resetting recovery:", error);
      alert(`فشل في إعادة ضبط مؤقت التعافي: ${error.message}`);
      // If API fails, UI doesn't reset, which might be desired
    } finally {
      confirmRelapseBtn.disabled = false;
      relapseModal.classList.remove("active"); // Ensure modal closes even on error
    }
  };

  // --- Initial Load ---
  async function initialLoad() {
    console.log("Initializing recovery timer...");
    if (isLoggedIn()) {
      console.log("User is logged in. Fetching recovery data from API...");
      try {
        const data = await apiRequest("/recovery", "GET");
        if (data && data.recovery && data.recovery.recoveryStartDate) {
          console.log(
            "API: Found recovery start date:",
            data.recovery.recoveryStartDate
          );
          initializeTimer(data.recovery.recoveryStartDate);
        } else {
          console.log("API: No recovery record found for user.");
          initializeTimer(null); // No timer running
        }
      } catch (error) {
        console.error("Failed to load recovery data from API:", error);
        // Decide how to handle - show error? Default to start button?
        alert(
          "حدث خطأ أثناء تحميل بيانات التعافي من الخادم. سيعرض المؤقت الحالة الافتراضية."
        );
        initializeTimer(null); // Default to start button on load error
      }
    } else {
      console.log("User is guest. Loading recovery data from localStorage...");
      const savedISO = localStorage.getItem("recoveryStartDate");
      if (savedISO) {
        console.log("LocalStorage: Found recovery start date:", savedISO);
        initializeTimer(savedISO);
      } else {
        console.log("LocalStorage: No recovery start date found.");
        initializeTimer(null); // No timer running
      }
    }
  }

  initialLoad(); // Run initialization on page load
});
// --- END OF FILE timer.js ---
