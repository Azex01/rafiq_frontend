// Journal functionality
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

  // Set default date to today
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  if (relapseDate) {
    relapseDate.value = formattedDate;
  }

  // Initialize journal entries from localStorage
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

  // Function to initialize journal from localStorage
  function initializeJournal() {
    // Load gratitude entries
    const gratitude = window.appHelpers.getData("gratitude_entries") || [];
    renderEntries(gratitude, gratitudeEntries, renderGratitudeEntry);

    // Load relapse entries
    const relapses = window.appHelpers.getData("relapse_entries") || [];
    renderEntries(relapses, relapseEntries, renderRelapseEntry);

    // Load free writing entries
    const freeWriting = window.appHelpers.getData("free_entries") || [];
    renderEntries(freeWriting, freeEntries, renderFreeEntry);
  }

  // Function to save gratitude entry
  function saveGratitude() {
    const text = gratitudeInput.value.trim();
    if (!text) return;

    const entry = {
      id: Date.now(),
      text: text,
      date: new Date().toISOString(),
    };

    // Get existing entries
    const entries = window.appHelpers.getData("gratitude_entries") || [];
    entries.unshift(entry); // Add new entry at the beginning

    // Save to localStorage
    window.appHelpers.saveData("gratitude_entries", entries);

    // Clear input
    gratitudeInput.value = "";

    // Refresh entries display
    renderEntries(entries, gratitudeEntries, renderGratitudeEntry);
  }

  // Function to save relapse entry
  function saveRelapse() {
    const text = relapseInput.value.trim();
    const trigger = relapseTrigger.value.trim();
    const date = relapseDate.value;

    if (!text || !date) return;

    const entry = {
      id: Date.now(),
      text: text,
      trigger: trigger,
      date: date,
      createdAt: new Date().toISOString(),
    };

    // Get existing entries
    const entries = window.appHelpers.getData("relapse_entries") || [];
    entries.unshift(entry); // Add new entry at the beginning

    // Save to localStorage
    window.appHelpers.saveData("relapse_entries", entries);

    // Clear inputs
    relapseInput.value = "";
    relapseTrigger.value = "";
    relapseDate.value = formattedDate;

    // Refresh entries display
    renderEntries(entries, relapseEntries, renderRelapseEntry);
  }

  // Function to save free writing entry
  function saveFree() {
    const text = freeInput.value.trim();
    const title = freeTitle.value.trim() || "مذكرة بدون عنوان";

    if (!text) return;

    const entry = {
      id: Date.now(),
      title: title,
      text: text,
      date: new Date().toISOString(),
    };

    // Get existing entries
    const entries = window.appHelpers.getData("free_entries") || [];
    entries.unshift(entry); // Add new entry at the beginning

    // Save to localStorage
    window.appHelpers.saveData("free_entries", entries);

    // Clear inputs
    freeInput.value = "";
    freeTitle.value = "";

    // Refresh entries display
    renderEntries(entries, freeEntries, renderFreeEntry);
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
    entryElement.setAttribute("data-id", entry.id);

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
                    <button class="delete-entry" data-type="gratitude" data-id="${entry.id}">
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
    entryElement.setAttribute("data-id", entry.id);

    const date = new Date(entry.date);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    entryElement.innerHTML = `
            <div class="entry-header">
                <div class="entry-date">${formattedDate}</div>
                <div class="entry-actions-menu">
                    <button class="delete-entry" data-type="relapse" data-id="${
                      entry.id
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
    entryElement.setAttribute("data-id", entry.id);

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
                    <button class="delete-entry" data-type="free" data-id="${entry.id}">
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
  function deleteEntry(e) {
    const type = e.currentTarget.getAttribute("data-type");
    const id = parseInt(e.currentTarget.getAttribute("data-id"));

    // Get storage key based on type
    const storageKey = `${type}_entries`;

    // Get entries from localStorage
    const entries = window.appHelpers.getData(storageKey) || [];

    // Filter out the entry to delete
    const updatedEntries = entries.filter((entry) => entry.id !== id);

    // Save updated entries
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

    renderEntries(updatedEntries, container, renderFunction);
  }

  // Function to export journal as PDF
  function exportJournal() {
    alert("سيتم تنفيذ ميزة تصدير المذكرات كملف PDF في الإصدار القادم.");
    // In a production version, this would use a library like jsPDF to generate a PDF
  }
});
