const fs = require('fs');
const path = require('path');

const collectionsDir = path.join(__dirname, 'collections');
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
        
        fs.writeFileSync(filePath, content);
    }
}); 