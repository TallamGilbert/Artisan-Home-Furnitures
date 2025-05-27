// Load navbar component
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            const response = await fetch('../components/navbar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const navbarHtml = await response.text();
            navbarContainer.innerHTML = navbarHtml;
            
            // Initialize navbar functionality after loading
            if (typeof initializeNavbar === 'function') {
                initializeNavbar();
            }
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}); 