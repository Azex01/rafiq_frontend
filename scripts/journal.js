document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const journalTabs = document.querySelectorAll(".journal-tab");
  const journalSections = document.querySelectorAll(".journal-section");

  // Save buttons
  const saveGratitudeBtn = document.getElementById("save-gratitude");
  const saveRelapseBtn = document.getElementById("save-relapse");
  const saveFreeBtn = document.getElementById("save-free");
  const exportBtn = document.getElementById("export-journal");

  // Input fields
  const gratitudeInput = document.getElementById("gratitude-input");
  const relapseInput = document.getElementById("relapse-input");
  const relapseTrigger = document.getElementById("relapse-trigger");
  const relapseDate = document.getElementById("relapse-date");
  const freeInput = document.getElementById("free-input");
  const freeTitle = document.getElementById("free-title");

  // Entry containers
  const gratitudeEntries = document.getElementById("gratitude-entries");
  const relapseEntries = document.getElementById("relapse-entries");
  const freeEntries = document.getElementById("free-entries");

  // API URL for backend
  const API_URL = "https://rafiq-backend.onrender.com"; // Change this to your production API URL if needed

  // Set default date to today
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  if (relapseDate) {
    relapseDate.value = formattedDate;
  }

  function isGuest() {
    return localStorage.getItem("guest") === "true";
  }

  // Initialize journal entries
  initializeJournal();

  // Tab switching
  journalTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Update active tab
      journalTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show target section and hide others
      journalSections.forEach((section) => {
        if (section.id === `${targetTab}-section`) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
    });
  });

  // Save entry event listeners
  if (saveGratitudeBtn) {
    saveGratitudeBtn.addEventListener("click", saveGratitude);
  }

  if (saveRelapseBtn) {
    saveRelapseBtn.addEventListener("click", saveRelapse);
  }

  if (saveFreeBtn) {
    saveFreeBtn.addEventListener("click", saveFree);
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", exportJournal);
  }

  // Helper function to get auth token - FIXED: Check both token and user object
  // Helper function to get auth token - SIMPLIFIED
  function getAuthToken() {
    // Only rely on the directly stored token
    const token = localStorage.getItem("token");
    return token; // Return the token or null if not found
  }

  // الدالة للتحقق إذا كان المستخدم مسجل دخول
  function isLoggedIn() {
    // Simply check if a token exists in localStorage
    return !!localStorage.getItem("token");
    // Backend will verify if the token is actually valid
  }

  // Function to make authenticated API requests
  async function apiRequest(endpoint, method = "GET", data = null) {
    const token = getAuthToken();

    if (!token) {
      console.warn(
        "No authentication token found - user might not be logged in"
      );
      throw new Error("يرجى تسجيل الدخول أولاً");
    }

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    };

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // If unauthorized, clear token and notify
        if (response.status === 401) {
          console.error("Authentication failed - token may be expired");
        }

        throw new Error(
          errorData.message || `فشل الطلب بكود: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Function to show login prompt
  function showLoginPrompt() {
    const loginPrompt = document.createElement("div");
    loginPrompt.className = "login-prompt";
    loginPrompt.innerHTML = `
      <div class="login-prompt-content">
        <h3>تسجيل الدخول مطلوب</h3>
        <p>يرجى تسجيل الدخول لحفظ المذكرات في حسابك</p>
        <a href="login.html" class="btn login-btn">تسجيل الدخول</a>
      </div>
    `;
    document.body.appendChild(loginPrompt);

    // Remove after 5 seconds
    setTimeout(() => {
      loginPrompt.remove();
    }, 5000);
  }

  async function initializeJournal() {
    // Determine if guest or logged in
    const guestMode = isGuest(); // Assuming isGuest() function exists
    const loggedIn = isLoggedIn();

    try {
      if (loggedIn && !guestMode) {
        console.log("User is logged in, fetching entries from backend");
        const journalData = await apiRequest("/journal"); // apiRequest already uses getAuthToken()

        const entries = journalData.entries || [];
        // Filter entries by type and render them (ensure 'gratitude' is handled)
        const gratitude =
          entries.filter((entry) => entry.type === "gratitude") || [];
        const relapses =
          entries.filter((entry) => entry.type === "relapse") || [];
        const freeWriting =
          entries.filter((entry) => entry.type === "free") || [];

        renderEntries(gratitude, gratitudeEntries, renderGratitudeEntry);
        renderEntries(relapses, relapseEntries, renderRelapseEntry);
        renderEntries(freeWriting, freeEntries, renderFreeEntry);
      } else if (guestMode) {
        console.log("User is in guest mode, loading from localStorage");
        // Load ONLY from localStorage for guests
        const gratitude = window.appHelpers.getData("gratitude_entries") || [];
        const relapses = window.appHelpers.getData("relapse_entries") || [];
        const freeWriting = window.appHelpers.getData("free_entries") || [];

        renderEntries(gratitude, gratitudeEntries, renderGratitudeEntry);
        renderEntries(relapses, relapseEntries, renderRelapseEntry);
        renderEntries(freeWriting, freeEntries, renderFreeEntry);
      } else {
        // Not logged in and not a guest - show empty state or prompt login
        console.log("User not logged in and not guest. Clearing entries.");
        renderEntries([], gratitudeEntries, renderGratitudeEntry);
        renderEntries([], relapseEntries, renderRelapseEntry);
        renderEntries([], freeEntries, renderFreeEntry);
        // Optionally show a message prompting login
      }
    } catch (error) {
      // Handle API errors specifically for logged-in users
      if (loggedIn && !guestMode) {
        console.error("Failed to load journal from API:", error);
        alert(
          "حدث خطأ أثناء تحميل المذكرات من الخادم. يرجى المحاولة مرة أخرى."
        );
        // Display an error state in the UI instead of falling back to localStorage
        renderEntries([], gratitudeEntries, renderGratitudeEntry, true); // Add an error flag maybe
        renderEntries([], relapseEntries, renderRelapseEntry, true);
        renderEntries([], freeEntries, renderFreeEntry, true);
      } else {
        // Handle errors for guests (less likely unless localStorage access fails)
        console.error("Error initializing journal:", error);
      }
    }
  }

  async function saveGratitude() {
    const text = gratitudeInput.value.trim();
    if (!text) return;

    const entry = {
      type: "gratitude",
      text: text,
      date: new Date().toISOString(),
    };

    try {
      if (isGuest()) {
        // حفظ فقط في localStorage للزائر
        const entries = window.appHelpers.getData("gratitude_entries") || [];
        window.appHelpers.saveData("gratitude_entries", entries);
        await initializeJournal(); // نفس ما سويت في الدوال الأخرى
      } else if (isLoggedIn()) {
        // حفظ في السيرفر للمستخدم المسجل
        await apiRequest("/journal", "POST", entry);
        const entries = window.appHelpers.getData("gratitude_entries") || [];
        entries.unshift({ ...entry, id: Date.now() });
        window.appHelpers.saveData("gratitude_entries", entries); // حفظ محلي كنسخة احتياطية
        await initializeJournal();
      } else {
        throw new Error("User not logged in");
      }

      gratitudeInput.value = ""; // مسح المدخلات
    } catch (error) {
      console.error("Error saving gratitude entry:", error);

      // في حالة حدوث خطأ، حفظ المذكرة فقط في localStorage
      const entries = window.appHelpers.getData("gratitude_entries") || [];
      entries.unshift({ ...entry, id: Date.now() });
      window.appHelpers.saveData("gratitude_entries", entries);
      renderEntries(entries, gratitudeEntries, renderGratitudeEntry);
      if (error.message === "يرجى تسجيل الدخول أولاً") {
        showLoginPrompt();
      } else {
        alert("لم نتمكن من حفظ المذكرة في السيرفر، تم الحفظ محلياً فقط");
      }
    }
  }

  async function saveRelapse() {
    const text = relapseInput.value.trim();
    const trigger = relapseTrigger.value.trim();
    const date = relapseDate.value;

    if (!text || !date) return;

    const entry = {
      type: "relapse",
      text: text,
      trigger: trigger,
      date: date,
    };

    try {
      if (isGuest()) {
        // حفظ فقط في localStorage للزائر
        const entries = window.appHelpers.getData("relapse_entries") || [];
        entries.unshift({
          ...entry,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        });
        window.appHelpers.saveData("relapse_entries", entries);
        await initializeJournal(); // تحديث العرض
      } else if (isLoggedIn()) {
        // حفظ في السيرفر للمستخدم المسجل
        await apiRequest("/journal", "POST", entry);
        const entries = window.appHelpers.getData("relapse_entries") || [];
        entries.unshift({
          ...entry,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        });
        window.appHelpers.saveData("relapse_entries", entries); // حفظ محلي كنسخة احتياطية
        await initializeJournal();
      } else {
        throw new Error("User not logged in");
      }

      relapseInput.value = ""; // مسح المدخلات
      relapseTrigger.value = "";
      relapseDate.value = formattedDate;
    } catch (error) {
      console.error("Error saving relapse entry:", error);

      // في حالة حدوث خطأ، حفظ المذكرة فقط في localStorage
      const entries = window.appHelpers.getData("relapse_entries") || [];
      entries.unshift({
        ...entry,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });
      window.appHelpers.saveData("relapse_entries", entries);
      renderEntries(entries, relapseEntries, renderRelapseEntry);
      if (error.message === "يرجى تسجيل الدخول أولاً") {
        showLoginPrompt();
      } else {
        alert("لم نتمكن من حفظ المذكرة في السيرفر، تم الحفظ محلياً فقط");
      }
    }
  }

  async function saveFree() {
    const text = freeInput.value.trim();
    const title = freeTitle.value.trim() || "مذكرة بدون عنوان";

    if (!text) return;

    const entry = {
      type: "free",
      title: title,
      text: text,
      date: new Date().toISOString(),
    };

    try {
      if (isGuest()) {
        // حفظ فقط في localStorage للزائر
        const entries = window.appHelpers.getData("free_entries") || [];
        entries.unshift({ ...entry, id: Date.now() });
        window.appHelpers.saveData("free_entries", entries);
        await initializeJournal(); // تحديث العرض
      } else if (isLoggedIn()) {
        // حفظ في السيرفر للمستخدم المسجل
        await apiRequest("/journal", "POST", entry);
        const entries = window.appHelpers.getData("free_entries") || [];
        entries.unshift({ ...entry, id: Date.now() });
        window.appHelpers.saveData("free_entries", entries); // حفظ محلي كنسخة احتياطية
        await initializeJournal();
      } else {
        throw new Error("User not logged in");
      }

      freeInput.value = ""; // مسح المدخلات
      freeTitle.value = "";
    } catch (error) {
      console.error("Error saving free entry:", error);

      // في حالة حدوث خطأ، حفظ المذكرة فقط في localStorage
      const entries = window.appHelpers.getData("free_entries") || [];
      entries.unshift({ ...entry, id: Date.now() });
      window.appHelpers.saveData("free_entries", entries);
      renderEntries(entries, freeEntries, renderFreeEntry);
      if (error.message === "يرجى تسجيل الدخول أولاً") {
        showLoginPrompt();
      } else {
        alert("لم نتمكن من حفظ المذكرة في السيرفر، تم الحفظ محلياً فقط");
      }
    }
  }

  // Function to render entries
  function renderEntries(entries, container, renderFunction) {
    if (!container) return;

    container.innerHTML = "";

    if (entries.length === 0) {
      container.innerHTML =
        '<div class="empty-state">لا توجد مذكرات حتى الآن</div>';
      return;
    }

    entries.forEach((entry) => {
      const entryElement = renderFunction(entry);
      container.appendChild(entryElement);
    });
  }

  // Function to render a gratitude entry
  function renderGratitudeEntry(entry) {
    const entryElement = document.createElement("div");
    entryElement.classList.add("entry");
    entryElement.setAttribute("data-id", entry._id || entry.id);

    const date = new Date(entry.date);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} - ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

    entryElement.innerHTML = `
            <div class="entry-header">
                <div class="entry-date">${formattedDate}</div>
                <div class="entry-actions-menu">
                    <button class="delete-entry" data-type="gratitude" data-id="${
                      entry._id || entry.id
                    }">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="entry-text">${entry.text}</div>
        `;

    // Add delete event listener
    const deleteBtn = entryElement.querySelector(".delete-entry");
    deleteBtn.addEventListener("click", deleteEntry);

    return entryElement;
  }

  // Function to render a relapse entry
  function renderRelapseEntry(entry) {
    const entryElement = document.createElement("div");
    entryElement.classList.add("entry");
    entryElement.setAttribute("data-id", entry._id || entry.id);

    const date = new Date(entry.date);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    entryElement.innerHTML = `
            <div class="entry-header">
                <div class="entry-date">${formattedDate}</div>
                <div class="entry-actions-menu">
                    <button class="delete-entry" data-type="relapse" data-id="${
                      entry._id || entry.id
                    }">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${
              entry.trigger
                ? `<div class="entry-trigger">المحفز: ${entry.trigger}</div>`
                : ""
            }
            <div class="entry-text">${entry.text}</div>
        `;

    // Add delete event listener
    const deleteBtn = entryElement.querySelector(".delete-entry");
    deleteBtn.addEventListener("click", deleteEntry);

    return entryElement;
  }

  // Function to render a free writing entry
  function renderFreeEntry(entry) {
    const entryElement = document.createElement("div");
    entryElement.classList.add("entry");
    entryElement.setAttribute("data-id", entry._id || entry.id);

    const date = new Date(entry.date);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} - ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

    entryElement.innerHTML = `
            <div class="entry-header">
                <div class="entry-date">${formattedDate}</div>
                <div class="entry-actions-menu">
                    <button class="delete-entry" data-type="free" data-id="${
                      entry._id || entry.id
                    }">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="entry-title">${entry.title}</div>
            <div class="entry-text">${entry.text}</div>
        `;

    // Add delete event listener
    const deleteBtn = entryElement.querySelector(".delete-entry");
    deleteBtn.addEventListener("click", deleteEntry);

    return entryElement;
  }

  // Function to delete an entry
  async function deleteEntry(e) {
    const type = e.currentTarget.getAttribute("data-type");
    const id = e.currentTarget.getAttribute("data-id");

    // First try to delete from backend if it has a MongoDB ID format (24 hex chars)
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isMongoId && isLoggedIn()) {
      try {
        await apiRequest(`/journal/${id}`, "DELETE");
        // Continue with local delete after successful backend delete
      } catch (error) {
        console.error("Failed to delete from backend:", error);
        alert("فشل في حذف المذكرة من السيرفر");
        // Continue with local delete anyway
      }
    }

    // Delete from localStorage as well
    const storageKey = `${type}_entries`;
    const entries = window.appHelpers.getData(storageKey) || [];
    const numericId = parseInt(id);

    // Filter entries - handle both MongoDB ObjectIDs and numeric IDs
    const updatedEntries = entries.filter(
      (entry) =>
        String(entry._id) !== id &&
        String(entry.id) !== id &&
        entry.id !== numericId
    );

    // Save updated entries to localStorage
    window.appHelpers.saveData(storageKey, updatedEntries);

    // Update the display
    const container = document.getElementById(`${type}-entries`);
    let renderFunction;

    switch (type) {
      case "gratitude":
        renderFunction = renderGratitudeEntry;
        break;
      case "relapse":
        renderFunction = renderRelapseEntry;
        break;
      case "free":
        renderFunction = renderFreeEntry;
        break;
    }

    // Refresh from the server if possible
    try {
      await initializeJournal();
    } catch (error) {
      // If refreshing from server fails, just update local entries
      renderEntries(updatedEntries, container, renderFunction);
    }
  }

  // Function to export journal as PDF
  function exportJournal() {
    alert("سيتم تنفيذ ميزة تصدير المذكرات كملف PDF في الإصدار القادم.");
    // In a production version, this would use a library like jsPDF to generate a PDF
  }

  // Add CSS for login prompt
  const style = document.createElement("style");
  style.textContent = `
    .login-prompt {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-radius: 8px;
      z-index: 1000;
      max-width: 300px;
      border-right: 4px solid #3498db;
      animation: slideIn 0.3s forwards;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .login-prompt h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    
    .login-prompt p {
      margin: 0 0 15px 0;
      color: #666;
    }
    
    .login-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
  `;
  document.head.appendChild(style);
});
