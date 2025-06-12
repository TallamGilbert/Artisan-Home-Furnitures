// Component Loading System
document.addEventListener('DOMContentLoaded', function() {
    // Function to load a component
    async function loadComponent(elementId, componentPath) {
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element with id "${elementId}" not found`);
                return;
            }

            // Get the current page path
            const currentPath = window.location.pathname;
            
            // Determine the correct path prefix based on the current page location
            let pathPrefix = '';
            if (currentPath.includes('/collections/')) {
                pathPrefix = '../';
            } else if (currentPath.includes('/auth/')) {
                pathPrefix = '../';
            } else if (currentPath.includes('/cart/')) {
                pathPrefix = '../';
            } else if (currentPath.includes('/checkout/')) {
                pathPrefix = '../';
            } else if (currentPath === '/index.html' || currentPath === '/') {
                pathPrefix = '/';
            } else {
                pathPrefix = '/';
            }

            // Construct the full path
            const fullPath = pathPrefix + componentPath.replace(/^\//, '');
            
            console.log('Loading component:', { elementId, componentPath, fullPath, currentPath });
            
            const response = await fetch(fullPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            element.innerHTML = html;

            // Execute any scripts in the loaded component
            const scripts = element.getElementsByTagName('script');
            for (let script of scripts) {
                const newScript = document.createElement('script');
                if (script.src) {
                    // Update script src paths
                    const scriptSrc = script.src;
                    if (scriptSrc.startsWith('/')) {
                        newScript.src = pathPrefix + scriptSrc.substring(1);
                    } else {
                        newScript.src = scriptSrc;
                    }
                } else {
                    newScript.textContent = script.textContent;
                }
                script.parentNode.replaceChild(newScript, script);
            }

            // Initialize navbar functionality after loading
            if (componentPath.includes('navbar.html')) {
                if (typeof initializeNavbar === 'function') {
                    initializeNavbar();
                }
            }
        } catch (error) {
            console.error(`Error loading ${componentPath}:`, error);
        }
    }

    // Load navbar
    loadComponent('navbar-container', 'components/navbar.html')
        .catch(error => console.error('Error loading navbar:', error));

    // Load footer
    loadComponent('footer-container', 'components/footer.html')
        .catch(error => console.error('Error loading footer:', error));

    // Load any other components
    const components = document.querySelectorAll('[data-component]');
    components.forEach(component => {
        const componentPath = component.getAttribute('data-component');
        const elementId = component.id;
        if (elementId && componentPath) {
            loadComponent(elementId, componentPath);
        }
    });
}); 