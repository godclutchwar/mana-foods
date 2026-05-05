const fs = require('fs');

const menuData = `const STATIC_MENU = [
  {
    category: "POOTAREKULU/PAPER SWEET",
    desc: "Traditional paper-thin sweet wafers",
    weight: "10 Pcs",
    image: "/images/pootharekulu.png",
    items: [
      { name: "Bellam/Jaggery", price: 200 },
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
      { name: "Nuvvulu/Sesame", price: 190 },
      { name: "Dryfruit", price: 300 },
      { name: "Ragi", price: 200 },
      { name: "Ravva", price: 160 },
      { name: "Kobbari/Coconut", price: 170 },
      { name: "Groundnut/Peanut", price: 170 },
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
      { name: "Jantikalu/Murukulu/Chakli", price: 150 },
      { name: "Chekka Garelu/Thattai/Nippattu", price: 180 },
      { name: "Karam Boondi", price: 140 },
      { name: "Ragi Muruku", price: 140 },
      { name: "Millet Muuku", price: 150 }
    ]
  },
  {
    category: "SUNNUNDALU/BLACKGRAM/URAD DAL LADDU",
    desc: "Nutritious Urad Dal Ladoos",
    weight: "250 Gms",
    image: "/images/sunnundalu.png",
    items: [
      { name: "Bellam/Jaggery", price: 190 },
      { name: "Sugar", price: 180 },
    ]
  },
  {
    category: "TRADITIONAL SWEETS",
    desc: "Heritage Home Made food festive favorites",
    weight: "250 Gms",
    image: "/images/traditional.png",
    items: [
      { name: "Ariselu/Adhirasam/Kajjaya/Anarsa", price: 200 },
      { name: "Kajjikayelu/Karjikai/Karanji/Gujiya", price: 160 },
    ]
  },
  {
    category: "CHIKKIS",
    desc: "Crunchy traditional brittle",
    weight: "250 Gms",
    image: "/images/chikkis.png",
    items: [
      { name: "Nuvvulu/Sesame", price: 180 },
      { name: "Groundnut/Peanut/palli", price: 150 },
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
      { name: "Amla/Indian Gooseberry", price: 200 },
      { name: "Drum Stick/Moringa", price: 150 }
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
      { name: "Nalla Karam/Karapodi", price: 60 },
      { name: "Curry Leaves", price: 60 },
      { name: "Kobbari/Coconut Karam", price: 60 },
      { name: "Putnala Pappu/Roasted Bengal Gram", price: 70 },
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
      { name: "Oora Mirapakaya/Curd Chillies", price: 70 },
    ]
  },
  {
    category: "BOBBATULU/OBBATTU/POORAN POLI",
    desc: "Traditional stuffed sweet flatbreads",
    weight: "1 PC",
    image: "/images/bobbatulu.png",
    items: [
      { name: "Kova/Coconut (Kobbari)", price: 40 },
      { name: "Dal", price: 30 }
    ]
  },
  {
    category: "INSTANT MIXES",
    desc: "Quick and easy traditional meals",
    weight: "100 Gms",
    image: "/images/instantmixes.png",
    items: [
      { name: "Dosa/Idli", price: 60 },
      { name: "Upma", price: 40 }
    ]
  },
  {
    category: "PASTE",
    desc: "Authentic rich cooking pastes",
    weight: "250 Gms",
    image: "/images/paste.png",
    items: [
      { name: "Tamarind Paste(Pulihora/Pulioghere)", price: 125 }
    ]
  },
  {
    category: "JUNNU/MILK PUDDING/GINNU/SEEM PAAL",
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
];`;

const files = [
  'd:/antigravityProject/frontend/src/pages/HomePage.jsx',
  'd:/antigravityProject/CombinedMana/frontend/src/pages/HomePage.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const startIdx = content.indexOf('const STATIC_MENU = [');
    if (startIdx !== -1) {
      const endIdx = content.indexOf('];', startIdx) + 2;
      content = content.substring(0, startIdx) + menuData + content.substring(endIdx);
      fs.writeFileSync(file, content);
      console.log('Updated', file);
    }
  }
});
