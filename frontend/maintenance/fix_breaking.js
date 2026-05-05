const fs = require('fs');

const files = [
  'd:/antigravityProject/frontend/src/pages/HomePage.jsx',
  'd:/antigravityProject/CombinedMana/frontend/src/pages/HomePage.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove break-words to stop abrupt breaking
    content = content.replace(/break-words/g, '');

    // Now, let's inject zero-width space after all slashes in the STATIC_MENU block
    // to allow meaningful word breaking without visible spaces.
    const startIdx = content.indexOf('const STATIC_MENU = [');
    if (startIdx !== -1) {
      const endIdx = content.indexOf('];', startIdx) + 2;
      let menuBlock = content.substring(startIdx, endIdx);
      
      // We want to replace '/' with '/\u200B' inside strings in the menu block.
      // Easiest is to just replace '/' with '/\u200B' in the whole block except for image paths!
      // Image paths look like "/images/..."
      // Let's replace carefully.
      menuBlock = menuBlock.replace(/"([^"]+)"/g, (match, p1) => {
        if (p1.startsWith('/images/')) return match;
        // Inject zero-width space after / for wrapping
        // Also inject zero-width space after - if needed, but / is the main issue.
        const newStr = p1.replace(/\//g, '/\u200B');
        return `"${newStr}"`;
      });
      
      content = content.substring(0, startIdx) + menuBlock + content.substring(endIdx);
    }

    fs.writeFileSync(file, content);
    console.log('Fixed word breaking in', file);
  }
});
