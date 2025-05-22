// Cart state
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images ? product.images[0] : product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCartUI();
    }
}

// Calculate cart totals
function calculateTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0; // Example shipping cost
    const tax = subtotal * 0.16; // Example tax rate
    const total = subtotal + shipping + tax;
    
    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Update cart UI
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.classList.remove('hidden');
        return;
    }
    
    emptyCartMessage.classList.add('hidden');
    
    // Update cart items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="bg-white rounded-lg shadow-md p-4 flex items-center">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md">
            <div class="ml-4 flex-grow">
                <h3 class="text-lg font-medium text-primary-dark">${item.name}</h3>
                <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                <div class="flex items-center mt-2">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="text-red-500 hover:text-red-700 ml-4" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Update totals
    const totals = calculateTotals();
    if (subtotalElement) subtotalElement.textContent = `$${totals.subtotal}`;
    if (shippingElement) shippingElement.textContent = `$${totals.shipping}`;
    if (taxElement) taxElement.textContent = `$${totals.tax}`;
    if (totalElement) totalElement.textContent = `$${totals.total}`;
}

// Handle checkout
document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in to proceed to checkout');
        window.location.href = '../auth/login.html';
        return;
    }
    
    // Redirect to checkout page
    window.location.href = '../checkout.html';
});

// Initialize cart
document.addEventListener('DOMContentLoaded', loadCart); 