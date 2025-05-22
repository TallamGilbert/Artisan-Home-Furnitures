// User authentication state
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateUIForLoggedInUser();
    }
}

// Update UI elements for logged in user
function updateUIForLoggedInUser() {
    const authLinks = document.querySelectorAll('.auth-link');
    const userMenu = document.querySelector('.user-menu');
    
    if (currentUser) {
        authLinks.forEach(link => {
            link.style.display = 'none';
        });
        if (userMenu) {
            userMenu.style.display = 'block';
            const userNameElement = userMenu.querySelector('.user-name');
            if (userNameElement) {
                userNameElement.textContent = currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`;
            }
        }
    } else {
        authLinks.forEach(link => {
            link.style.display = 'block';
        });
        if (userMenu) {
            userMenu.style.display = 'none';
        }
    }
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // Here you would typically make an API call to your backend
            // For demo purposes, we'll simulate a successful login
            const user = {
                firstName: 'Demo',
                lastName: 'User',
                email: email,
                phone: '+254 711 222 333',
                preferences: {
                    emailNotifications: true,
                    smsNotifications: false
                },
                token: 'demo-token-' + Math.random()
            };
            
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUser = user;
            
            // Redirect to home page
            window.location.href = '../index.html';
        } catch (error) {
            alert('Login failed. Please check your credentials.');
        }
    });
}

// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        try {
            // Here you would typically make an API call to your backend
            // For demo purposes, we'll simulate a successful registration
            const [firstName, ...lastNameParts] = fullName.split(' ');
            const lastName = lastNameParts.join(' ');
            
            const user = {
                firstName,
                lastName,
                email,
                phone: '',
                preferences: {
                    emailNotifications: true,
                    smsNotifications: false
                },
                token: 'demo-token-' + Math.random()
            };
            
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUser = user;
            
            // Redirect to home page
            window.location.href = '../index.html';
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    });
}

// Handle logout
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateUIForLoggedInUser();
    window.location.href = 'login.html';
}

// Initialize auth state
document.addEventListener('DOMContentLoaded', checkAuth); 