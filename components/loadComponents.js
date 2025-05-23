// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        // Get the current directory path
        const currentPath = window.location.pathname;
        const isInCollections = currentPath.includes('/collections/');
        
        // Adjust path based on current location
        const adjustedPath = isInCollections ? '../' + componentPath : '/' + componentPath;
        
        const response = await fetch(adjustedPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        
        // Update paths in the loaded HTML
        const updatedHtml = html.replace(/href="\/([^"]+)"/g, (match, path) => {
            return isInCollections ? `href="../${path}"` : match;
        }).replace(/src="\/([^"]+)"/g, (match, path) => {
            return isInCollections ? `src="../${path}"` : match;
        });
        
        document.getElementById(elementId).innerHTML = updatedHtml;
        
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

    // Initialize cart count
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.getElementById('cart-count');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    
    if (cartCount) cartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
}

// Load components when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load navbar
    loadComponent('navbar-container', 'components/navbar.html');
    
    // Load footer
    loadComponent('footer-container', 'components/footer.html');
}); 