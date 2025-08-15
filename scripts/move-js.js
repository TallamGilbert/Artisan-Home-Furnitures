const fs = require('fs-extra');
const path = require('path');

// Source and destination directories
const sourceDir = path.join(__dirname, '..', 'js');
const destDir = path.join(__dirname, '..', 'public', 'js');

// Ensure the destination directory exists
fs.ensureDirSync(destDir);

// Copy all JavaScript files
fs.copySync(sourceDir, destDir, {
  filter: (src) => {
    return fs.statSync(src).isDirectory() || src.endsWith('.js');
  }
});

console.log('JavaScript files moved to public directory successfully!'); 