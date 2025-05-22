// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const userMenuButton = document.getElementById('user-menu-button');
const userDropdown = document.getElementById('user-dropdown');
const userMenu = document.getElementById('user-menu');
const backToTopButton = document.getElementById('backToTop');
const chatButton = document.getElementById('chatButton');
const testimonialWrapper = document.getElementById('testimonial-wrapper');
const prevTestimonial = document.getElementById('prev-testimonial');
const nextTestimonial = document.getElementById('next-testimonial');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const cityFilter = document.getElementById('city-filter');
const storeItems = document.querySelectorAll('.store-item');

// Mobile Menu Toggle
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

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

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}

// User Menu Toggle
if (userMenuButton && userDropdown) {
    userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });
}

// Close dropdown when clicking outside
if (userDropdown && userMenu) {
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

// Back to Top Button
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Chat Button
if (chatButton) {
    chatButton.addEventListener('click', () => {
        // Implement chat functionality
        alert('Chat feature coming soon!');
    });
}

// Testimonial Slider
if (testimonialWrapper && testimonialDots.length > 0) {
    let currentTestimonial = 0;
    const testimonialCount = document.querySelectorAll('.testimonial-card').length;

    function updateTestimonialSlider() {
        const offset = -currentTestimonial * 100;
        testimonialWrapper.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        testimonialDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonial);
        });
    }

    if (prevTestimonial) {
        prevTestimonial.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonialCount) % testimonialCount;
            updateTestimonialSlider();
        });
    }

    if (nextTestimonial) {
        nextTestimonial.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCount;
            updateTestimonialSlider();
        });
    }

    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            updateTestimonialSlider();
        });
    });
}

// Store Locator Filter
if (cityFilter && storeItems.length > 0) {
    cityFilter.addEventListener('change', (e) => {
        const selectedCity = e.target.value;
        
        // Update store visibility
        storeItems.forEach(item => {
            if (selectedCity === 'all' || item.dataset.city === selectedCity) {
                item.style.display = 'block';
                item.classList.add('bg-white');
                item.classList.remove('bg-gray-100');
            } else {
                item.style.display = 'none';
            }
        });

        // Update map based on selected city
        const mapFrame = document.querySelector('#store-map');
        if (mapFrame) {
            // Add fade out effect
            mapFrame.style.opacity = '0';
            mapFrame.style.transition = 'opacity 0.3s ease-in-out';

            // City coordinates and zoom levels
            const cityCoordinates = {
                'nairobi': { lat: -1.2921, lng: 36.8219, zoom: 12 },
                'mombasa': { lat: -4.0435, lng: 39.6682, zoom: 12 },
                'kisumu': { lat: -0.1006, lng: 34.7285, zoom: 12 },
                'nakuru': { lat: -0.2976, lng: 36.0625, zoom: 12 },
                'eldoret': { lat: 0.5167, lng: 35.2697, zoom: 12 },
                'thika': { lat: -1.0234, lng: 37.2249, zoom: 12 },
                'nanyuki': { lat: -0.6879, lng: 37.2532, zoom: 12 }
            };

            let mapUrl;
            if (selectedCity === 'all') {
                // First zoom out to show all of Kenya
                mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8191673767!2d37.9062!3d0.0236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d5a0c0c0c1%3A0x1c0c0c0c0c0c0c0c!2sKenya!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske`;
            } else {
                const coords = cityCoordinates[selectedCity];
                if (coords) {
                    const cityName = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);
                    // First zoom out slightly, then zoom in to the city
                    mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8191673767!2d${coords.lng}!3d${coords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d5a0c0c0c1%3A0x1c0c0c0c0c0c0c0c!2s${encodeURIComponent(cityName)}!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske`;
                }
            }

            if (mapUrl) {
                // Wait for fade out, then update map and fade in
                setTimeout(() => {
                    mapFrame.src = mapUrl;
                    // Add fade in effect
                    mapFrame.style.opacity = '1';
                }, 300);
            }
        }
    });

    // Add click handler for store items
    storeItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove highlight from all items
            storeItems.forEach(store => {
                store.classList.remove('bg-gray-100');
                store.classList.add('bg-white');
            });
            
            // Add highlight to clicked item
            item.classList.remove('bg-white');
            item.classList.add('bg-gray-100');
            
            // Update map to show the specific store
            const mapFrame = document.querySelector('#store-map');
            if (mapFrame && item.dataset.lat && item.dataset.lng) {
                // Add fade out effect
                mapFrame.style.opacity = '0';
                mapFrame.style.transition = 'opacity 0.3s ease-in-out';

                const storeName = item.querySelector('h4').textContent;
                const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8191673767!2d${item.dataset.lng}!3d${item.dataset.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d5a0c0c0c1%3A0x1c0c0c0c0c0c0c0c!2s${encodeURIComponent(storeName)}!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske`;
                
                // Wait for fade out, then update map and fade in
                setTimeout(() => {
                    mapFrame.src = mapUrl;
                    // Add fade in effect
                    mapFrame.style.opacity = '1';
                }, 300);
            }
        });
    });
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            icon.className = 'fas fa-sun';
        });
    }
}); 