// Main application script
document.addEventListener("DOMContentLoaded", function () {
  // Navigation between views
  const navItems = document.querySelectorAll(".main-nav li");
  const views = document.querySelectorAll(".view");

  // Add click event for navigation items
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const targetView = this.getAttribute("data-view");

      // Update active navigation item
      navItems.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");

      // Show target view and hide others
      views.forEach((view) => {
        if (view.id === `${targetView}-view`) {
          view.classList.add("active-view");
        } else {
          view.classList.remove("active-view");
        }
      });
    });
  });

  // Check for saved data on page load
  loadSavedData();

  // Function to save data to localStorage
  function saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  // Function to get data from localStorage
  function getData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error retrieving data:", error);
      return null;
    }
  }

  // Function to load all saved data
  function loadSavedData() {
    // This will be implemented in each component's script
    // Just a placeholder here for structure
  }

  // Make these functions available globally
  window.appHelpers = {
    saveData,
    getData,
  };
});
