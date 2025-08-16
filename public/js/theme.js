// Theme handling functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Theme script loaded');
    
    // Get theme toggle buttons
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    // Function to update theme icons
    function updateThemeIcons(isDark) {
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            // Check if this is the mobile icon (has text-xl class)
            const isMobile = icon.classList.contains('text-xl');
            icon.className = isDark ? 
                (isMobile ? 'fas fa-sun text-xl' : 'fas fa-sun') : 
                (isMobile ? 'fas fa-moon text-xl' : 'fas fa-moon');
        });
    }

    // Function to set theme
    function setTheme(isDark) {
        console.log('Setting theme:', isDark ? 'dark' : 'light');
        
        // Force immediate DOM update by using requestAnimationFrame
        requestAnimationFrame(() => {
            // Add/remove dark class to body
            if (isDark) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
            
            // Update theme toggle icons immediately
            updateThemeIcons(isDark);
        });
        
        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Function to toggle theme
    function toggleTheme(event) {
        // Prevent any default behavior
        event.preventDefault();
        event.stopPropagation();
        
        const isDark = document.body.classList.contains('dark-theme');
        setTheme(!isDark);
    }

    // Add click event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // Initialize theme on page load
    function initializeTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            setTheme(isDark);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark);
        }
    }

    // Initialize theme immediately
    initializeTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });
});