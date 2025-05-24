// Navbar initialization for all pages
document.addEventListener('DOMContentLoaded', () => {
    // Load navbar and footer components
    loadComponent('navbar-container', getComponentPath('navbar.html'));
    loadComponent('footer-container', getComponentPath('footer.html'));

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
        if (window.innerWidth >= 768) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
        }
    });
});

// Function to determine the correct path to components based on current page
function getComponentPath(componentName) {
    const currentPath = window.location.pathname;
    const isInCollections = currentPath.includes('/collections/');
    const isInAuth = currentPath.includes('/auth/');
    const isInCart = currentPath.includes('/cart/');
    const isInCheckout = currentPath.includes('/checkout/');
    
    // Determine how many levels deep we are from the root
    let levelsDeep = 0;
    if (isInCollections || isInAuth || isInCart || isInCheckout) {
        levelsDeep = 1;
    }
    
    // Build the path with appropriate number of parent directory references
    return '../'.repeat(levelsDeep) + 'components/' + componentName;
}

// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Initialize navbar functionality after loading
        if (componentPath.includes('navbar.html')) {
            initializeNavbar();
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

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
            ? '<i class="fas fa-moon mr-2"></i> Toggle Dark Mode'
            : '<i class="fas fa-sun mr-2"></i> Toggle Light Mode';
    }
} 