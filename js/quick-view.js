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
    // Quick view button click
    document.querySelectorAll('.quick-view-btn').forEach(button => {
      button.addEventListener('click', this.handleQuickViewClick.bind(this));
    });

    // Close modal button
    const closeButton = this.modal.querySelector('.close-modal');
    if (closeButton) {
      closeButton.addEventListener('click', this.closeModal.bind(this));
    }

    // Close on outside click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Image navigation
    const prevButton = this.modal.querySelector('.prev-image');
    const nextButton = this.modal.querySelector('.next-image');
    if (prevButton) {
      prevButton.addEventListener('click', this.showPreviousImage.bind(this));
    }
    if (nextButton) {
      nextButton.addEventListener('click', this.showNextImage.bind(this));
    }

    // Add to Cart button
    const addToCartBtn = this.modal.querySelector('#add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', this.handleAddToCart.bind(this));
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.closeModal();
      }
    });
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
        <div class="color-swatch" style="background-color: ${color}" data-color="${color}"></div>
      `)
      .join('');

    // Add click handlers for color swatches
    colorsContainer.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        colorsContainer.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        this.modal.dataset.selectedColor = swatch.dataset.color;
      });
    });

    // Select first color by default
    if (this.currentProduct.colors.length > 0) {
      const firstColor = colorsContainer.querySelector('.color-swatch');
      if (firstColor) {
        firstColor.classList.add('selected');
        this.modal.dataset.selectedColor = firstColor.dataset.color;
      }
    }

    // Update images
    this.updateProductImage();
    this.updateThumbnails();

    // Update View More link
    const viewMoreBtn = document.getElementById('view-more-btn');
    if (viewMoreBtn) {
      viewMoreBtn.href = `/collections/${this.currentProduct.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    }
  }

  updateProductImage() {
    const modalImage = document.getElementById('modal-product-image');
    if (modalImage && this.productImages.length > 0) {
      modalImage.src = this.productImages[this.currentImageIndex];
      modalImage.alt = this.currentProduct.name;
    }
  }

  updateThumbnails() {
    const container = document.getElementById('thumbnail-container');
    if (!container || !this.currentProduct) return;

    container.innerHTML = this.currentProduct.images.map((image, index) => `
      <img src="${image}" 
           alt="Thumbnail ${index + 1}" 
           class="w-12 h-12 object-cover rounded cursor-pointer transition-all duration-200 ${index === this.currentImageIndex ? 'ring-2 ring-primary opacity-100' : 'opacity-50 hover:opacity-75'}"
           onclick="productModalService.setCurrentImage(${index})">
    `).join('');
  }

  showPreviousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.productImages.length) % this.productImages.length;
    this.updateProductImage();
    this.updateThumbnails();
  }

  showNextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.productImages.length;
    this.updateProductImage();
    this.updateThumbnails();
  }

  handleAddToCart() {
    if (!this.currentProduct) return;

    const selectedColor = this.modal.dataset.selectedColor || this.currentProduct.colors[0];
    const productToAdd = {
      id: this.currentProduct.id,
      name: this.currentProduct.name,
      price: this.currentProduct.price,
      images: [this.productImages[this.currentImageIndex]],
      selectedOptions: {
        color: selectedColor
      }
    };

    // Use the Cart class to add the item
    if (window.cart) {
      window.cart.addItem(productToAdd, 1, productToAdd.selectedOptions);
    }

    // Close the modal
    this.closeModal();
  }

  openModal() {
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this.modal.classList.add('show');
    }, 10);
  }

  closeModal() {
    this.modal.classList.remove('show');
    setTimeout(() => {
      this.modal.style.display = 'none';
      document.body.style.overflow = '';
      this.currentProduct = null;
    }, 300);
  }
}

// Initialize the modal service
const productModalService = new ProductModalService(); 