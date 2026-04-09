// Swagger UI Theme Toggle Script
// This script runs on the Swagger UI page and adds a dark/light theme toggle button

(function() {
  // Get saved theme preference from localStorage
  const savedTheme = localStorage.getItem('swagger-theme') || 'light';
  
  // Apply saved theme on page load
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Wait for page to fully load, then add toggle button
  window.addEventListener('load', function() {
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.textContent = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    toggleBtn.id = 'theme-toggle';
    
    // Add button to page
    document.body.appendChild(toggleBtn);
    
    // Toggle theme on button click
    toggleBtn.addEventListener('click', function() {
      const isDarkMode = document.body.classList.toggle('dark-mode');
      const newTheme = isDarkMode ? 'dark' : 'light';
      
      // Update button text
      toggleBtn.textContent = isDarkMode ? '☀️ Light' : '🌙 Dark';
      
      // Save preference
      localStorage.setItem('swagger-theme', newTheme);
    });
  });
})();
