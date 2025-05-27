// Quick View Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    const modalFeatures = document.getElementById('modal-product-features');
    const modalColors = document.getElementById('modal-product-colors');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const closeModal = document.querySelector('.close-modal');
    const prevImageBtn = document.querySelector('.prev-image');
    const nextImageBtn = document.querySelector('.next-image');
    const viewMoreBtn = document.getElementById('view-more-btn');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    let currentImageIndex = 0;
    let currentImages = [];
    let currentProduct = null;

    // Handle Quick View Button Click
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                const productData = {
                    id: this.dataset.product,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    description: this.dataset.description,
                    features: JSON.parse(this.dataset.features),
                    colors: JSON.parse(this.dataset.colors),
                    images: JSON.parse(this.dataset.images)
                };
                
                currentProduct = productData;
                updateModalContent(productData);
                
                // Show modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
            } catch (error) {
                console.error('Error opening quick view:', error);
            }
        });
    });

    // Handle Add to Cart Button Click
    addToCartBtn.addEventListener('click', () => {
        if (currentProduct && window.cart) {
            const selectedColor = modal.dataset.selectedColor || currentProduct.colors[0];
            const productToAdd = {
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                images: currentProduct.images,
                selectedOptions: {
                    color: selectedColor
                }
            };
            
            window.cart.addItem(productToAdd);
            closeModal.click();
        }
    });

    // Update Modal Content
    function updateModalContent(productData) {
        try {
            modalName.textContent = productData.name;
            modalPrice.textContent = `KSh ${productData.price.toLocaleString()}`;
            modalDescription.textContent = productData.description;
            
            // Update Features
            modalFeatures.innerHTML = '';
            productData.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                modalFeatures.appendChild(li);
            });

            // Update Colors
            modalColors.innerHTML = '';
            productData.colors.forEach(color => {
                const colorSwatch = document.createElement('div');
                colorSwatch.className = 'color-swatch';
                colorSwatch.style.backgroundColor = color;
                colorSwatch.addEventListener('click', () => {
                    document.querySelectorAll('.color-swatch').forEach(swatch => swatch.classList.remove('selected'));
                    colorSwatch.classList.add('selected');
                    modal.dataset.selectedColor = color;
                });
                modalColors.appendChild(colorSwatch);
            });

            // Select first color by default
            if (productData.colors.length > 0) {
                modal.dataset.selectedColor = productData.colors[0];
                modalColors.firstChild.classList.add('selected');
            }

            // Update Images
            currentImages = productData.images;
            currentImageIndex = 0;
            updateMainImage();
            updateThumbnails();

            // Update View More Link
            viewMoreBtn.href = `/collections/${productData.name.toLowerCase().replace(/\s+/g, '-')}.html`;
        } catch (error) {
            console.error('Error updating modal content:', error);
        }
    }

    // Update Main Image
    function updateMainImage() {
        if (currentImages.length > 0) {
            modalImage.src = currentImages[currentImageIndex];
            modalImage.alt = modalName.textContent;
        }
    }

    // Update Thumbnails
    function updateThumbnails() {
        thumbnailContainer.innerHTML = '';
        
        currentImages.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `${modalName.textContent} - View ${index + 1}`;
            thumbnail.classList.add(index === currentImageIndex ? 'active' : '');
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateMainImage();
                updateThumbnails();
            });
            thumbnailContainer.appendChild(thumbnail);
        });
    }

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    });

    // Close Modal on Outside Click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    });

    // Previous Image
    prevImageBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateMainImage();
        updateThumbnails();
    });

    // Next Image
    nextImageBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateMainImage();
        updateThumbnails();
    });
}); 