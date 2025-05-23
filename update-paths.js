const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy static assets to dist
copyDir('images', 'dist/images');
copyDir('components', 'dist/components');
copyDir('js', 'dist/js');

// Copy individual JS files to dist/js
const jsFiles = [
    'theme.js',
    'cart.js',
    'quick-view.js',
    'script.js',
    'user-menu.js'
];

jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join('dist/js', file));
    }
});

// Update collection pages
const collectionsDir = path.join(__dirname, 'dist', 'collections');
const files = fs.readdirSync(collectionsDir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(collectionsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update CSS and JS paths to absolute
        content = content.replace(/href="\.\.\/([^"]+)"/g, 'href="/$1"');
        content = content.replace(/src="\.\.\/([^"]+)"/g, 'src="/$1"');
        
        // Update image paths to absolute
        content = content.replace(/src="\.\.\/images\/([^"]+)"/g, 'src="/images/$1"');
        
        // Update data-image paths in quick-view buttons
        content = content.replace(/data-images='\["\.\.\/images\/([^"]+)"([^]]+)\]'/g, 'data-images=\'["/images/$1$2]\'');
        
        // Update component paths
        content = content.replace(/components\/([^"]+)/g, '/components/$1');
        
        fs.writeFileSync(filePath, content);
    }
}); 