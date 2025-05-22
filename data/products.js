// Product data management
const products = {
    'luxe-sofa': {
        id: 'luxe-sofa',
        name: 'Luxe Sofa',
        price: 899,
        originalPrice: 1199,
        description: 'A classic three-seater with premium upholstery and solid wood frame. Features high-quality fabric, solid hardwood frame, and premium foam cushions for ultimate comfort.',
        category: 'sofas',
        images: ['images/products/Luxe Sofa.jpg'],
        colors: ['gray-700', 'primary', 'blue-700'],
        dimensions: {
            width: 220,
            depth: 95,
            height: 85
        },
        stock: 15,
        rating: 4.8,
        reviews: 124,
        features: [
            'Premium fabric upholstery',
            'Solid hardwood frame',
            'High-density foam cushions',
            'Removable covers',
            '5-year warranty'
        ]
    },
    'artisan-dining-table': {
        id: 'artisan-dining-table',
        name: 'Artisan Dining Table',
        price: 1250,
        description: 'Hand-crafted solid wood dining table with natural grain finish. Features premium hardwood construction, hand-carved details, and a rich natural finish.',
        category: 'dining',
        images: ['images/products/Artisan Dining Table.jpg'],
        woodTypes: ['Oak', 'Mahogany', 'Walnut'],
        dimensions: {
            width: 180,
            depth: 90,
            height: 75
        },
        stock: 8,
        rating: 4.9,
        reviews: 89,
        features: [
            'Solid hardwood construction',
            'Hand-carved details',
            'Natural grain finish',
            'Seats 6-8 people',
            '10-year warranty'
        ]
    },
    'modern-lounge-chair': {
        id: 'modern-lounge-chair',
        name: 'Modern Lounge Chair',
        price: 650,
        description: 'Mid-century inspired lounge chair with ergonomic design. Features premium leather upholstery, solid wood frame, and comfortable cushioning.',
        category: 'chairs',
        images: ['images/products/Modern Lounge Chair.jpg'],
        colors: ['yellow-700', 'gray-200', 'primary-light'],
        dimensions: {
            width: 75,
            depth: 85,
            height: 95
        },
        stock: 12,
        rating: 4.7,
        reviews: 56,
        features: [
            'Premium leather upholstery',
            'Solid wood frame',
            'Ergonomic design',
            'Swivel base',
            '3-year warranty'
        ]
    }
};

// Export the products data
export default products; 