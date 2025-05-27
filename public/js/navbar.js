// Navbar initialization for all pages

// Function to initialize navbar functionality
function initializeNavbar() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    const userMenu = document.getElementById('user-menu');

    // Mobile Menu Toggle
    mobileMenuButton?.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Theme Toggle
    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update theme toggle icons
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    themeToggle?.addEventListener('click', toggleTheme);
    themeToggleMobile?.addEventListener('click', toggleTheme);

    // User Menu Toggle
    userMenuButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (userDropdown && !userMenu.contains(e.target)) {
            userDropdown.classList.add('hidden');
        }
    });

    // Prevent dropdown from closing when clicking inside it
    userDropdown?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            icon.className = 'fas fa-sun';
        });
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.getElementById('cart-count');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    
    if (cartCount) cartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
}

// Initialize user menu
function initializeUserMenu() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    const userMenu = document.getElementById('user-menu');

    if (userMenuButton && userDropdown) {
        // Toggle dropdown
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (userDropdown && !userMenu.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });

        // Prevent dropdown from closing when clicking inside
        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Initialize theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const html = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Desktop theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Mobile theme toggle
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.innerHTML = theme === 'light' 
            ? '<i class="fas fa-moon text-xl"></i>'
            : '<i class="fas fa-sun text-xl"></i>';
    }
} 