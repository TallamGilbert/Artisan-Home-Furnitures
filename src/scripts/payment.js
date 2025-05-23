// Payment System
class Payment {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
    }

    // Create new order
    async createOrder(cartItems, shippingAddress, paymentMethod) {
        if (!auth.isLoggedIn()) {
            throw new Error('User must be logged in to place an order');
        }

        const order = {
            id: Date.now().toString(),
            userId: auth.getCurrentUser().id,
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending',
            shippingAddress,
            paymentMethod,
            createdAt: new Date().toISOString()
        };

        try {
            // Process payment
            await this.processPayment(order);
            
            // Save order
            this.orders.push(order);
            this.saveOrders();
            
            // Clear cart
            cart.clearCart();
            
            return order;
        } catch (error) {
            throw new Error('Payment failed: ' + error.message);
        }
    }

    // Process payment
    async processPayment(order) {
        // Simulate payment processing
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Randomly succeed or fail for demo purposes
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Payment declined'));
                }
            }, 2000);
        });
    }

    // Get user orders
    getUserOrders() {
        if (!auth.isLoggedIn()) return [];
        return this.orders.filter(order => order.userId === auth.getCurrentUser().id);
    }

    // Get order by ID
    getOrder(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    // Update order status
    updateOrderStatus(orderId, status) {
        const order = this.getOrder(orderId);
        if (order) {
            order.status = status;
            this.saveOrders();
        }
    }

    // Save orders to localStorage
    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    // Render order history
    renderOrderHistory() {
        const orderHistory = document.getElementById('order-history');
        if (!orderHistory) return;

        const orders = this.getUserOrders();
        
        if (orders.length === 0) {
            orderHistory.innerHTML = '<p class="text-gray-600">No orders found</p>';
            return;
        }

        orderHistory.innerHTML = orders.map(order => `
            <div class="order-item bg-white rounded-lg shadow-sm p-4 mb-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-primary-dark">Order #${order.id}</h3>
                    <span class="px-3 py-1 rounded-full text-sm ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }">${order.status}</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-medium mb-2">Items</h4>
                        ${order.items.map(item => `
                            <div class="flex items-center mb-2">
                                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                                <div class="ml-3">
                                    <p class="text-sm font-medium">${item.name}</p>
                                    <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <h4 class="font-medium mb-2">Shipping Address</h4>
                        <p class="text-sm text-gray-600">
                            ${order.shippingAddress.street}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
                            ${order.shippingAddress.country}
                        </p>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t">
                    <div class="flex justify-between items-center">
                        <p class="text-sm text-gray-600">Ordered on ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p class="text-lg font-medium">$${order.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize payment
const payment = new Payment();

// Export payment instance
export default payment; 