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

// Create necessary directories in dist
const dirs = ['dist/js', 'dist/collections', 'dist/images', 'dist/components'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Copy static assets to dist
copyDir('images', 'dist/images');
copyDir('components', 'dist/components');
copyDir('js', 'dist/js');
copyDir('collections', 'dist/collections');

// Update collection pages
const collectionsDir = path.join(__dirname, 'dist', 'collections');
const files = fs.readdirSync(collectionsDir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(collectionsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update script paths to use js directory
        content = content.replace(/src="\.\.\/([^"]+\.js)"/g, 'src="../js/$1"');
        content = content.replace(/src="\/([^"]+\.js)"/g, 'src="../js/$1"');
        
        // Update CSS paths
        content = content.replace(/href="\/([^"]+\.css)"/g, 'href="../$1"');
        
        // Update image paths
        content = content.replace(/src="\/images\/([^"]+)"/g, 'src="../images/$1"');
        
        // Update data-image paths in quick-view buttons
        content = content.replace(/data-images='\["\/images\/([^"]+)"([^]]+)\]'/g, 'data-images=\'["../images/$1$2]\'');
        
        // Update component paths
        content = content.replace(/\/components\/([^"]+)/g, '../components/$1');
        
        fs.writeFileSync(filePath, content);
    }
}); 