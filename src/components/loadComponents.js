// Function to load components
async function loadComponent(componentPath, containerId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Function to initialize navbar functionality
function initializeNavbar() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    const userMenu = document.getElementById('user-menu');

    // Mobile Menu Toggle
    mobileMenuButton?.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

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
}

// Load navbar and footer when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get the current page path
    const currentPath = window.location.pathname;
    
    // Determine the correct path prefix based on the current page location
    let pathPrefix = '';
    if (currentPath.includes('/src/pages/')) {
        pathPrefix = '../';
    } else if (currentPath.includes('/collections/')) {
        pathPrefix = '../src/';
    } else if (currentPath.includes('/auth/')) {
        pathPrefix = '../src/';
    } else if (currentPath.includes('/cart/')) {
        pathPrefix = '../src/';
    } else if (currentPath.includes('/checkout/')) {
        pathPrefix = '../src/';
    } else {
        pathPrefix = 'src/';
    }

    // Load navbar
    loadComponent(`${pathPrefix}components/navbar.html`, 'navbar-container');
    
    // Load footer
    loadComponent(`${pathPrefix}components/footer.html`, 'footer-container');
}); 