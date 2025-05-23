// User menu functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
        const currentUser = JSON.parse(user);
        updateUIForLoggedInUser(currentUser);
    }

    // Setup user menu button click handler
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }

    // Setup mobile menu button
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const authLinks = document.querySelectorAll('.auth-link');
    const userMenus = document.querySelectorAll('.user-menu');
    const userNameElements = document.querySelectorAll('.user-name');
    
    authLinks.forEach(link => {
        link.style.display = 'none';
    });
    
    userMenus.forEach(menu => {
        menu.classList.remove('hidden');
    });
    
    userNameElements.forEach(element => {
        element.textContent = user.name || `${user.firstName} ${user.lastName}`;
    });
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth/login.html';
} 