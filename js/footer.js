// Load footer component
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            const response = await fetch('/components/footer.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const footerHtml = await response.text();
            footerContainer.innerHTML = footerHtml;
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}); 