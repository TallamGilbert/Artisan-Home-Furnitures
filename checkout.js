// Initialize order data
let orderData = {
    shipping: {},
    payment: {},
    items: [],
    totals: {}
};

// Handle shipping form submission
document.getElementById('shipping-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect shipping information
    const formData = new FormData(this);
    orderData.shipping = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        country: formData.get('country'),
        instructions: formData.get('instructions')
    };
    
    // Hide shipping form and show payment form
    this.classList.add('hidden');
    document.getElementById('payment-form').classList.remove('hidden');
    
    // Update progress steps
    updateProgressSteps(2);
});

// Handle payment form submission
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect payment information
    const formData = new FormData(this);
    orderData.payment = {
        cardNumber: formData.get('cardNumber'),
        expiry: formData.get('expiry'),
        cvv: formData.get('cvv'),
        cardName: formData.get('cardName')
    };
    
    // Process order
    processOrder();
});

// Go back to shipping form
window.goBackToShipping = function() {
    document.getElementById('payment-form').classList.add('hidden');
    document.getElementById('shipping-form').classList.remove('hidden');
    updateProgressSteps(1);
};

// Update progress steps
function updateProgressSteps(step) {
    const progressSteps = document.querySelector('.flex.items-center.justify-between.mb-8');
    if (!progressSteps) return;

    const steps = progressSteps.querySelectorAll('.flex.items-center');
    const lines = progressSteps.querySelectorAll('.flex-1.h-0\\.5');
    
    steps.forEach((stepElement, index) => {
        const circle = stepElement.querySelector('.w-8');
        const text = stepElement.querySelector('.text-sm');
        
        if (!circle || !text) return;
        
        if (index < step) {
            // Completed steps
            circle.classList.remove('bg-gray-200', 'text-gray-600');
            circle.classList.add('bg-primary', 'text-white');
            text.classList.remove('text-gray-600');
            text.classList.add('text-primary');
        } else if (index === step) {
            // Current step
            circle.classList.remove('bg-gray-200', 'text-gray-600');
            circle.classList.add('bg-primary', 'text-white');
            text.classList.remove('text-gray-600');
            text.classList.add('text-primary');
        } else {
            // Upcoming steps
            circle.classList.remove('bg-primary', 'text-white');
            circle.classList.add('bg-gray-200', 'text-gray-600');
            text.classList.remove('text-primary');
            text.classList.add('text-gray-600');
        }
    });

    // Update connecting lines
    lines.forEach((line, index) => {
        if (index < step - 1) {
            // Completed lines
            line.classList.remove('bg-gray-200');
            line.classList.add('bg-primary');
        } else {
            // Upcoming lines
            line.classList.remove('bg-primary');
            line.classList.add('bg-gray-200');
        }
    });
}

// Process order
function processOrder() {
    try {
        // Get cart items and totals
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            throw new Error('Cart is empty');
        }

        orderData.items = cart;
        orderData.totals = calculateTotals(cart);
        
        // Save order to localStorage
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Hide payment form and show confirmation
        document.getElementById('payment-form').classList.add('hidden');
        document.getElementById('confirmation-step').classList.remove('hidden');
        
        // Update progress steps to show completion
        updateProgressSteps(3);
        
        // Update confirmation details
        updateConfirmationDetails();
        
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = 'Order placed successfully!';
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    } catch (error) {
        console.error('Error processing order:', error);
        // Show error message
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = error.message || 'Error processing order. Please try again.';
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Update confirmation details
function updateConfirmationDetails() {
    // Generate order number
    const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Update shipping information
    const shippingInfo = document.getElementById('confirmation-shipping');
    if (shippingInfo) {
        shippingInfo.innerHTML = `
            <p>${orderData.shipping.firstName} ${orderData.shipping.lastName}</p>
            <p>${orderData.shipping.address}</p>
            <p>${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zip}</p>
            <p>${orderData.shipping.country}</p>
            <p>Phone: ${orderData.shipping.phone}</p>
            <p>Email: ${orderData.shipping.email}</p>
            ${orderData.shipping.instructions ? `<p class="mt-2">Delivery Instructions: ${orderData.shipping.instructions}</p>` : ''}
        `;
    }
    
    // Update payment information
    const paymentInfo = document.getElementById('confirmation-payment');
    if (paymentInfo) {
        paymentInfo.innerHTML = `
            <p>Order Number: ${orderNumber}</p>
            <p>Card: **** **** **** ${orderData.payment.cardNumber.slice(-4)}</p>
            <p>Name on Card: ${orderData.payment.cardName}</p>
            <p>Expiry: ${orderData.payment.expiry}</p>
        `;
    }
}

// Calculate totals
function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 1000 : 0; // KSh 1000 shipping fee
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + shipping + tax;
    
    return {
        subtotal,
        shipping,
        tax,
        total
    };
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    // Load cart items into order summary
    const orderItemsContainer = document.getElementById('order-items');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (orderItemsContainer && cart.length > 0) {
        orderItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between py-2">
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                    <div class="ml-4">
                        <h4 class="text-sm font-medium text-primary-dark">${item.name}</h4>
                        <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
                    </div>
                </div>
                <p class="text-sm font-medium text-primary-dark">KSh ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `).join('');
        
        // Update order summary totals
        const totals = calculateTotals(cart);
        document.getElementById('subtotal').textContent = `KSh ${Number(totals.subtotal).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('shipping').textContent = `KSh ${Number(totals.shipping).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('tax').textContent = `KSh ${Number(totals.tax).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('total').textContent = `KSh ${Number(totals.total).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    } else {
        // Show empty cart message
        orderItemsContainer.innerHTML = `
            <div class="text-center py-4">
                <p class="text-gray-600">Your cart is empty</p>
                <a href="index.html" class="text-primary hover:text-primary-dark mt-2 inline-block">Continue Shopping</a>
            </div>
        `;
    }

    // Initialize progress steps
    updateProgressSteps(1);
}); 