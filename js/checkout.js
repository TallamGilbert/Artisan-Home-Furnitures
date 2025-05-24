// Checkout functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart if not already initialized
    if (!window.cart) {
        window.cart = new Cart();
    }

    // Check if cart is empty
    if (window.cart.items.length === 0) {
        showEmptyCartMessage();
        return;
    }

    // Render order summary
    renderOrderSummary();

    // Handle shipping form submission
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateShippingForm()) {
                showPaymentForm();
            }
        });
    }

    // Handle payment form submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validatePaymentForm()) {
                processOrder();
            }
        });

        // Add input formatting
        const cardNumberInput = paymentForm.querySelector('input[name="cardNumber"]');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 16) value = value.slice(0, 16);
                e.target.value = value;
            });
        }

        const expiryInput = paymentForm.querySelector('input[name="expiry"]');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            });
        }

        const cvvInput = paymentForm.querySelector('input[name="cvv"]');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 3) value = value.slice(0, 3);
                e.target.value = value;
            });
        }
    }
});

// Show empty cart message
function showEmptyCartMessage() {
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (emptyCartMessage && checkoutForm) {
        emptyCartMessage.classList.remove('hidden');
        checkoutForm.classList.add('hidden');
    }
}

// Validate shipping form
function validateShippingForm() {
    const form = document.getElementById('shipping-form');
    if (!form) return false;

    const phone = form.querySelector('input[name="phone"]');
    const zip = form.querySelector('input[name="zip"]');
    
    // Validate phone number (10 digits)
    if (!/^[0-9]{10}$/.test(phone.value)) {
        showError(phone, 'Please enter a valid 10-digit phone number');
        return false;
    }
    
    // Validate ZIP code (5 digits)
    if (!/^[0-9]{5}$/.test(zip.value)) {
        showError(zip, 'Please enter a valid 5-digit ZIP code');
        return false;
    }
    
    return true;
}

// Validate payment form
function validatePaymentForm() {
    const form = document.getElementById('payment-form');
    if (!form) return false;

    const cardNumber = form.querySelector('input[name="cardNumber"]');
    const expiry = form.querySelector('input[name="expiry"]');
    const cvv = form.querySelector('input[name="cvv"]');
    
    // Validate card number (16 digits)
    if (!/^[0-9]{16}$/.test(cardNumber.value)) {
        showError(cardNumber, 'Please enter a valid 16-digit card number');
        return false;
    }
    
    // Validate expiry date (MM/YY)
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry.value)) {
        showError(expiry, 'Please enter a valid expiry date (MM/YY)');
        return false;
    }
    
    // Validate CVV (3 digits)
    if (!/^[0-9]{3}$/.test(cvv.value)) {
        showError(cvv, 'Please enter a valid 3-digit CVV');
        return false;
    }
    
    return true;
}

// Show error message
function showError(input, message) {
    const errorDiv = input.parentElement.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    if (!input.parentElement.querySelector('.error-message')) {
        input.parentElement.appendChild(errorDiv);
    }
    
    input.classList.add('border-red-500');
    input.addEventListener('input', () => {
        errorDiv.remove();
        input.classList.remove('border-red-500');
    }, { once: true });
}

// Render order summary
function renderOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');

    if (!orderItems || !window.cart) return;

    // Calculate totals
    const subtotalAmount = window.cart.total;
    const shippingAmount = subtotalAmount > 0 ? 1500 : 0; // KSh 1,500 shipping if cart is not empty
    const taxAmount = subtotalAmount * 0.16; // 16% tax
    const totalAmount = subtotalAmount + shippingAmount + taxAmount;

    // Update totals display
    if (subtotal) subtotal.textContent = `KSh ${subtotalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (shipping) shipping.textContent = `KSh ${shippingAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (tax) tax.textContent = `KSh ${taxAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (total) total.textContent = `KSh ${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Render order items
    orderItems.innerHTML = window.cart.items.map(item => `
        <div class="flex items-center space-x-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
            <div class="flex-grow">
                <h4 class="text-sm font-medium text-primary-dark">${item.name}</h4>
                <p class="text-sm text-gray-600">KSh ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} x ${item.quantity}</p>
                ${Object.entries(item.selectedOptions).map(([key, value]) => 
                    `<p class="text-xs text-gray-500">${key}: ${value}</p>`
                ).join('')}
            </div>
            <div class="text-sm font-medium text-primary-dark">
                KSh ${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
        </div>
    `).join('');
}

// Show payment form
function showPaymentForm() {
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    
    if (shippingForm && paymentForm) {
        shippingForm.classList.add('hidden');
        paymentForm.classList.remove('hidden');
        
        // Update progress steps
        updateProgressSteps(2);
    }
}

// Go back to shipping form
function goBackToShipping() {
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    
    if (shippingForm && paymentForm) {
        shippingForm.classList.remove('hidden');
        paymentForm.classList.add('hidden');
        
        // Update progress steps
        updateProgressSteps(1);
    }
}

// Update progress steps
function updateProgressSteps(step) {
    const steps = document.querySelectorAll('.flex.items-center');
    steps.forEach((stepEl, index) => {
        const circle = stepEl.querySelector('.w-8.h-8');
        const text = stepEl.querySelector('.text-sm');
        
        if (index < step) {
            circle.classList.remove('bg-gray-200', 'text-gray-600');
            circle.classList.add('bg-primary', 'text-white');
            text.classList.remove('text-gray-600');
            text.classList.add('text-primary');
        } else if (index === step) {
            circle.classList.remove('bg-gray-200', 'text-gray-600');
            circle.classList.add('bg-primary', 'text-white');
            text.classList.remove('text-gray-600');
            text.classList.add('text-primary');
        } else {
            circle.classList.remove('bg-primary', 'text-white');
            circle.classList.add('bg-gray-200', 'text-gray-600');
            text.classList.remove('text-primary');
            text.classList.add('text-gray-600');
        }
    });
}

// Process order
function processOrder() {
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    const confirmationStep = document.getElementById('confirmation-step');
    
    if (shippingForm && paymentForm && confirmationStep) {
        // Hide forms and show confirmation
        shippingForm.classList.add('hidden');
        paymentForm.classList.add('hidden');
        confirmationStep.classList.remove('hidden');
        
        // Update progress steps
        updateProgressSteps(3);
        
        // Display order details
        displayOrderDetails();
        
        // Clear cart
        window.cart.clearCart();
    }
}

// Display order details
function displayOrderDetails() {
    const shippingDetails = document.getElementById('confirmation-shipping');
    const paymentDetails = document.getElementById('confirmation-payment');
    
    if (shippingDetails && paymentDetails) {
        // Get shipping form data
        const formData = new FormData(document.getElementById('shipping-form'));
        const shippingInfo = {
            name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            country: formData.get('country'),
            instructions: formData.get('instructions')
        };
        
        // Get payment form data
        const paymentInfo = {
            cardNumber: document.querySelector('input[name="cardNumber"]').value,
            cardName: document.querySelector('input[name="cardName"]').value
        };
        
        // Display shipping details
        shippingDetails.innerHTML = `
            <p>${shippingInfo.name}</p>
            <p>${shippingInfo.email}</p>
            <p>${shippingInfo.phone}</p>
            <p>${shippingInfo.address}</p>
            <p>${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}</p>
            <p>${shippingInfo.country}</p>
            ${shippingInfo.instructions ? `<p class="mt-2"><strong>Delivery Instructions:</strong> ${shippingInfo.instructions}</p>` : ''}
        `;
        
        // Display payment details
        paymentDetails.innerHTML = `
            <p>Card ending in ${paymentInfo.cardNumber.slice(-4)}</p>
            <p>${paymentInfo.cardName}</p>
        `;
    }
} 