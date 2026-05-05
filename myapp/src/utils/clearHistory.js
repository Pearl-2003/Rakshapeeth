// src/utils/clearHistory.js
export const logoutAndClearHistory = (role, navigate) => {
  // Clear auth data
  localStorage.removeItem(`${role}Token`);
  localStorage.removeItem("role");
  
  if (role === "parent") {
    localStorage.removeItem("parentEmail");
  } else if (role === "guard") {
    localStorage.removeItem("guardId");
  }
  
  // Clear any other stored data
  localStorage.removeItem("avatar");
  localStorage.removeItem("userPhoto");
  
  // Navigate and replace history
  navigate("/login", { replace: true });
  
  // Prevent going back
  window.history.pushState(null, null, "/login");
  window.addEventListener("popstate", function() {
    window.history.pushState(null, null, "/login");
  });
};