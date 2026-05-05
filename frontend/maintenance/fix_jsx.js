const fs = require('fs');
const files = [
  'd:/antigravityProject/frontend/src/pages/HomePage.jsx',
  'd:/antigravityProject/CombinedMana/frontend/src/pages/HomePage.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Make sure we only replace the ones inside the component rendering
    // {section.category} -> {(section.category || '').replace(/\//g, '/\u200B')}
    content = content.replace(/>{section\.category}</g, ">{(section.category || '').replace(/\\//g, '/\\u200B')}<");
    
    // {item.name} -> {(item.name || '').replace(/\//g, '/\u200B')}
    content = content.replace(/>{item\.name}</g, ">{(item.name || '').replace(/\\//g, '/\\u200B')}<");

    fs.writeFileSync(file, content);
    console.log('Fixed JSX render in', file);
  }
});
