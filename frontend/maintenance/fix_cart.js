const fs = require('fs');

const cssContent = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(5, 44, 34, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.6);
}
`;

const cssFiles = [
  'd:/antigravityProject/frontend/src/index.css',
  'd:/antigravityProject/CombinedMana/frontend/src/index.css'
];

cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('.custom-scrollbar::-webkit-scrollbar')) {
      content += cssContent;
      fs.writeFileSync(file, content);
    }
  }
});

const files = [
  'd:/antigravityProject/frontend/src/pages/HomePage.jsx',
  'd:/antigravityProject/CombinedMana/frontend/src/pages/HomePage.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Fix cart item container
    content = content.replace(
      'className="premium-card p-6 bg-forest-950/30 border-gold-500/5 hover:border-gold-500/20 transition-all flex justify-between items-center"',
      'className="premium-card p-6 bg-forest-950/30 border-gold-500/5 hover:border-gold-500/20 transition-all flex justify-between items-center gap-4"'
    );
    
    // Fix left side flex
    content = content.replace(
      '<div className="flex items-center gap-6">',
      '<div className="flex items-center gap-6 flex-1 min-w-0">'
    );
    
    // Fix image to shrink-0
    content = content.replace(
      'className="w-20 h-20 bg-forest-900 rounded-2xl overflow-hidden shadow-2xl border border-gold-500/10"',
      'className="w-20 h-20 shrink-0 bg-forest-900 rounded-2xl overflow-hidden shadow-2xl border border-gold-500/10"'
    );
    
    // Fix cart item text div
    content = content.replace(
      '<div>\\n                        <p className="font-serif font-black text-xl text-white uppercase tracking-tight leading-none mb-2">',
      '<div className="flex-1 min-w-0">\\n                        <p className="font-serif font-black text-xl text-white uppercase tracking-tight leading-none mb-2 truncate">'
    );
    // There are actually multiple spaces. It's safer to use regex.
    content = content.replace(
      /<div>\s*<p className="font-serif font-black text-xl text-white uppercase tracking-tight leading-none mb-2">\{item\.name\}<\/p>\s*<p className="text-\[10px\] text-gold-500\/50 font-black uppercase tracking-\[0\.2em\] mb-4">/g,
      '<div className="flex-1 min-w-0">\n                        <p className="font-serif font-black text-lg text-white uppercase tracking-tight leading-none mb-2 truncate">{item.name}</p>\n                        <p className="text-[10px] text-gold-500/50 font-black uppercase tracking-[0.2em] mb-4 truncate">'
    );
    
    // Fix Rupee overlap in cart item
    content = content.replace(
      /<p className="font-serif font-black text-2xl text-gold-400 tracking-tighter">₹\{item\.price \* item\.qty\}<\/p>/g,
      '<p className="font-serif font-black text-2xl text-gold-400 tracking-tighter flex items-center"><span className="font-sans text-xl mr-1 tracking-normal">₹</span>{item.price * item.qty}</p>'
    );
    
    // Fix Rupee overlap in cart total
    content = content.replace(
      /<span className="text-4xl font-serif font-black text-white tracking-tighter gold-text-gradient leading-none">₹\{getTotalPrice\(\)\}<\/span>/g,
      '<span className="text-4xl font-serif font-black text-white tracking-tighter gold-text-gradient leading-none flex items-center"><span className="font-sans font-bold text-3xl mr-1 tracking-normal text-gold-500">₹</span>{getTotalPrice()}</span>'
    );

    // Fix the flex-col items-end gap-6 container to shrink-0
    content = content.replace(
      '<div className="flex flex-col items-end gap-6">',
      '<div className="flex flex-col items-end gap-6 shrink-0">'
    );

    fs.writeFileSync(file, content);
    console.log('Fixed Cart layout in', file);
  }
});
