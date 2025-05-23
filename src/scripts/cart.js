// Initialize cart array
window.cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        window.cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(window.cart));
    updateCartCount();
}

// Add item to cart
window.addToCart = function(product) {
    const existingItem = window.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showAddToCartNotification(product.name);
}

// Remove item from cart
function removeFromCart(productId) {
    window.cart = window.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    const item = window.cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
        updateCartUI();
    }
}

// Calculate cart totals
window.calculateTotals = function() {
    const subtotal = window.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 1500 : 0; // KSh 1,500 shipping if cart is not empty
    const tax = subtotal * 0.16; // 16% tax
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
    
    if (!cartItemsContainer || !emptyCartMessage) return;
    
    if (window.cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.classList.remove('hidden');
        return;
    }
    
    emptyCartMessage.classList.add('hidden');
    
    // Update cart items
    cartItemsContainer.innerHTML = window.cart.map(item => `
        <div class="bg-white rounded-lg shadow-md p-4 flex items-center">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md">
            <div class="ml-4 flex-grow">
                <h3 class="text-lg font-medium text-primary-dark">${item.name}</h3>
                <p class="text-gray-600">KSh ${Number(item.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
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
    const totals = window.calculateTotals();
    if (subtotalElement) subtotalElement.textContent = `KSh ${Number(totals.subtotal).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (shippingElement) shippingElement.textContent = `KSh ${Number(totals.shipping).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (taxElement) taxElement.textContent = `KSh ${Number(totals.tax).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (totalElement) totalElement.textContent = `KSh ${Number(totals.total).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = window.cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('hidden', totalItems === 0);
    }
}

// Show add to cart notification
function showAddToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${productName} added to cart</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart display
    function updateCart() {
        if (!cartContainer) return;
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '';
            if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
            if (checkoutBtn) checkoutBtn.classList.add('hidden');
            return;
        }
        
        if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
        if (checkoutBtn) checkoutBtn.classList.remove('hidden');
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) cartTotal.textContent = `KSh ${total.toLocaleString()}`;
        
        // Update cart items
        cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item flex items-center justify-between py-4 border-b border-gray-200" data-id="${item.id}">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                    <div>
                        <h3 class="font-medium text-gray-800">${item.name}</h3>
                        <p class="text-gray-600">KSh ${item.price.toLocaleString()}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <button class="quantity-btn decrease px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to cart items
        cartContainer.querySelectorAll('.cart-item').forEach(item => {
            const id = item.dataset.id;
            const decreaseBtn = item.querySelector('.decrease');
            const increaseBtn = item.querySelector('.increase');
            const removeBtn = item.querySelector('.remove-item');
            
            decreaseBtn?.addEventListener('click', () => updateQuantity(id, -1));
            increaseBtn?.addEventListener('click', () => updateQuantity(id, 1));
            removeBtn?.addEventListener('click', () => removeItem(id));
        });
        
        // Update cart count in navbar
        updateCartCount();
    }
    
    // Update item quantity
    function updateQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            
            // Remove item if quantity is 0
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            // Save cart and update display
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }
    
    // Remove item from cart
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
    
    // Update cart count in navbar
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.classList.toggle('hidden', totalItems === 0);
        });
    }
    
    // Initialize cart display
    updateCart();
    
    // Handle checkout
    checkoutBtn?.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        }
    });
}); 