const fs = require('fs');

const files = [
  'd:/antigravityProject/frontend/src/pages/HomePage.jsx',
  'd:/antigravityProject/CombinedMana/frontend/src/pages/HomePage.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Update addToCart definition
    content = content.replace(
      /const addToCart = \(item, category, weight\) => \{\s*setCartItems\(prev => \{\s*const existingItem = prev\.find\(i => isMatchingItem\(i, item, category\)\);\s*if \(existingItem\) \{\s*return prev\.map\(i => isMatchingItem\(i, item, category\) \? \{ \.\.\.i, qty: i\.qty \+ 1 \} : i\);\s*\}\s*return \[\.\.\.prev, \{ \.\.\.item, category, weight, qty: 1 \}\];\s*\}\);\s*\};/g,
      "const addToCart = (item, category, weight, imagePath) => {\n    setCartItems(prev => {\n      const existingItem = prev.find(i => isMatchingItem(i, item, category));\n      if (existingItem) {\n        return prev.map(i => isMatchingItem(i, item, category) ? { ...i, qty: i.qty + 1 } : i);\n      }\n      return [...prev, { ...item, category, weight, qty: 1, image: imagePath }];\n    });\n  };"
    );

    // 2. Update addToCart calls in the menu render
    content = content.replace(
      /addToCart\(item, section\.category, section\.weight\)/g,
      'addToCart(item, section.category, section.weight, section.image)'
    );

    // 3. Update cart image render
    content = content.replace(
      /<img src=\{`\/images\/\$\{item\.category\?\.toLowerCase\(\) \|\| 'traditional'\}\.png`\} className="/g,
      "<img src={item.image || `/images/${item.category?.toLowerCase() || 'traditional'}.png`} className=\""
    );

    fs.writeFileSync(file, content);
    console.log('Fixed Cart image pathing in', file);
  }
});
