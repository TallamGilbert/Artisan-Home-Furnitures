import { ProductModalService } from '../ProductModalService';

describe('ProductModalService', () => {
  let service;
  let mockModal;
  let mockButton;

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <div id="product-modal" class="hidden"></div>
      <button class="quick-view-btn" 
        data-product="test-product"
        data-name="Test Product"
        data-price="1000"
        data-description="Test Description"
        data-features='["Feature 1", "Feature 2"]'
        data-colors='["#000000", "#FFFFFF"]'
        data-images='["image1.jpg", "image2.jpg"]'>
        Quick View
      </button>
    `;

    mockModal = document.getElementById('product-modal');
    mockButton = document.querySelector('.quick-view-btn');
    service = new ProductModalService();
  });

  test('should initialize with correct properties', () => {
    expect(service.modal).toBe(mockModal);
    expect(service.currentProduct).toBeNull();
    expect(service.currentImageIndex).toBe(0);
    expect(service.productImages).toEqual([]);
  });

  test('should open modal with correct product data', () => {
    const clickEvent = new MouseEvent('click');
    mockButton.dispatchEvent(clickEvent);

    expect(service.currentProduct).toEqual({
      id: 'test-product',
      name: 'Test Product',
      price: 1000,
      description: 'Test Description',
      features: ['Feature 1', 'Feature 2'],
      colors: ['#000000', '#FFFFFF'],
      images: ['image1.jpg', 'image2.jpg']
    });

    expect(mockModal.classList.contains('hidden')).toBe(false);
  });

  test('should close modal correctly', () => {
    service.openModal();
    service.closeModal();

    expect(mockModal.classList.contains('hidden')).toBe(true);
    expect(service.currentProduct).toBeNull();
  });

  test('should navigate images correctly', () => {
    service.productImages = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    
    service.navigateImage('next');
    expect(service.currentImageIndex).toBe(1);

    service.navigateImage('next');
    expect(service.currentImageIndex).toBe(2);

    service.navigateImage('next');
    expect(service.currentImageIndex).toBe(0);

    service.navigateImage('prev');
    expect(service.currentImageIndex).toBe(2);
  });
}); 