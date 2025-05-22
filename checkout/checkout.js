// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Checkout page loaded');
    console.log('Cart variable:', typeof window.cart, window.cart);
    
    // Check if cart is empty
    if (!window.cart || window.cart.length === 0) {
        console.log('Cart is empty or not defined, redirecting to cart page');
        window.location.href = '../cart/cart.html';
        return;
    }

    console.log('Cart has items:', window.cart);
    
    // Update checkout summary
    updateCheckoutSummary();

    // Handle shipping form submission
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        console.log('Shipping form found');
        shippingForm.addEventListener('submit', handleShippingSubmit);
    } else {
        console.log('Shipping form not found');
    }

    // Handle payment form submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        console.log('Payment form found');
        paymentForm.addEventListener('submit', handleCheckout);
    } else {
        console.log('Payment form not found');
    }
});

// Handle shipping form submission
function handleShippingSubmit(event) {
    event.preventDefault();
    
    // Hide shipping form and show payment form
    document.getElementById('shipping-form').classList.add('hidden');
    document.getElementById('payment-form').classList.remove('hidden');
    
    // Update progress steps
    updateProgressSteps(2);
}

// Update progress steps
function updateProgressSteps(step) {
    const steps = document.querySelectorAll('.flex.items-center');
    steps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.querySelector('div').classList.remove('bg-gray-200', 'text-gray-600');
            stepEl.querySelector('div').classList.add('bg-primary', 'text-white');
            stepEl.querySelector('div:last-child').classList.remove('text-gray-600');
            stepEl.querySelector('div:last-child').classList.add('text-primary');
        } else {
            stepEl.querySelector('div').classList.add('bg-gray-200', 'text-gray-600');
            stepEl.querySelector('div').classList.remove('bg-primary', 'text-white');
            stepEl.querySelector('div:last-child').classList.add('text-gray-600');
            stepEl.querySelector('div:last-child').classList.remove('text-primary');
        }
    });
}

// Go back to shipping form
window.goBackToShipping = function() {
    document.getElementById('payment-form').classList.add('hidden');
    document.getElementById('shipping-form').classList.remove('hidden');
    updateProgressSteps(1);
};

// Update checkout summary
function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const shippingElement = document.getElementById('checkout-shipping');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');

    if (!checkoutItems) return;

    // Update items with improved styling
    checkoutItems.innerHTML = window.cart.map(item => `
        <div class="bg-white rounded-lg shadow-md p-4 flex items-center mb-4">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md">
            <div class="ml-4 flex-grow">
                <h3 class="text-lg font-medium text-primary-dark">${item.name}</h3>
                <p class="text-gray-600">KSh ${Number(item.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} × ${item.quantity}</p>
                <p class="text-gray-800 font-medium mt-1">KSh ${Number(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
        </div>
    `).join('');

    // Update totals with improved formatting
    const totals = window.calculateTotals();
    if (subtotalElement) subtotalElement.textContent = `KSh ${Number(totals.subtotal).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (shippingElement) shippingElement.textContent = `KSh ${Number(totals.shipping).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (taxElement) taxElement.textContent = `KSh ${Number(totals.tax).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (totalElement) totalElement.textContent = `KSh ${Number(totals.total).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// Handle checkout form submission
async function handleCheckout(event) {
    event.preventDefault();

    // Get form data from both forms
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    
    const shippingData = new FormData(shippingForm);
    const paymentData = new FormData(paymentForm);
    
    const orderData = {
        shipping: {
            firstName: shippingData.get('firstName'),
            lastName: shippingData.get('lastName'),
            email: shippingData.get('email'),
            phone: shippingData.get('phone'),
            address: shippingData.get('address'),
            city: shippingData.get('city'),
            state: shippingData.get('state'),
            zipCode: shippingData.get('zip'),
            country: shippingData.get('country'),
            instructions: shippingData.get('instructions')
        },
        payment: {
            cardNumber: paymentData.get('cardNumber'),
            expiryDate: paymentData.get('expiry'),
            cvv: paymentData.get('cvv'),
            cardName: paymentData.get('cardName')
        },
        items: window.cart,
        totals: window.calculateTotals()
    };

    try {
        // Show loading state
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Clear cart
        window.cart = [];
        saveCart();

        // Show success message
        showOrderConfirmation(orderData);

        // Redirect to confirmation page after 3 seconds
        setTimeout(() => {
            window.location.href = '../confirmation.html';
        }, 3000);

    } catch (error) {
        console.error('Checkout error:', error);
        alert('There was an error processing your order. Please try again.');
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// Show order confirmation
function showOrderConfirmation(orderData) {
    const confirmation = document.createElement('div');
    confirmation.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    confirmation.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div class="text-center">
                <i class="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                <h2 class="text-2xl font-medium text-gray-900 mb-2">Order Confirmed!</h2>
                <p class="text-gray-600 mb-4">Thank you for your purchase, ${orderData.shipping.firstName}!</p>
                <p class="text-gray-600">Your order total: KSh ${Number(orderData.totals.total).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p class="text-gray-600 mt-4">A confirmation email has been sent to ${orderData.shipping.email}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmation);
} 