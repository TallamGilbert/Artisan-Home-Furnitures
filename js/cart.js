// Cart Management System
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.updateTotal();
        this.initializeEventListeners();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const modal = document.getElementById('product-modal');
                const product = {
                    id: modal.dataset.productId,
                    name: document.getElementById('modal-product-name').textContent,
                    price: parseFloat(document.getElementById('modal-product-price').textContent.replace('KSh ', '').replace(',', '')),
                    images: JSON.parse(modal.dataset.images || '[]'),
                    selectedOptions: {
                        color: modal.dataset.selectedColor || 'Default'
                    }
                };
                this.addItem(product);
            }
        });
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
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.images[0],
                selectedOptions: selectedOptions
            });
        }

        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    // Remove item from cart
    removeItem(index) {
        this.items.splice(index, 1);
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    // Update item quantity
    updateQuantity(index, quantity) {
        if (quantity > 0) {
            this.items[index].quantity = quantity;
            this.updateTotal();
            this.saveCart();
            this.updateCartUI();
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

    // Update cart UI
    updateCartUI() {
        // Update cart count
        const cartCount = document.getElementById('cart-count');
        const mobileCartCount = document.getElementById('mobile-cart-count');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) cartCount.textContent = totalItems;
        if (mobileCartCount) mobileCartCount.textContent = totalItems;

        // Update cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    // Render cart page
    renderCartPage() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) return;

        // Clear existing items
        cartItems.innerHTML = '';

        // Render each item
        this.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item bg-white rounded-lg shadow-sm p-4 mb-4';
            itemElement.innerHTML = `
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md">
                    <div class="ml-4 flex-grow">
                        <h3 class="text-lg font-medium text-primary-dark">${item.name}</h3>
                        <p class="text-gray-600">$${item.price}</p>
                        ${Object.entries(item.selectedOptions).map(([key, value]) => 
                            `<p class="text-sm text-gray-500">${key}: ${value}</p>`
                        ).join('')}
                    </div>
                    <div class="flex items-center">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                        <button class="ml-4 text-red-600" onclick="cart.removeItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });

        // Update total
        cartTotal.textContent = `$${this.total.toFixed(2)}`;
    }
}

// Initialize cart
const cart = new Cart();

// Export cart instance
export default cart; 