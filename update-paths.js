const fs = require('fs');
const path = require('path');

const collectionsDir = path.join(__dirname, 'collections');
const files = fs.readdirSync(collectionsDir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(collectionsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update asset paths
        content = content.replace(/\.\.\//g, '/');
        
        fs.writeFileSync(filePath, content);
    }
}); 