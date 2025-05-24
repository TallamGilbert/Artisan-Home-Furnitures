// Checkout functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart if not already initialized
    if (!window.cart) {
        window.cart = new Cart();
    }

    // Check if cart is empty
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (window.cart.items.length === 0) {
        showEmptyCartMessage();
        console.log('Cart is empty, showing empty cart message.');
        return;
    }

    // Render order summary
    renderOrderSummary();
    console.log('Rendering order summary.');

    // Handle shipping form submission
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Shipping form submitted.');
            if (validateShippingForm()) {
                console.log('Shipping form validated successfully.');
                showPaymentForm();
            } else {
                console.log('Shipping form validation failed.');
            }
        });
    }

    // Handle payment form submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Payment form submitted.');
            if (validatePaymentForm()) {
                console.log('Payment form validated successfully.');
                processOrder();
            } else {
                console.log('Payment form validation failed.');
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

    // Initial progress bar state
    updateProgressSteps(1); // Set to step 1 on load if cart is not empty
    console.log('Setting initial progress step to 1.');
});

// Show empty cart message
function showEmptyCartMessage() {
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (emptyCartMessage && checkoutForm) {
        emptyCartMessage.classList.remove('hidden');
        checkoutForm.classList.add('hidden');
        console.log('Toggled visibility to show empty cart message.');
    }
}

// Validate shipping form
function validateShippingForm() {
    console.log('Validating shipping form...');
    const form = document.getElementById('shipping-form');
    if (!form) {
        console.log('Shipping form not found.');
        return false;
    }

    const phone = form.querySelector('input[name="phone"]');
    const zip = form.querySelector('input[name="zip"]');
    
    // Validate phone number (10 digits)
    if (phone && !/^[0-9]{10}$/.test(phone.value)) {
        showError(phone, 'Please enter a valid 10-digit phone number');
        console.log('Phone validation failed.');
        return false;
    }
    
    // Validate ZIP code (5 digits)
    if (zip && !/^[0-9]{5}$/.test(zip.value)) {
        showError(zip, 'Please enter a valid 5-digit ZIP code');
        console.log('ZIP code validation failed.');
        return false;
    }
    
    console.log('Shipping form validation passed.');
    return true;
}

// Validate payment form
function validatePaymentForm() {
    console.log('Validating payment form...');
    const form = document.getElementById('payment-form');
    if (!form) {
        console.log('Payment form not found.');
        return false;
    }

    const cardNumber = form.querySelector('input[name="cardNumber"]');
    const expiry = form.querySelector('input[name="expiry"]');
    const cvv = form.querySelector('input[name="cvv"]');
    
    // Validate card number (16 digits)
    if (cardNumber && !/^[0-9]{16}$/.test(cardNumber.value)) {
        showError(cardNumber, 'Please enter a valid 16-digit card number');
        console.log('Card number validation failed.');
        return false;
    }
    
    // Validate expiry date (MM/YY)
    if (expiry && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry.value)) {
        showError(expiry, 'Please enter a valid expiry date (MM/YY)');
        console.log('Expiry date validation failed.');
        return false;
    }
    
    // Validate CVV (3 digits)
    if (cvv && !/^[0-9]{3}$/.test(cvv.value)) {
        showError(cvv, 'Please enter a valid 3-digit CVV');
        console.log('CVV validation failed.');
        return false;
    }
    
    console.log('Payment form validation passed.');
    return true;
}

// Show error message
function showError(input, message) {
    console.log(`Showing error for input: ${input.name}, message: ${message}`);
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
    console.log('Rendering order summary...');
    const orderItems = document.getElementById('order-items');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');

    if (!orderItems || !window.cart) {
        console.log('Order summary elements or cart not found.');
        return;
    }

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
    console.log('Showing payment form...');
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    
    if (shippingForm && paymentForm) {
        shippingForm.classList.add('hidden');
        paymentForm.classList.remove('hidden');
        
        // Update progress steps
        updateProgressSteps(2);
        console.log('Updated progress steps to 2.');
    } else {
        console.log('Shipping or payment form not found.');
    }
}

// Go back to shipping form
function goBackToShipping() {
    console.log('Going back to shipping form...');
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    
    if (shippingForm && paymentForm) {
        shippingForm.classList.remove('hidden');
        paymentForm.classList.add('hidden');
        
        // Update progress steps
        updateProgressSteps(1);
        console.log('Updated progress steps to 1.');
    } else {
        console.log('Shipping or payment form not found for back action.');
    }
}

// Update progress steps
function updateProgressSteps(step) {
    console.log(`Updating progress steps to step: ${step}`);
    const steps = document.querySelectorAll('.flex.items-center');
    const lines = document.querySelectorAll('.flex-1.h-0.5');
    
    if (steps.length === 0) {
        console.log('Progress steps elements not found.');
        return;
    }

    steps.forEach((stepEl, index) => {
        const circle = stepEl.querySelector('.w-8.h-8');
        const text = stepEl.querySelector('.text-sm');
        
        if (!circle || !text) {
            console.log(`Circle or text element not found for step index ${index}.`);
            return;
        }
        
        // Step circles and text
        if (index < step - 1) { // Completed steps
            circle.classList.remove('bg-gray-200', 'text-gray-600');
            circle.classList.add('bg-primary', 'text-white');
            text.classList.remove('text-gray-600');
            text.classList.add('text-primary');
        } else if (index === step - 1) { // Current step
            circle.classList.remove('bg-gray-200', 'text-gray-600');
            circle.classList.add('bg-primary', 'text-white');
            text.classList.remove('text-gray-600');
            text.classList.add('text-primary');
        } else { // Upcoming steps
            circle.classList.remove('bg-primary', 'text-white');
            circle.classList.add('bg-gray-200', 'text-gray-600');
            text.classList.remove('text-primary');
            text.classList.add('text-gray-600');
        }
    });

    // Update connecting lines
    lines.forEach((line, index) => {
        if (index < step - 1) { // Lines before the current step
            line.classList.remove('bg-gray-200');
            line.classList.add('bg-primary');
        } else { // Lines at or after the current step
            line.classList.remove('bg-primary');
            line.classList.add('bg-gray-200');
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
        
        // Update progress steps to Confirmation (step 3)
        updateProgressSteps(3);
        
        // Display order details
        displayOrderDetails();
        
        // Clear cart (optional, depends on desired flow)
        // window.cart.clearCart();
    }
}

// Display order details
function displayOrderDetails() {
    const confirmationShipping = document.getElementById('confirmation-shipping');
    const confirmationPayment = document.getElementById('confirmation-payment');
    
    if (confirmationShipping && confirmationPayment) {
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
        
        // Get payment form data (Note: You might want to store this more securely than just getting from the form on confirmation)
        const cardNameInput = document.querySelector('#payment-form input[name="cardName"]');
        const cardNumberInput = document.querySelector('#payment-form input[name="cardNumber"]');

        const paymentInfo = {
            cardNumber: cardNumberInput ? cardNumberInput.value : '',
            cardName: cardNameInput ? cardNameInput.value : ''
        };
        
        // Display shipping details
        confirmationShipping.innerHTML = `
            <p>${shippingInfo.name}</p>
            <p>${shippingInfo.email}</p>
            <p>${shippingInfo.phone}</p>
            <p>${shippingInfo.address}</p>
            <p>${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}</p>
            <p>${shippingInfo.country}</p>
            ${shippingInfo.instructions ? `<p class="mt-2"><strong>Delivery Instructions:</strong> ${shippingInfo.instructions}</p>` : ''}
        `;
        
        // Display payment details
        confirmationPayment.innerHTML = `
            <p>Card ending in ${paymentInfo.cardNumber ? paymentInfo.cardNumber.slice(-4) : 'N/A'}</p>
            <p>${paymentInfo.cardName || 'N/A'}</p>
        `;
    }
} 