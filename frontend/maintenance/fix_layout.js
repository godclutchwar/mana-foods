const fs = require('fs');

const files = [
  'd:/antigravityProject/frontend/src/pages/HomePage.jsx',
  'd:/antigravityProject/CombinedMana/frontend/src/pages/HomePage.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Make layout robust for long text
    content = content.split('className="flex justify-between items-center group/item border-t border-gold-500/10 pt-6"').join('className="flex justify-between items-center group/item border-t border-gold-500/10 pt-6 gap-4"');
    
    // There might be multiple "flex flex-col", we specifically want the one in the item block.
    // The previous line is the container we just updated. Let's do a more precise replace.
    // Actually, just searching for the exact sequence:
    
    content = content.split('<div className="flex flex-col">\n                          <span className="font-bold text-lg').join('<div className="flex flex-col flex-1 min-w-0 pr-2">\n                          <span className="font-bold text-lg');

    content = content.split('className="font-bold text-lg text-white group-hover/item:text-gold-400 transition-colors uppercase tracking-wide"').join('className="font-bold text-lg text-white group-hover/item:text-gold-400 transition-colors uppercase tracking-wide break-words"');

    content = content.split('className="flex items-center gap-6"').join('className="flex items-center gap-4 shrink-0"');

    content = content.split('className="text-3xl font-serif font-black text-white mb-2 group-hover:text-gold-500 transition-colors uppercase tracking-tight"').join('className="text-3xl font-serif font-black text-white mb-2 group-hover:text-gold-500 transition-colors uppercase tracking-tight break-words"');

    // Let's also check if the add button is visible. Yes, we added shrink-0 to the button container.
    fs.writeFileSync(file, content);
    console.log('Fixed alignment in', file);
  }
});
