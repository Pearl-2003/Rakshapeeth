// src/utils/auth.js
export const logout = (role) => {
  localStorage.removeItem(`${role}Token`);
  
  // Only remove if it exists (optional)
  if (localStorage.getItem(`${role}LoggedIn`)) {
    localStorage.removeItem(`${role}LoggedIn`);
  }
  
  window.location.replace("/login"); // forces a full reload
};