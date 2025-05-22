# Artisan Home Furnitures

A modern, responsive e-commerce website for premium furniture, built with HTML, CSS, and JavaScript.

## 🌟 Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Clean and elegant user interface with smooth animations
- **Product Showcase**: Featured products with quick view functionality
- **Collection Categories**: Organized furniture collections
- **Store Locator**: Interactive map with store locations
- **Custom Furniture**: Section for custom furniture requests
- **Testimonials**: Customer reviews and ratings
- **Newsletter**: Email subscription for updates
- **Shopping Cart**: Full cart functionality
- **User Authentication**: User profile and authentication system
- **Theme Support**: Light/Dark mode toggle

## 🛠️ Technologies Used

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Maps API
- Bootstrap 5
- Animate.css

## 📦 Project Structure

### Core Files
```
artisan-home-furnitures/
├── index.html          # Main homepage
├── profile.html        # User profile page
├── checkout.html       # Checkout page
├── confirmation.html   # Order confirmation page
├── styles.css         # Main stylesheet
└── script.js          # Main application script
```

### JavaScript Modules
```
├── cart.js            # Shopping cart functionality
├── checkout.js        # Checkout process handling
├── quick-view.js      # Product quick view modal
├── theme.js           # Theme switching (light/dark mode)
├── user-menu.js       # User menu and authentication UI
└── profile.js         # User profile functionality
```

### Directories
```
├── components/        # Reusable UI components
├── js/               # Additional JavaScript modules
├── images/           # Image assets
│   ├── collections/  # Collection images
│   ├── products/    # Product images
│   ├── testimonials/# Customer testimonial images
│   └── instagram/   # Instagram feed images
├── auth/            # Authentication related files
├── cart/            # Shopping cart related files
├── checkout/        # Checkout process files
├── collections/     # Collection pages
└── data/           # Data files (products, users, etc.)
```

### External Dependencies
The project uses several external libraries loaded via CDN:
- Tailwind CSS for styling
- Font Awesome for icons
- Bootstrap 5 for components
- Animate.css for animations
- Google Maps API for store locator

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/artisan-home-furnitures.git
   ```

2. Navigate to the project directory:
   ```bash
   cd artisan-home-furnitures
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

## 📦 Deployment

### GitHub Setup
1. Initialize git repository (if not already done):
   ```bash
   git init
   ```

2. Add all files to git:
   ```bash
   git add .
   ```

3. Commit your changes:
   ```bash
   git commit -m "Initial commit"
   ```

4. Create a new repository on GitHub and push your code:
   ```bash
   git remote add origin https://github.com/yourusername/artisan-home-furnitures.git
   git branch -M main
   git push -u origin main
   ```

### Vercel Deployment
1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

2. Deploy to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

The project is configured with `vercel.json` for optimal deployment settings.

## 🔧 Configuration

1. **Google Maps API**: Replace the Google Maps API key in the store locator section with your own key.
2. **Font Awesome**: Update the Font Awesome kit URL in the HTML file with your own kit URL.
3. **Custom Images**: Replace placeholder images in the `images` directory with your own product images.

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)
- Large screens (1280px and up)

## 🎨 Customization

### Colors
The color scheme can be modified in `styles.css`. The main colors are:
- Primary: #2B6CB0
- Secondary: #4A5568
- Accent: #E6E6FA
- Background: #F7FAFC

### Fonts
The project uses:
- Primary Font: System UI
- Furniture Font: Custom font for headings

## 🔒 Security

- All user data is handled securely
- No sensitive information is stored in client-side code
- HTTPS is recommended for production deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@artisanhome.com or create an issue in the repository.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Maps for store locator
- Tailwind CSS for styling
- Bootstrap for components
- Animate.css for animations




..........................................................................................

