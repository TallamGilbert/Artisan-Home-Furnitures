// Quick View Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const productModal = document.getElementById('product-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modal-product-image');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const prevImageBtn = document.querySelector('.prev-image');
    const nextImageBtn = document.querySelector('.next-image');

    let currentImageIndex = 0;
    let productImages = [];
    let currentProduct = null;

    // Function to close the modal
    function closeModal() {
        productModal.classList.remove('flex', 'items-center', 'justify-center');
        productModal.classList.add('hidden');
        document.body.style.overflow = '';
        currentProduct = null;
    }

    // Function to update cart count in UI
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cart-count');
        const mobileCartCount = document.getElementById('mobile-cart-count');
        
        if (cartCount) cartCount.textContent = totalItems;
        if (mobileCartCount) mobileCartCount.textContent = totalItems;
    }

    // Function to show notification
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Function to add item to cart
    function addToCart() {
        try {
            if (currentProduct) {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingItemIndex = cart.findIndex(item => item.id === currentProduct.id);
                
                if (existingItemIndex > -1) {
                    cart[existingItemIndex].quantity += 1;
                } else {
                    cart.push({
                        id: currentProduct.id,
                        name: currentProduct.name,
                        price: currentProduct.price,
                        image: currentProduct.images[0],
                        quantity: 1
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                showNotification('Item added to cart successfully!');
                closeModal();
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Error adding item to cart. Please try again.', true);
        }
    }

    // Add click event to quick view buttons
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                currentProduct = {
                    id: this.dataset.product,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    description: this.dataset.description,
                    features: JSON.parse(this.dataset.features || '[]'),
                    colors: JSON.parse(this.dataset.colors || '[]'),
                    images: JSON.parse(this.dataset.images || '[]')
                };
                
                // Update modal content
                modalImage.src = currentProduct.images[0];
                const modalName = document.getElementById('modal-product-name');
                const modalPrice = document.getElementById('modal-product-price');
                const modalDescription = document.getElementById('modal-product-description');
                const modalFeatures = document.getElementById('modal-product-features');
                const modalColors = document.getElementById('modal-product-colors');

                modalName.textContent = currentProduct.name;
                modalPrice.textContent = `KSh ${currentProduct.price.toFixed(2)}`;
                modalDescription.textContent = currentProduct.description;

                // Update features list
                if (modalFeatures) {
                    modalFeatures.innerHTML = currentProduct.features
                        .map(feature => `<li class="flex items-center">
                            <i class="fas fa-check text-primary mr-2"></i>
                            <span>${feature}</span>
                        </li>`)
                        .join('');
                }

                // Update color options
                if (modalColors) {
                    modalColors.innerHTML = currentProduct.colors
                        .map(color => `<div class="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-200 hover:border-primary" 
                                          style="background-color: ${color}" 
                                          title="${color}">
                        </div>`)
                        .join('');
                }

                // Set up image gallery
                productImages = currentProduct.images;
                currentImageIndex = 0;
                updateGallery();

                // Add click event to the Add to Cart button
                const addToCartBtn = document.querySelector('.add-to-cart-btn');
                if (addToCartBtn) {
                    // Remove any existing event listeners
                    const newAddToCartBtn = addToCartBtn.cloneNode(true);
                    addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
                    // Add new event listener
                    newAddToCartBtn.addEventListener('click', addToCart);
                }

                // Show modal
                productModal.classList.remove('hidden');
                productModal.classList.add('flex', 'items-center', 'justify-center');
                document.body.style.overflow = 'hidden';
            } catch (error) {
                console.error('Error opening quick view modal:', error);
                showNotification('Error opening product details. Please try again.', true);
            }
        });
    });

    // Update gallery display
    function updateGallery() {
        if (productImages.length > 0) {
            modalImage.src = productImages[currentImageIndex];
            
            // Update thumbnails
            thumbnailContainer.innerHTML = productImages
                .map((image, index) => `
                    <img src="${image}" 
                         alt="Thumbnail ${index + 1}" 
                         class="w-16 h-16 object-cover rounded cursor-pointer ${index === currentImageIndex ? 'border-2 border-primary' : ''}"
                         onclick="window.setCurrentImage(${index})">
                `)
                .join('');
        }
    }

    // Set current image (exposed globally)
    window.setCurrentImage = function(index) {
        currentImageIndex = index;
        updateGallery();
    };

    // Previous image button
    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
            updateGallery();
        });
    }

    // Next image button
    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % productImages.length;
            updateGallery();
        });
    }

    // Close modal when clicking the close button
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === productModal) {
            closeModal();
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && productModal.classList.contains('flex')) {
            closeModal();
        }
    });
}); 