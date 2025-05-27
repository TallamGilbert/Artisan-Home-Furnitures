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

            const response = await fetch(componentPath);
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
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                script.parentNode.replaceChild(newScript, script);
            }
        } catch (error) {
            console.error(`Error loading ${componentPath}:`, error);
        }
    }

    // Load navbar
    loadComponent('navbar-container', '/components/navbar.html')
        .catch(error => console.error('Error loading navbar:', error));

    // Load footer
    loadComponent('footer-container', '/components/footer.html')
        .catch(error => console.error('Error loading footer:', error));

    // Load any other components
    const components = document.querySelectorAll('[data-component]');
    components.forEach(component => {
        const path = component.getAttribute('data-component');
        if (path) {
            loadComponent(component.id, path)
                .catch(error => console.error(`Error loading component ${path}:`, error));
        }
    });
}); 