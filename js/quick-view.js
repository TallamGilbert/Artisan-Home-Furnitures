// Product Modal Service
class ProductModalService {
  constructor() {
    this.modal = document.getElementById('product-modal');
    this.currentProduct = null;
    this.currentImageIndex = 0;
    this.productImages = [];
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.querySelectorAll('.quick-view-btn').forEach(button => {
      button.addEventListener('click', (e) => this.handleQuickViewClick(e));
    });

    document.querySelector('.close-modal')?.addEventListener('click', () => this.closeModal());
    document.querySelector('.add-to-cart-btn')?.addEventListener('click', () => this.handleAddToCart());
    document.querySelector('.prev-image')?.addEventListener('click', () => this.navigateImage('prev'));
    document.querySelector('.next-image')?.addEventListener('click', () => this.navigateImage('next'));
  }

  handleQuickViewClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    
    try {
      this.currentProduct = {
        id: button.dataset.product,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        description: button.dataset.description,
        features: JSON.parse(button.dataset.features || '[]'),
        colors: JSON.parse(button.dataset.colors || '[]'),
        images: JSON.parse(button.dataset.images || '[]')
      };

      this.productImages = this.currentProduct.images;
      this.currentImageIndex = 0;
      
      this.updateModalContent();
      this.openModal();
    } catch (error) {
      console.error('Error parsing product data:', error);
    }
  }

  updateModalContent() {
    if (!this.currentProduct) return;

    // Update basic product info
    document.getElementById('modal-product-name').textContent = this.currentProduct.name;
    document.getElementById('modal-product-price').textContent = `KSh ${this.currentProduct.price.toLocaleString()}`;
    document.getElementById('modal-product-description').textContent = this.currentProduct.description;

    // Update features
    const featuresList = document.getElementById('modal-product-features');
    featuresList.innerHTML = this.currentProduct.features
      .map(feature => `<li>${feature}</li>`)
      .join('');

    // Update colors
    const colorsContainer = document.getElementById('modal-product-colors');
    colorsContainer.innerHTML = this.currentProduct.colors
      .map(color => `
        <button class="color-option w-8 h-8 rounded-full border-2 border-gray-300 hover:border-primary transition-custom"
            style="background-color: ${color}"
            data-color="${color}">
        </button>
      `)
      .join('');

    // Update images
    this.updateProductImage();
    this.updateThumbnails();
  }

  updateProductImage() {
    const modalImage = document.getElementById('modal-product-image');
    if (modalImage && this.productImages[this.currentImageIndex]) {
      modalImage.src = this.productImages[this.currentImageIndex];
      modalImage.alt = `${this.currentProduct.name} - Image ${this.currentImageIndex + 1}`;
    }
  }

  updateThumbnails() {
    const container = document.getElementById('thumbnail-container');
    if (!container) return;

    container.innerHTML = this.productImages
      .map((image, index) => `
        <img src="${image}" 
             alt="Thumbnail ${index + 1}"
             class="w-20 h-20 object-cover rounded-md cursor-pointer ${index === this.currentImageIndex ? 'ring-2 ring-primary' : ''}"
             onclick="productModalService.setCurrentImage(${index})">
      `)
      .join('');
  }

  setCurrentImage(index) {
    this.currentImageIndex = index;
    this.updateProductImage();
    this.updateThumbnails();
  }

  navigateImage(direction) {
    const newIndex = direction === 'next' 
      ? (this.currentImageIndex + 1) % this.productImages.length
      : (this.currentImageIndex - 1 + this.productImages.length) % this.productImages.length;
    
    this.setCurrentImage(newIndex);
  }

  openModal() {
    this.modal.classList.remove('hidden');
    this.modal.classList.add('flex', 'items-center', 'justify-center');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('flex', 'items-center', 'justify-center');
    this.modal.classList.add('hidden');
    document.body.style.overflow = '';
    this.currentProduct = null;
  }

  async handleAddToCart() {
    if (!this.currentProduct) return;

    try {
      // Add to cart logic here
      console.log('Adding to cart:', this.currentProduct);
      this.closeModal();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }
}

// Initialize the service
const productModalService = new ProductModalService();

// Quick View Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const closeModalButton = document.querySelector('.close-modal');
    let currentImageIndex = 0;
    let productImages = [];

    // Open modal
    quickViewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.product;
            const productName = button.dataset.name;
            const productPrice = button.dataset.price;
            const productDescription = button.dataset.description;
            const productFeatures = JSON.parse(button.dataset.features || '[]');
            const productColors = JSON.parse(button.dataset.colors || '[]');
            productImages = JSON.parse(button.dataset.images || '[]');

            // Set modal data
            modal.dataset.productId = productId;
            modal.dataset.images = JSON.stringify(productImages);
            
            // Update modal content
            document.getElementById('modal-product-name').textContent = productName;
            document.getElementById('modal-product-price').textContent = `KSh ${parseInt(productPrice).toLocaleString()}`;
            document.getElementById('modal-product-description').textContent = productDescription;
            
            // Update features
            const featuresList = document.getElementById('modal-product-features');
            featuresList.innerHTML = productFeatures.map(feature => `<li>${feature}</li>`).join('');
            
            // Update colors
            const colorsContainer = document.getElementById('modal-product-colors');
            colorsContainer.innerHTML = productColors.map(color => `
                <button class="color-option w-8 h-8 rounded-full border-2 border-gray-300 hover:border-primary transition-custom"
                    style="background-color: ${color}"
                    data-color="${color}">
                </button>
            `).join('');

            // Set initial image
            currentImageIndex = 0;
            updateProductImage();

            // Show modal
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // Image navigation
    document.querySelector('.prev-image').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
        updateProductImage();
    });

    document.querySelector('.next-image').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
        updateProductImage();
    });

    // Color selection
    document.getElementById('modal-product-colors').addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option')) {
            // Remove selected class from all color options
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('border-primary');
            });
            
            // Add selected class to clicked color option
            e.target.classList.add('border-primary');
            
            // Update selected color in modal data
            modal.dataset.selectedColor = e.target.dataset.color;
        }
    });

    function updateProductImage() {
        const mainImage = document.getElementById('modal-product-image');
        mainImage.src = productImages[currentImageIndex];
        
        // Update thumbnails
        const thumbnailContainer = document.getElementById('thumbnail-container');
        thumbnailContainer.innerHTML = productImages.map((image, index) => `
            <img src="${image}" 
                alt="Thumbnail ${index + 1}" 
                class="w-20 h-20 object-cover rounded-md cursor-pointer ${index === currentImageIndex ? 'ring-2 ring-primary' : ''}"
                onclick="currentImageIndex = ${index}; updateProductImage();">
        `).join('');
    }
}); 