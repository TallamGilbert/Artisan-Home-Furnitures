// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'auth/login.html';
        return;
    }

    const currentUser = JSON.parse(user);
    updateProfileUI(currentUser);
    setupEventListeners();
});

// Update profile UI with user data
function updateProfileUI(user) {
    // Update user info in sidebar
    document.querySelector('.user-name').textContent = user.name;
    document.querySelector('.user-email').textContent = user.email;

    // Update profile form
    const form = document.getElementById('profile-form');
    form.querySelector('[name="firstName"]').value = user.firstName || '';
    form.querySelector('[name="lastName"]').value = user.lastName || '';
    form.querySelector('[name="email"]').value = user.email || '';
    form.querySelector('[name="phone"]').value = user.phone || '';

    // Update notification preferences
    if (user.preferences) {
        document.getElementById('email-notifications').checked = user.preferences.emailNotifications || false;
        document.getElementById('sms-notifications').checked = user.preferences.smsNotifications || false;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', handleProfileUpdate);

    // Settings form submission
    const settingsForm = document.querySelector('#settings form');
    settingsForm.addEventListener('submit', handleSettingsUpdate);

    // Navigation links
    const navLinks = document.querySelectorAll('.sidebar nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Check for hash in URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
}

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    try {
        // Here you would typically make an API call to update the user data
        // For demo purposes, we'll update the local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Update UI
        updateProfileUI(updatedUser);
        showNotification('Profile updated successfully');
    } catch (error) {
        showNotification('Failed to update profile', 'error');
    }
}

// Handle settings update
async function handleSettingsUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settingsData = {
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword'),
        preferences: {
            emailNotifications: document.getElementById('email-notifications').checked,
            smsNotifications: document.getElementById('sms-notifications').checked
        }
    };

    try {
        // Here you would typically make an API call to update the settings
        // For demo purposes, we'll update the local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const updatedUser = { 
            ...currentUser, 
            preferences: settingsData.preferences 
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        showNotification('Settings updated successfully');
    } catch (error) {
        showNotification('Failed to update settings', 'error');
    }
}

// Show selected section
function showSection(sectionId) {
    // Hide all sections
    const sections = ['profile', 'orders', 'wishlist', 'addresses', 'settings'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('hidden');
        }
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.sidebar nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('bg-primary', 'text-white');
            link.classList.remove('text-gray-700', 'hover:bg-gray-50');
        } else {
            link.classList.remove('bg-primary', 'text-white');
            link.classList.add('text-gray-700', 'hover:bg-gray-50');
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 