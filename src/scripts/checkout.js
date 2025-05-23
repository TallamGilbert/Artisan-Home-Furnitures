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

// Checkout functionality
document.addEventListener('DOMContentLoaded', () => {
    const orderSummary = document.getElementById('order-summary');
    const orderTotal = document.getElementById('order-total');
    const checkoutForm = document.getElementById('checkout-form');
    const paymentMethod = document.getElementById('payment-method');
    const mpesaDetails = document.getElementById('mpesa-details');
    const cardDetails = document.getElementById('card-details');
    
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update order summary
    function updateOrderSummary() {
        if (!orderSummary) return;
        
        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        // Calculate total
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 1000; // Fixed shipping cost
        const total = subtotal + shipping;
        
        // Update order summary
        orderSummary.innerHTML = cart.map(item => `
            <div class="flex justify-between py-2">
                <div>
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
                </div>
                <p class="font-medium">KSh ${(item.price * item.quantity).toLocaleString()}</p>
            </div>
        `).join('') + `
            <div class="border-t border-gray-200 my-4"></div>
            <div class="flex justify-between py-2">
                <p>Subtotal</p>
                <p>KSh ${subtotal.toLocaleString()}</p>
            </div>
            <div class="flex justify-between py-2">
                <p>Shipping</p>
                <p>KSh ${shipping.toLocaleString()}</p>
            </div>
            <div class="border-t border-gray-200 my-4"></div>
            <div class="flex justify-between py-2 font-medium">
                <p>Total</p>
                <p>KSh ${total.toLocaleString()}</p>
            </div>
        `;
        
        if (orderTotal) orderTotal.textContent = `KSh ${total.toLocaleString()}`;
    }
    
    // Toggle payment method details
    paymentMethod?.addEventListener('change', () => {
        if (paymentMethod.value === 'mpesa') {
            mpesaDetails?.classList.remove('hidden');
            cardDetails?.classList.add('hidden');
        } else if (paymentMethod.value === 'card') {
            mpesaDetails?.classList.add('hidden');
            cardDetails?.classList.remove('hidden');
        }
    });
    
    // Handle form submission
    checkoutForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(checkoutForm);
        const orderData = {
            customer: {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                postalCode: formData.get('postal-code')
            },
            payment: {
                method: formData.get('payment-method'),
                details: paymentMethod.value === 'mpesa' ? {
                    phone: formData.get('mpesa-phone')
                } : {
                    cardNumber: formData.get('card-number'),
                    expiry: formData.get('card-expiry'),
                    cvv: formData.get('card-cvv')
                }
            },
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 1000
        };
        
        // Here you would typically send the order data to your backend
        console.log('Order data:', orderData);
        
        // Show success message
        showNotification('Order placed successfully!');
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to confirmation page
        setTimeout(() => {
            window.location.href = 'confirmation.html';
        }, 2000);
    });
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Initialize order summary
    updateOrderSummary();
}); 