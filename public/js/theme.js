// Theme handling functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Theme script loaded');
    
    // Get theme toggle buttons
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    // Function to set theme
    function setTheme(isDark) {
        console.log('Setting theme:', isDark ? 'dark' : 'light');
        
        // Add dark class to body
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update theme toggle icons
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // Function to toggle theme
    function toggleTheme(event) {
        const isDark = document.body.classList.contains('dark-theme');
        setTheme(!isDark);
    }

    // Add click event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
        // Update theme icon - mobile
        const icon = themeToggleMobile.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun text-xl' : 'fas fa-moon text-xl';
        }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });
}); 