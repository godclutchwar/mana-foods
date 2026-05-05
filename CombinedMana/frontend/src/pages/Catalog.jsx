import React, { useState, useEffect } from 'react';
import { Clock, ShoppingBag } from 'lucide-react';
import API_BASE_URL from '../config';

export default function Catalog() {
  const [siteContent, setSiteContent] = useState({});
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch site content
    fetch(`${API_BASE_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        const map = {};
        if (data && Array.isArray(data)) {
          data.forEach(d => { map[d.key] = d.value; });
          setSiteContent(map);
        }
      }).catch(err => console.error(err));

    // Fetch products and group them
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(products => {
        const sections = {};
        products.forEach(p => {
          const websiteCat = p.category?.name || "Other";
          
          if (!sections[websiteCat]) {
            sections[websiteCat] = {
              category: websiteCat,
              image: p.category?.imageUrl || (websiteCat === 'SWEETS' ? '/images/pootharekulu.png' : '/images/pickles.png'),
              items: []
            };
          }

          if (p.stockLevels && p.stockLevels.length > 0) {
            sections[websiteCat].items.push({
              name: p.name,
              price: p.stockLevels[0].price,
              weight: p.stockLevels[0].weight
            });
            // Store displayOrder for sorting
            sections[websiteCat].displayOrder = p.category?.displayOrder || 999;
          }
        });

        const finalData = Object.values(sections).sort((a, b) => a.displayOrder - b.displayOrder);

        setMenuData(finalData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="bg-forest-950 min-h-screen flex items-center justify-center text-gold-500 font-serif text-2xl">Loading Traditional Menu...</div>;

  return (
    <div className="bg-forest-950 min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full mandala-bg opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block p-1 bg-gold-500/10 rounded-3xl mb-12">
            <div className="glassmorphism p-10 rounded-2xl border-2 border-gold-500/30">
              <img src="/images/mana-logo.png" alt="MANA" className="h-24 w-auto mx-auto mb-6" />
              <h1 className="text-6xl font-serif font-black gold-text-gradient tracking-tighter uppercase leading-none">Mana Catalog</h1>
              <p className="text-gold-500 font-black uppercase tracking-[0.5em] text-xs mt-4">The Soul Of Tradition</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {menuData.map((section, idx) => (
            <div key={idx} className="premium-card flex flex-col group">
              <div className="h-48 relative overflow-hidden grayscale-[30%] group-hover:grayscale-0 transition-all duration-700">
                <img src={section.image} alt={section.category} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 to-transparent"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-full px-6">
                  <h2 className="text-3xl font-serif font-black text-white uppercase tracking-tight drop-shadow-2xl">
                    {section.category}
                  </h2>
                </div>
              </div>
              <div className="p-10 flex-grow relative bg-forest-900/20">
                <ul className="space-y-5">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex justify-between items-end group/item">
                      <div className="flex flex-col">
                        <span className="text-emerald-50 text-lg group-hover/item:text-gold-400 transition-colors uppercase tracking-wide font-medium">{item.name}</span>
                        <span className="text-[10px] text-gold-500/50 uppercase tracking-widest">{item.weight}</span>
                      </div>
                      <div className="flex-grow border-b border-gold-500/10 mx-4 mb-2 border-dashed"></div>
                      <span className="text-gold-500 font-serif font-black text-xl tracking-tighter">₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-32 text-center p-20 glassmorphism rounded-[3rem] border-gold-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gold-500/5 mandala-bg opacity-10"></div>
          <p className="text-2xl font-serif font-black text-white mb-6 uppercase tracking-tight relative z-10 italic">
            "{siteContent.FOOTER_TEXT || 'Authentic Taste, Handcrafted with Love'}"
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-emerald-100/70 mb-10 relative z-10 font-medium">
            <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-gold-500" /> {siteContent.NOTICE_1 || 'Takes 24-48 hrs to deliver'}</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-gold-500/50 rounded-full"></span>
            <span className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-gold-500" /> {siteContent.NOTICE_2 || 'Bulk orders accepted on preorder'}</span>
          </div>
          <p className="text-gold-500 font-black text-xl relative z-10 uppercase tracking-widest bg-forest-950 px-8 py-4 rounded-2xl border border-gold-500/20 inline-block shadow-2xl">
            WhatsApp Orders: {siteContent.CONTACT_NUMBER || '9945060993'}
          </p>
        </div>
      </div>
    </div>
  );
}
