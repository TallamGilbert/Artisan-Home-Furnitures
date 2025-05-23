// Quick View Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-product-image');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const prevImageBtn = document.querySelector('.prev-image');
    const nextImageBtn = document.querySelector('.next-image');
    const closeModalBtn = document.querySelector('.close-modal');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    let currentImageIndex = 0;
    let productImages = [];
    let currentProduct = null;

    // Open modal and populate with product data
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productData = {
                id: button.dataset.product,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                description: button.dataset.description,
                features: JSON.parse(button.dataset.features),
                colors: JSON.parse(button.dataset.colors),
                images: JSON.parse(button.dataset.images)
            };
            
            currentProduct = productData;
            productImages = productData.images;
            currentImageIndex = 0;
            
            // Update modal content
            document.getElementById('modal-product-name').textContent = productData.name;
            document.getElementById('modal-product-price').textContent = `KSh ${productData.price.toLocaleString()}`;
            document.getElementById('modal-product-description').textContent = productData.description;
            
            // Update features
            const featuresList = document.getElementById('modal-product-features');
            featuresList.innerHTML = productData.features.map(feature => `<li>${feature}</li>`).join('');
            
            // Update colors
            const colorsContainer = document.getElementById('modal-product-colors');
            colorsContainer.innerHTML = productData.colors.map(color => `
                <div class="w-8 h-8 rounded-full border border-gray-300 cursor-pointer" 
                     style="background-color: ${color}"
                     title="Color: ${color}">
                </div>
            `).join('');
            
            // Update images
            updateModalImage();
            updateThumbnails();
            
            // Show modal
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    // Update modal image
    function updateModalImage() {
        if (productImages.length > 0) {
            modalImage.src = productImages[currentImageIndex];
        }
    }

    // Update thumbnails
    function updateThumbnails() {
        thumbnailContainer.innerHTML = productImages.map((image, index) => `
            <img src="${image}" 
                 alt="Thumbnail ${index + 1}" 
                 class="w-20 h-20 object-cover rounded cursor-pointer ${index === currentImageIndex ? 'ring-2 ring-primary' : ''}"
                 onclick="setCurrentImage(${index})">
        `).join('');
    }

    // Set current image
    window.setCurrentImage = (index) => {
        currentImageIndex = index;
        updateModalImage();
        updateThumbnails();
    };

    // Previous image
    prevImageBtn?.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
        updateModalImage();
        updateThumbnails();
    });

    // Next image
    nextImageBtn?.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
        updateModalImage();
        updateThumbnails();
    });

    // Close modal
    closeModalBtn?.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // Add to cart
    addToCartBtn?.addEventListener('click', () => {
        if (currentProduct) {
            // Get cart from localStorage or initialize empty array
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if product already exists in cart
            const existingProductIndex = cart.findIndex(item => item.id === currentProduct.id);
            
            if (existingProductIndex > -1) {
                // Update quantity if product exists
                cart[existingProductIndex].quantity += 1;
            } else {
                // Add new product to cart
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    image: currentProduct.images[0],
                    quantity: 1
                });
            }
            
            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count in navbar
            updateCartCount();
            
            // Show success message
            showNotification('Product added to cart!');
            
            // Close modal
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
});

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.classList.toggle('hidden', totalItems === 0);
    });
}

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