import React, { useState } from 'react';
import { ShoppingBag, Star, ShieldCheck, Clock, CheckCircle, ShoppingCart, X } from 'lucide-react';

const STATIC_MENU = [
  {
    category: "POOTAREKULU/​PAPER SWEET",
    desc: "Traditional paper-thin sweet wafers",
    weight: "10 Pcs",
    image: "/images/pootharekulu.png",
    items: [
      { name: "Bellam/​Jaggery", price: 200 },
      { name: "Sugar", price: 180 },
      { name: "Dryfruit", price: 250 },
      { name: "Horlicks", price: 250 },
      { name: "Oreo", price: 250 },
      { name: "Chocolate", price: 250 },
      { name: "Pineapple", price: 250 },
      { name: "Strawberry", price: 250 },
      { name: "Orange", price: 250 },
      { name: "Vanilla", price: 250 },
      { name: "Butterscotch", price: 250 },
    ]
  },
  {
    category: "LADDU",
    desc: "Classic soft and rich round sweets",
    weight: "250 Gms",
    image: "/images/laddoos.png",
    items: [
      { name: "Nuvvulu/​Sesame", price: 190 },
      { name: "Dryfruit", price: 300 },
      { name: "Ragi", price: 200 },
      { name: "Ravva", price: 160 },
      { name: "Kobbari/​Coconut", price: 170 },
      { name: "Groundnut/​Peanut", price: 170 },
      { name: "Gond", price: 200 },
      { name: "Boondi", price: 150 },
    ]
  },
  {
    category: "SAVOURIES",
    desc: "Crispy, crunchy evening snacks",
    weight: "250 Gms",
    image: "/images/savouries.png",
    items: [
      { name: "Jantikalu/​Murukulu/​Chakli", price: 150 },
      { name: "Chekka Garelu/​Thattai/​Nippattu", price: 180 },
      { name: "Karam Boondi", price: 140 },
      { name: "Ragi Muruku", price: 140 },
      { name: "Millet Muuku", price: 150 }
    ]
  },
  {
    category: "SUNNUNDALU/​BLACKGRAM/​URAD DAL LADDU",
    desc: "Nutritious Urad Dal Ladoos",
    weight: "250 Gms",
    image: "/images/sunnundalu.png",
    items: [
      { name: "Bellam/​Jaggery", price: 190 },
      { name: "Sugar", price: 180 },
    ]
  },
  {
    category: "TRADITIONAL SWEETS",
    desc: "Heritage Home Made food festive favorites",
    weight: "250 Gms",
    image: "/images/traditional.png",
    items: [
      { name: "Ariselu/​Adhirasam/​Kajjaya/​Anarsa", price: 200 },
      { name: "Kajjikayelu/​Karjikai/​Karanji/​Gujiya", price: 160 },
    ]
  },
  {
    category: "CHIKKIS",
    desc: "Crunchy traditional brittle",
    weight: "250 Gms",
    image: "/images/chikkis.png",
    items: [
      { name: "Nuvvulu/​Sesame", price: 180 },
      { name: "Groundnut/​Peanut/​palli", price: 150 },
    ]
  },
  {
    category: "PICKLES",
    desc: "Authentic spicy Home Made food pickles",
    weight: "250 Gms",
    image: "/images/pickles.png",
    items: [
      { name: "Tomato", price: 130 },
      { name: "Mango Avakai", price: 130 },
      { name: "Amla/​Indian Gooseberry", price: 200 },
      { name: "Drum Stick/​Moringa", price: 150 }
    ]
  },
  {
    category: "NON-VEG PICKLES",
    desc: "Spicy and intense non-veg cravings",
    weight: "250 Gms",
    image: "/images/nonvegpickles.png",
    items: [
      { name: "Prawns", price: 500 },
      { name: "Chicken", price: 300 },
      { name: "Mutton", price: 550 }
    ]
  },
  {
    category: "POWDERS",
    desc: "Hand-ground spice blends",
    weight: "100 Gms",
    image: "/images/powders.png",
    items: [
      { name: "Rasam", price: 60 },
      { name: "Nalla Karam/​Karapodi", price: 60 },
      { name: "Curry Leaves", price: 60 },
      { name: "Kobbari/​Coconut Karam", price: 60 },
      { name: "Putnala Pappu/​Roasted Bengal Gram", price: 70 },
    ]
  },
  {
    category: "PAPADS",
    desc: "Crispy meal accompaniments",
    weight: "100 Gms",
    image: "/images/papads.png",
    items: [
      { name: "Ragi", price: 80 },
      { name: "Saggubiyyam (Tapioca Pearls)", price: 80 },
      { name: "Rice Flour", price: 60 },
      { name: "Oora Mirapakaya/​Curd Chillies", price: 70 },
    ]
  },
  {
    category: "BOBBATULU/​OBBATTU/​POORAN POLI",
    desc: "Traditional stuffed sweet flatbreads",
    weight: "1 PC",
    image: "/images/bobbatulu.png",
    items: [
      { name: "Kova/​Coconut (Kobbari)", price: 40 },
      { name: "Dal", price: 30 }
    ]
  },
  {
    category: "INSTANT MIXES",
    desc: "Quick and easy traditional meals",
    weight: "100 Gms",
    image: "/images/instantmixes.png",
    items: [
      { name: "Dosa/​Idli", price: 60 },
      { name: "Upma", price: 40 }
    ]
  },
  {
    category: "PASTE",
    desc: "Authentic rich cooking pastes",
    weight: "250 Gms",
    image: "/images/paste.png",
    items: [
      { name: "Tamarind Paste(Pulihora/​Pulioghere)", price: 125 }
    ]
  },
  {
    category: "JUNNU/​MILK PUDDING/​GINNU/​SEEM PAAL",
    desc: "Rich, sweet traditional milk pudding",
    weight: "Various",
    image: "/images/junnu.png",
    items: [
      { name: "Small", price: 70 },
      { name: "Big", price: 140 }
    ]
  },
  {
    category: "GHEE",
    desc: "Pure, aromatic traditional clarified butter",
    weight: "250 Gms",
    image: "/images/ghee.png",
    items: [
      { name: "Buffalo", price: 250 }
    ]
  }
];

import API_BASE_URL from '../config';

const resolveImageUrl = (url) => {
  if (!url) return "/images/traditional.png";
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
  return url;
};

// whatsappLink is built dynamically from siteContent.WHATSAPP_NUMBER in handleCheckout

export default function HomePage() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuData, setMenuData] = useState(STATIC_MENU);
  const [siteContent, setSiteContent] = useState({});
  const [galleryData, setGalleryData] = useState([]);

  const fetchContent = () => {
    fetch(`${API_BASE_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const map = {};
          data.forEach(d => { map[d.key] = d.value; });
          setSiteContent(map);
          const g = data.find(d => d.key === 'GALLERY_ITEMS');
          if (g) { try { setGalleryData(JSON.parse(g.value || '[]')); } catch { setGalleryData([]); } }
        }
      }).catch(err => console.error(err));
  };

  React.useEffect(() => {
    fetchContent();
    const id = setInterval(fetchContent, 5000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    const fetchCatalog = () => {
      fetch(`${API_BASE_URL}/api/products?t=${new Date().getTime()}`)
        .then(res => res.json())
        .then(data => {
          if (!data || !Array.isArray(data) || data.length === 0) return;
          const sections = {};

          data.forEach(product => {
            if (!product.stockLevels || product.stockLevels.length === 0) return;

            const websiteCat = product.category?.name || "Other";

            if (!sections[websiteCat]) {
              sections[websiteCat] = {
                category: websiteCat,
                desc: product.category?.description || "Authentic Traditional Delicacies",
                image: resolveImageUrl(product.category?.imageUrl || product.imageUrl || "/images/traditional.png"),
                items: [],
                weight: product.stockLevels[0]?.weight || ""
              };
            }

            product.stockLevels.forEach(stock => {
              sections[websiteCat].items.push({
                name: product.name, 
                price: stock.price,
                weight: stock.weight,
                inStock: stock.inStock === false || stock.inStock === 'false' || stock.inStock === 0 ? false : true,
                _productId: product.id,
                _stockId: stock.id,
                imageUrl: resolveImageUrl(product.imageUrl)
              });
            });
            // Store displayOrder
            sections[websiteCat].displayOrder = product.category?.displayOrder || 999;
          });

          // Sort by display order
          const finalData = Object.values(sections).sort((a, b) => a.displayOrder - b.displayOrder);

          if (finalData.length > 0) {
            setMenuData(finalData);
          }
        })
        .catch(err => console.error("API error, falling back to static menu", err));
    };

    fetchCatalog();
    const intervalId = setInterval(fetchCatalog, 3000); // Auto-sync every 3s
    return () => clearInterval(intervalId);
  }, []);

  const isMatchingItem = (i, item, category) => {
    if (i._stockId && item._stockId) {
      return String(i._stockId) === String(item._stockId);
    }
    return String(i.name).toLowerCase().trim() === String(item.name).toLowerCase().trim() &&
      String(i.category).toLowerCase().trim() === String(category).toLowerCase().trim();
  };

  const addToCart = (item, category, weight, imagePath) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(i => isMatchingItem(i, item, category));

      if (existingIdx !== -1) {
        const newArr = [...prev];
        newArr[existingIdx] = { ...newArr[existingIdx], qty: newArr[existingIdx].qty + 1 };
        return newArr;
      }

      return [...prev, { ...item, category, weight, qty: 1, image: imagePath }];
    });
  };

  const decreaseQty = (item, category) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(i => isMatchingItem(i, item, category));
      if (existingIdx !== -1) {
        const existing = prev[existingIdx];
        if (existing.qty <= 1) {
          return prev.filter((_, idx) => idx !== existingIdx);
        }
        const newArr = [...prev];
        newArr[existingIdx] = { ...existing, qty: existing.qty - 1 };
        return newArr;
      }
      return prev;
    });
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const text = cartItems.map(i => `${i.qty}x ${i.name} ${i.category} (${i.weight}) - ₹${i.price * i.qty}`).join('\n');
    const total = `Total: ₹${getTotalPrice()}`;
    const fullText = `Hi! I would like to order:\n${text}\n\n${total}`;

    const encodedText = encodeURIComponent(fullText);
    const waNum = siteContent.WHATSAPP_NUMBER || '919945060993';
    const waUrl = `https://wa.me/${waNum}?text=${encodedText}`;

    // Fallback to location.href for strict mobile wrappers
    if (window.innerWidth < 768) {
      window.location.href = waUrl;
    } else {
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="font-sans bg-transparent text-forest-50">

      {/* Navigation */}
      <nav className="glassmorphism px-6 lg:px-12 py-5 sticky top-0 z-[100] transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img src="/images/mana-logo.png" alt="MANA Logo" className="h-16 w-auto relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-4xl md:text-5xl tracking-tighter gold-text-gradient leading-none">MANA</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-500/80 font-bold whitespace-nowrap">Desi-Licious Home Foods</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {[
              { name: 'Home', href: '#home' },
              { name: 'About', href: '#about' },
              { name: 'Products', href: '#menu' },
              { name: 'Contact', href: '#contact' }
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-emerald-50/70 hover:text-gold-400 transition-all uppercase tracking-widest relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-gold-400 hover:bg-gold-500/10 rounded-full transition-all border border-gold-500/20 shadow-inner"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-[10px] font-black text-forest-950 shadow-lg ring-2 ring-forest-900 animate-bounce">
                  {cartItems.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
            <a href="#menu" className="hidden lg:flex items-center bg-gold-500 hover:bg-gold-400 text-forest-950 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl shadow-gold-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
              Order Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Decorative Mandala */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gold-500/5 rounded-full border border-gold-500/10 mandala-bg opacity-40 animate-spin-slow"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-gold-500/5 rounded-full border border-gold-500/10 mandala-bg opacity-30 animate-spin-slow-reverse"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center gap-16 relative z-10 text-emerald-50">
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full mb-8">
              <Star className="w-4 h-4 text-gold-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-400">Premium Quality</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black mb-8 leading-[0.9] gold-text-gradient">
              {siteContent.HERO_SUBTITLE || 'MANA Desi-Licious'} <br />
              <span className="text-white text-3xl md:text-5xl lg:text-6xl">{siteContent.HERO_TITLE || 'Authentic Taste'}</span>
            </h1>

            <p className="text-xl text-emerald-100/70 mb-12 max-w-xl leading-relaxed font-light">
              {siteContent.HERO_PARA || 'We bring you the authentic soul of delicious homemade Food. Handcrafted recipes, natural ingredients, and a legacy of love in every single bite.'}
            </p>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <a href="#menu" className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-black py-5 px-10 rounded-2xl shadow-2xl shadow-gold-500/20 transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 text-sm uppercase tracking-widest">
                Start Ordering
              </a>
              <a href="#about" className="glassmorphism hover:bg-forest-800 text-gold-400 font-bold py-5 px-10 rounded-2xl border border-gold-500/30 transition-all hover:border-gold-500/60 shadow-xl text-sm uppercase tracking-widest">
                Our Legacy
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 relative group animate-fade-in-slow">
            <div className="absolute inset-0 bg-gold-500/20 blur-[120px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
            <div className="relative z-10 premium-card p-4 bg-white/5 backdrop-blur-sm border-gold-500/20 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700">
              <img
                src={siteContent.HERO_IMAGE || '/images/traditional.png'}
                alt="Traditional Sweets Showcase"
                className="rounded-[2rem] object-cover w-full h-[600px] shadow-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-12 -left-12 bg-forest-900/95 border border-gold-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-md animate-bounce-subtle">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20">
                    <ShieldCheck className="text-gold-500 w-10 h-10" />
                  </div>
                  <div>
                    <p className="font-bold text-xl text-white">Pure & Natural</p>
                    <p className="text-sm text-emerald-100/50">Zero Preservatives Added</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Cards */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-1 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>

        <div className="text-center mb-24">
          <h2 className="text-sm font-black text-gold-500 tracking-[0.5em] uppercase mb-4">The Selection</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-black text-white">Why Our Kitchen?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Star, title: siteContent.FEATURE_1_TITLE || "Heritage Recipes", desc: siteContent.FEATURE_1_DESC || "Sourced directly from generational family kitchens for true authenticity." },
            { icon: ShieldCheck, title: siteContent.FEATURE_2_TITLE || "Purity Guaranteed", desc: siteContent.FEATURE_2_DESC || "No artificial colors, no preservatives. Just 100% natural goodness." },
            { icon: Clock, title: siteContent.FEATURE_3_TITLE || "Freshly Made", desc: siteContent.FEATURE_3_DESC || "Small-batch preparation ensures every order is as fresh as home-cooked food." }
          ].map((feature, i) => (
            <div key={i} className="premium-card p-12 group">
              <div className="w-20 h-20 bg-forest-950 border border-gold-500/20 rounded-3xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
                <feature.icon className="w-10 h-10 text-gold-500" />
              </div>
              <h4 className="font-serif font-black text-2xl mb-4 text-white uppercase tracking-tight">{feature.title}</h4>
              <p className="text-emerald-100/60 leading-relaxed font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 py-16 mb-12">
        <div className="glassmorphism rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-gold-500/20 shadow-2xl">
          <div className="md:w-1/2">
            <h2 className="text-sm font-bold text-gold-500 tracking-widest uppercase mb-2">{siteContent.ABOUT_LABEL || 'Our Story'}</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">{siteContent.ABOUT_HEADLINE || 'Preserving Authentic Flavors'}</h3>
            <p className="text-forest-100/90 text-lg leading-relaxed mb-6">
              {siteContent.ABOUT_PARA_1 || 'MANA Desi-Licious was born from a deep passion to preserve and share the authentic, time-honored flavors of South India. What started as a small family kitchen cooking traditional generational recipes has grown into a space dedicated to bringing the taste of home to your table.'}
            </p>
            <p className="text-forest-100/90 text-lg leading-relaxed">
              {siteContent.ABOUT_PARA_2 || 'Every carefully crafted sweet and savory snack uses only the finest natural ingredients, completely free from preservatives. Our mission is simple: honest, pure, and authentic taste in every bite.'}
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-gold-600/20 rounded-[2rem] transform translate-x-4 translate-y-4 -z-10 border border-gold-500/50"></div>
            <img src={siteContent.ABOUT_IMAGE || '/images/sunnundalu.png'} alt="Our Heritage" className="rounded-[2rem] shadow-xl object-cover w-full h-[400px]" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryData.length > 0 && (
        <section id="gallery" className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-1 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent"></div>
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-gold-500 tracking-[0.5em] uppercase mb-4">Visual Gallery</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-black text-white">Our Kitchen Stories</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryData.map((item, i) => (
              <div key={i} className="relative group overflow-hidden rounded-3xl aspect-square shadow-2xl">
                <img
                  src={resolveImageUrl(item.url)}
                  alt={item.label || ''}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {item.label && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    <p className="text-white font-serif font-black text-lg uppercase tracking-tight">{item.label}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products Section */}
      <section id="menu" className="max-w-7xl mx-auto px-6 py-32 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-black text-gold-500 tracking-[0.5em] uppercase mb-4">The Collection</h2>
            <h3 className="text-5xl md:text-7xl font-serif font-black text-white leading-none">EXPLORE <br /><span className="gold-text-gradient">OUR MENU</span></h3>
          </div>
          <p className="text-emerald-100/50 max-w-sm text-sm font-light leading-relaxed">Handpicked delicacies from our kitchen to your home. Every item is a tribute to our rich culinary heritage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {menuData.map((section, idx) => (
            <div key={idx} className="premium-card group flex flex-col h-full bg-forest-900/40">
              <div className="relative h-80 overflow-hidden m-3 rounded-[1.5rem] shadow-2xl">
                <img src={section.image} alt={section.category} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-6 right-6 bg-gold-500 text-forest-950 text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 z-20">
                  <CheckCircle className="w-3 h-3" /> {section.weight}
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-3xl font-serif font-black text-white mb-2 group-hover:text-gold-500 transition-colors uppercase tracking-tight ">{(section.category || '').replace(/\//g, '/\u200B')}</h3>
                <p className="text-sm text-emerald-100/40 mb-10 h-12 leading-relaxed italic">{section.desc}</p>

                <div className="space-y-6">
                  {section.items.map((item, i) => {
                    const cartItem = cartItems.find(ci => isMatchingItem(ci, item, section.category));
                    return (
                      <div key={i} className="flex justify-between items-center group/item border-t border-gold-500/10 pt-6 gap-4">
                        <div className="flex flex-col flex-1 min-w-0 pr-2">
                          <span className="font-bold text-lg text-white group-hover/item:text-gold-400 transition-colors uppercase tracking-wide ">{(item.name || '').replace(/\//g, '/\u200B')}</span>
                          <span className="text-[10px] text-gold-500/50 uppercase tracking-[0.2em] font-medium">Classic Choice</span>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-gold-400 font-serif font-black text-xl tracking-tighter">₹{item.price}</span>
                          {item.inStock === false ? (
                            <span className="text-red-400/80 font-bold text-[10px] uppercase tracking-[0.2em] border border-red-500/20 px-3 py-2 rounded-full bg-red-500/5 shadow-inner">Sold Out</span>
                          ) : cartItem ? (
                            <div className="relative z-[10] pointer-events-auto flex items-center bg-forest-950 rounded-xl border border-gold-500/30 overflow-hidden shadow-2xl">
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); decreaseQty(item, section.category); }}
                                className="px-3 py-2 text-gold-400 hover:bg-gold-500 hover:text-forest-950 transition-all font-black touch-manipulation cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-black text-sm text-white">{cartItem.qty}</span>
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(item, section.category, section.weight, item.image || section.image); }}
                                className="px-3 py-2 text-gold-400 hover:bg-gold-500 hover:text-forest-950 transition-all font-black touch-manipulation cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(item, section.category, section.weight, item.imageUrl || section.image);
                              }}
                              className="relative z-[10] bg-forest-800 hover:bg-gold-500 text-gold-400 hover:text-forest-950 text-[10px] font-black px-6 py-3 rounded-xl border border-gold-500/30 transition-all uppercase tracking-widest pointer-events-auto"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Elegantly Designed Gold Banner CTA */}
      <section id="contact" className="relative pt-28 pb-32 overflow-hidden flex justify-center items-center">
        {/* Premium Gold Background */}
        <div className="absolute inset-0 bg-[#d8b548]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>

        {/* Subtle Decorative Elements (Traditional Vibe) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 border-[2px] border-white/40 rounded-full translate-x-[40%] -translate-y-[40%]"></div>
          <div className="absolute inset-0 border-[1px] border-white/40 rounded-full translate-x-[35%] -translate-y-[35%]"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-10 pointer-events-none">
          <div className="absolute inset-0 border-[2px] border-[#2c3d1f] rounded-full -translate-x-[40%] translate-y-[40%]"></div>
          <div className="absolute inset-0 border-[1px] border-[#2c3d1f] rounded-full -translate-x-[35%] translate-y-[35%]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10 flex flex-col items-center w-full">
          {/* Elegant Typography Display */}
          <h2 className="font-serif font-black text-white uppercase drop-shadow-sm flex flex-col items-center leading-[1.1] mb-8">
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] tracking-wider mb-2">
              {siteContent.CTA_TITLE_1 || 'BRING THE TRADITION'}
            </span>
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] tracking-widest text-[#fffefb]">
              {siteContent.CTA_TITLE_2 || 'HOME'}
            </span>
          </h2>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mb-8 w-[250px]">
            <div className="h-px bg-[#3e562e]/30 flex-grow"></div>
            <div className="w-2.5 h-2.5 bg-[#3e562e]/70 rotate-45"></div>
            <div className="h-px bg-[#3e562e]/30 flex-grow"></div>
          </div>

          <p className="text-[#253218] text-lg md:text-2xl mb-8 max-w-3xl mx-auto font-medium leading-relaxed italic tracking-wide">
            {siteContent.HERO_CTA || 'Handcrafted with love, delivered with care. Experience the true soul of Home Made food.'}
          </p>

          <div className="bg-[#2b3a1d]/10 border border-[#2b3a1d]/20 py-4 px-8 rounded-2xl mb-12 text-[#253218] flex flex-col md:flex-row gap-6 sm:gap-10 justify-center items-center font-bold tracking-wide">
            <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> {siteContent.NOTICE_1 || 'Takes 24-48 hrs to deliver'}</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-[#2b3a1d]/50 rounded-full"></span>
            <span className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> {siteContent.NOTICE_2 || 'We accept bulk orders on preorder'}</span>
          </div>

          <div className="w-full flex justify-center">
            <a
              href={`https://wa.me/91${siteContent.CONTACT_NUMBER || '9945060993'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center font-bold text-[15px] md:text-lg h-[65px] px-12 md:max-w-[400px] w-full rounded-full transition-all duration-500 hover:-translate-y-1 active:scale-95 uppercase tracking-[0.25em] shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-transparent border-2 border-[#2b3a1d] rounded-full transition-all duration-500 group-hover:bg-[#2b3a1d]"></div>
              <span className="relative z-10 text-[#2b3a1d] group-hover:text-[#ebcf6c] transition-colors duration-500 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full border border-current opacity-70 hidden sm:block"></span>
                CHAT ON WHATSAPP
                <span className="w-2 h-2 rounded-full border border-current opacity-70 hidden sm:block"></span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-950 text-emerald-50 py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-20 relative z-10">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-10 group">
              <img src="/images/mana-logo.png" alt="MANA Logo" className="h-20 w-auto filter brightness-125" />
              <div className="flex flex-col">
                <span className="font-serif font-black text-6xl md:text-7xl tracking-tighter gold-text-gradient leading-none">MANA</span>
                <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-bold whitespace-nowrap">Desi-Licious Home Foods</span>
              </div>
            </div>
            <p className="text-emerald-100/40 text-lg leading-relaxed max-w-md font-light italic">
              {siteContent.FOOTER_TEXT || 'Experience the authentic taste of tradition. Every bite is a journey through heritage, prepared with love and strictly no preservatives.'}
            </p>
          </div>

          <div>
            <h4 className="text-gold-500 font-black text-sm uppercase tracking-[0.3em] mb-10">Explore</h4>
            <ul className="space-y-6">
              {['Home', 'Products', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '')}`} className="text-emerald-100/60 hover:text-gold-400 transition-colors font-medium relative group">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 transition-all group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold-500 font-black text-sm uppercase tracking-[0.3em] mb-10">Connect</h4>
            <ul className="space-y-8 text-emerald-100/60">
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-forest-900 border border-gold-500/20 rounded-xl flex items-center justify-center text-xl shadow-lg">📍</div>
                <p className="font-light">{(siteContent.ADDRESS || 'Parappana Agrahara, Bangalore 560100').split(',').map((l, i) => <span key={i}>{l.trim()}{i === 0 ? <br /> : ''}</span>)}</p>
              </li>
              <li className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-forest-900 border border-gold-500/20 rounded-xl flex items-center justify-center text-xl shadow-lg">📞</div>
                <p className="font-bold text-white">{siteContent.PHONE_1 || '+91 9945060993'}<br />{siteContent.PHONE_2 || '+91 7829029995'}</p>
              </li>
              <li className="flex gap-4 items-center mt-4">
                <a href={siteContent.FACEBOOK_URL || 'https://www.facebook.com/share/1BMTnro3vT/'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-forest-900 hover:bg-gold-500 hover:text-forest-900 border border-gold-500/20 rounded-xl flex items-center justify-center text-xl shadow-lg transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={siteContent.INSTAGRAM_URL || 'https://www.instagram.com/manadesilicioushomefoods/'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-forest-900 hover:bg-gold-500 hover:text-forest-900 border border-gold-500/20 rounded-xl flex items-center justify-center text-xl shadow-lg transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-32 pt-10 border-t border-gold-500/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.5em] text-emerald-100/20 font-black">
          <span>© 2026 MANA DESI-LICIOUS HOME FOODS</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gold-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold-500 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="fixed inset-0 bg-forest-950/90 backdrop-blur-xl transition-opacity duration-700" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-forest-900 h-full shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col transform transition-all duration-700 ease-out border-l border-gold-500/20 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gold-500/10 flex justify-between items-center bg-forest-950/40 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-500/10 rounded-xl flex items-center justify-center border border-gold-500/20 shadow-inner">
                  <ShoppingCart className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tighter leading-none mb-1">Your Bag</h2>
                  <p className="text-[8px] text-gold-500/70 font-black uppercase tracking-[0.4em] font-sans">Pure Tradition Selected</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 bg-forest-800 hover:bg-gold-500/10 text-white hover:text-gold-500 flex items-center justify-center rounded-xl transition-all border border-gold-500/10 group active:scale-95 shadow-lg"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar bg-forest-900/50">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gold-500/10 blur-3xl rounded-full scale-150"></div>
                    <div className="relative w-32 h-32 bg-forest-950 rounded-full flex items-center justify-center shadow-2xl border border-gold-500/10">
                      <ShoppingBag className="w-12 h-12 opacity-30 text-gold-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif font-black text-white mb-3 uppercase tracking-tight">Bag is empty</h3>
                  <p className="text-emerald-100/40 mb-8 leading-relaxed italic text-sm font-light">It seems you haven't added any traditional magic yet.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)} 
                    className="bg-gold-500/10 hover:bg-gold-500 text-gold-500 hover:text-forest-950 font-black text-[10px] uppercase tracking-[0.3em] px-8 py-4 rounded-xl border border-gold-500/30 transition-all shadow-xl"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="group relative bg-forest-950/40 rounded-3xl p-4 border border-gold-500/5 hover:border-gold-500/20 transition-all duration-500 shadow-xl flex flex-col gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 shrink-0 bg-forest-900 rounded-2xl overflow-hidden shadow-2xl border border-gold-500/10 group-hover:border-gold-500/30 transition-colors">
                        <img 
                          src={item.image || `/images/${item.category?.toLowerCase() || 'traditional'}.png`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          onError={(e) => e.target.src = '/images/traditional.png'} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="font-serif font-black text-lg text-white uppercase tracking-tight leading-tight flex-1 truncate">
                            {(item.name || '').replace(/\//g, '/\u200B')}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(idx)} 
                            className="p-1.5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-90"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[9px] text-gold-500/50 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-gold-500/30 rounded-full"></span>
                          <span className="truncate max-w-[150px]">{item.category?.replace(/\//g, '/\u200B')}</span> • {item.weight}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center bg-forest-950/80 rounded-xl border border-gold-500/10 p-1 shadow-inner">
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); decreaseQty(item, item.category); }} 
                              className="w-8 h-8 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-forest-950 rounded-lg transition-all font-black text-sm"
                            >-</button>
                            <span className="w-8 text-center text-xs font-black text-white">{item.qty}</span>
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(item, item.category, item.weight, item.image || item.imageUrl); }} 
                              className="w-8 h-8 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-forest-950 rounded-lg transition-all font-black text-sm"
                            >+</button>
                          </div>
                          <div className="text-right">
                            <p className="font-serif font-black text-xl text-gold-400 tracking-tighter flex items-center justify-end">
                              <span className="font-sans text-sm mr-0.5 tracking-normal opacity-70">₹</span>
                              {item.price * item.qty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-forest-950 border-t border-gold-500/20 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] relative z-20">
                <div className="bg-forest-900/40 rounded-2xl p-4 mb-5 border border-gold-500/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] text-gold-500/70 font-black uppercase tracking-[0.3em]">Subtotal</span>
                    <div className="h-px bg-gold-500/10 flex-grow mx-3"></div>
                    <span className="text-2xl font-serif font-black text-white tracking-tighter flex items-center">
                      <span className="font-sans font-bold text-xl mr-0.5 tracking-normal text-gold-500">₹</span>
                      {getTotalPrice()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] text-emerald-100/50 uppercase tracking-widest font-bold">
                    <Star className="w-2.5 h-2.5 text-gold-500/60" />
                    <span>Shipping calculated at checkout</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full relative group overflow-hidden bg-gold-500 hover:bg-gold-400 text-forest-950 font-black py-4 rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all duration-500 hover:-translate-y-1 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center gap-3 text-base uppercase tracking-[0.15em]">
                    Confirm Order
                    <CheckCircle className="w-5 h-5" />
                  </span>
                </button>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center gap-1.5 text-[8px] text-gold-500/70 font-black uppercase tracking-widest bg-forest-900/30 py-2.5 rounded-lg border border-gold-500/10 shadow-sm">
                    <Clock className="w-3 h-3" /> 24-48 Hrs
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[8px] text-gold-500/70 font-black uppercase tracking-widest bg-forest-900/30 py-2.5 rounded-lg border border-gold-500/10 shadow-sm">
                    <ShieldCheck className="w-3 h-3" /> Homemade
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
