// Cart Management System
if (typeof window.Cart === 'undefined') {
    class Cart {
        constructor() {
            // Initialize cart from localStorage
            this.items = JSON.parse(localStorage.getItem('cart')) || [];
            this.total = 0;
            this.updateTotal();
            
            // Make cart instance globally available
            window.cart = this;
            
            // Initialize event listeners
            this.initializeEventListeners();
            
            // Initialize cart UI when the page loads
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.updateCartUI();
                });
            } else {
                this.updateCartUI();
            }
        }

        // Initialize event listeners
        initializeEventListeners() {
            // No need for add to cart button listener here as it's handled in quick-view.js
        }

        // Add item to cart
        addItem(product, quantity = 1, selectedOptions = {}) {
            const existingItem = this.items.find(item => 
                item.id === product.id && 
                JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                // Get the first image from the product's images array
                let imagePath = product.images && product.images.length > 0 ? product.images[0] : '';
                
                // If the image path is relative (starts with ../), convert it to absolute
                if (imagePath && imagePath.startsWith('../')) {
                    imagePath = imagePath.replace('../', '/');
                }
                
                // If the image path doesn't start with /, add it
                if (imagePath && !imagePath.startsWith('/')) {
                    imagePath = '/' + imagePath;
                }

                // If no image is available, use the default avatar
                if (!imagePath) {
                    imagePath = '/images/default-avatar.jpeg';
                }

                this.items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: imagePath,
                    selectedOptions: selectedOptions
                });
            }

            this.updateTotal();
            this.saveCart();
            this.updateCartUI();
            this.showNotification(`${product.name} added to cart`);
        }

        // Remove item from cart
        removeItem(index) {
            const item = this.items[index];
            this.items.splice(index, 1);
            this.updateTotal();
            this.saveCart();
            this.updateCartUI();
            this.showNotification(`${item.name} removed from cart`);
        }

        // Update item quantity
        updateQuantity(index, quantity) {
            if (quantity > 0) {
                this.items[index].quantity = quantity;
                this.updateTotal();
                this.saveCart();
                this.updateCartUI();
            } else if (quantity === 0) {
                this.removeItem(index);
            }
        }

        // Clear cart
        clearCart() {
            this.items = [];
            this.total = 0;
            this.saveCart();
            this.updateCartUI();
        }

        // Update total
        updateTotal() {
            this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        // Save cart to localStorage
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.items));
        }

        // Show notification
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate__animated animate__fadeIn';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('animate__fadeOut');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Update cart UI
        updateCartUI() {
            // Update all cart count elements
            const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count, #tablet-cart-count');
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            
            cartCountElements.forEach(element => {
                if (element) {
                    element.textContent = totalItems;
                    element.classList.toggle('hidden', totalItems === 0);
                }
            });

            // Update cart page if we're on it
            if (window.location.pathname.includes('/cart')) {
                this.renderCartPage();
            }

            // Update checkout page if we're on it
            if (window.location.pathname.includes('/checkout')) {
                this.renderCheckoutPage();
            }
        }

        // Render cart page
        renderCartPage() {
            const cartItems = document.getElementById('cart-items');
            const emptyCart = document.getElementById('empty-cart');
            const subtotal = document.getElementById('subtotal');
            const shipping = document.getElementById('shipping');
            const tax = document.getElementById('tax');
            const total = document.getElementById('total');
            
            if (!cartItems || !emptyCart) return;

            if (this.items.length === 0) {
                cartItems.innerHTML = '';
                emptyCart.classList.remove('hidden');
                return;
            }

            emptyCart.classList.add('hidden');

            // Calculate totals
            const subtotalAmount = this.total;
            const shippingAmount = subtotalAmount > 0 ? 1500 : 0; // KSh 1,500 shipping if cart is not empty
            const taxAmount = subtotalAmount * 0.16; // 16% tax
            const totalAmount = subtotalAmount + shippingAmount + taxAmount;

            // Update totals display
            if (subtotal) subtotal.textContent = `KSh ${subtotalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            if (shipping) shipping.textContent = `KSh ${shippingAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            if (tax) tax.textContent = `KSh ${taxAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            if (total) total.textContent = `KSh ${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

            // Render cart items
            cartItems.innerHTML = this.items.map((item, index) => `
                <div class="bg-white rounded-lg shadow-md p-4 flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md" onerror="this.src='/images/default-avatar.jpeg'">
                    <div class="ml-4 flex-grow">
                        <h3 class="text-lg font-medium text-primary-dark">${item.name}</h3>
                        <p class="text-gray-600">KSh ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        ${Object.entries(item.selectedOptions).map(([key, value]) => 
                            `<p class="text-sm text-gray-500">${key}: ${value}</p>`
                        ).join('')}
                        <div class="flex items-center mt-2">
                            <button class="quantity-btn px-2 py-1 border border-gray-300 rounded hover:bg-gray-100" onclick="cart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="quantity-btn px-2 py-1 border border-gray-300 rounded hover:bg-gray-100" onclick="cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="text-red-500 hover:text-red-700 ml-4" onclick="cart.removeItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        // Render checkout page
        renderCheckoutPage() {
            const orderItems = document.getElementById('order-items');
            const subtotal = document.getElementById('subtotal');
            const shipping = document.getElementById('shipping');
            const tax = document.getElementById('tax');
            const total = document.getElementById('total');
            const emptyCartMessage = document.getElementById('empty-cart-message');
            const checkoutForm = document.getElementById('checkout-form');

            if (!orderItems || !emptyCartMessage || !checkoutForm) return;

            if (this.items.length === 0) {
                emptyCartMessage.classList.remove('hidden');
                checkoutForm.classList.add('hidden');
                return;
            }

            emptyCartMessage.classList.add('hidden');
            checkoutForm.classList.remove('hidden');

            // Calculate totals
            const subtotalAmount = this.total;
            const shippingAmount = subtotalAmount > 0 ? 1500 : 0; // KSh 1,500 shipping if cart is not empty
            const taxAmount = subtotalAmount * 0.16; // 16% tax
            const totalAmount = subtotalAmount + shippingAmount + taxAmount;

            // Update totals display
            if (subtotal) subtotal.textContent = `KSh ${subtotalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            if (shipping) shipping.textContent = `KSh ${shippingAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            if (tax) tax.textContent = `KSh ${taxAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            if (total) total.textContent = `KSh ${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

            // Render order items
            orderItems.innerHTML = this.items.map(item => `
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md" onerror="this.src='/images/default-avatar.jpeg'">
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
    }

    // Initialize cart when the script loads
    new Cart();
}

// Add event listener for checkout button
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (window.cart.items.length === 0) {
                window.cart.showNotification('Your cart is empty');
                return;
            }
            window.location.href = '/checkout.html';
        });
    }
}); 