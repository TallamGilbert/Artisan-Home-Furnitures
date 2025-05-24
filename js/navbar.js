// Navbar initialization for all pages
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navbar functionality
    initializeNavbar();

    // Initialize cart count
    updateCartCount();

    // Initialize user menu
    initializeUserMenu();

    // Initialize theme toggle
    initializeThemeToggle();

    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const bottomNavLinks = document.querySelectorAll('.mobile-bottom-nav a');

    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
        }
    });

    // Handle bottom navigation active states
    bottomNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links
            bottomNavLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
        });
    });

    // Set active state based on current page
    function setActiveNavItem() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        bottomNavLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || linkPath === currentPath + currentHash) {
                link.classList.add('active');
            }
        });
    }

    // Call on page load
    setActiveNavItem();

    // Update active state on hash change
    window.addEventListener('hashchange', setActiveNavItem);

    // Handle scroll behavior for mobile
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    const bottomNav = document.querySelector('.mobile-bottom-nav');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
            bottomNav.style.transform = 'translateY(100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            bottomNav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');
            }
        });
    });

    // Handle resize events
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
        }
    });
});

// Function to initialize navbar functionality
function initializeNavbar() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const bottomNavLinks = document.querySelectorAll('.mobile-bottom-nav a');
    const navbar = document.getElementById('navbar');
    const bottomNav = document.querySelector('.mobile-bottom-nav');

    // Toggle mobile menu
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');
            }
        });
    }

    // Handle bottom navigation active states
    if (bottomNavLinks.length > 0) {
        bottomNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all links
                bottomNavLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
            });
        });

        // Set active state based on current page
        function setActiveNavItem() {
            const currentPath = window.location.pathname;
            const currentHash = window.location.hash;
            
            bottomNavLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                if (linkPath === currentPath || linkPath === currentPath + currentHash) {
                    link.classList.add('active');
                }
            });
        }

        // Call on page load
        setActiveNavItem();

        // Update active state on hash change
        window.addEventListener('hashchange', setActiveNavItem);
    }

    // Handle scroll behavior for mobile
    if (navbar && bottomNav) {
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
                bottomNav.style.transform = 'translateY(100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
                bottomNav.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });

    // Handle resize events
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
        }
    });
}

// Function to update cart count
function updateCartCount() {
    const cartCount = localStorage.getItem('cartCount') || '0';
    const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count, #tablet-cart-count');
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = cartCount;
        }
    });
}

// Function to initialize user menu
function initializeUserMenu() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    const userMenu = document.getElementById('user-menu');

    if (userMenuButton && userDropdown && userMenu) {
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });

        // Prevent dropdown from closing when clicking inside it
        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Function to initialize theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark ? 'dark' : 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon('dark');
    }
}

// Function to update theme icon
function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('.theme-toggle i');
    themeIcons.forEach(icon => {
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
} 