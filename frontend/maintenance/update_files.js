const fs = require('fs');
const path = require('path');

const filePaths = [
  'd:/antigravityProject/frontend/src/pages/HomePage.jsx',
  'd:/antigravityProject/CombinedMana/frontend/src/pages/HomePage.jsx',
  'd:/antigravityProject/frontend/src/pages/Catalog.jsx',
  'd:/antigravityProject/CombinedMana/frontend/src/pages/Catalog.jsx'
];

filePaths.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Update STATIC_MENU
    content = content.replace(/category: "Pootarekulu"/g, 'category: "Pootarekulu/Paper Sweet"');
    content = content.replace(/category: "Laddus"/g, 'category: "Laddu"');
    content = content.replace(/category: "Sunnundalu"/g, 'category: "Sunnundalu/Blackgram/Urad Dal Laddu"');
    content = content.replace(/category: "Traditional Sweets"/g, 'category: "Traditional"');
    content = content.replace(/category: "Bobbatulu"/g, 'category: "Bobbatulu/Obbattu/Pooran Poli"');
    
    // Items replace
    const replacements = {
      '"Bellam"': '"Bellam/Jaggery"',
      '"Sesame"': '"Nuvvulu/Sesame"',
      '"Groundnut"': '"Groundnut/Peanut"',
      '"Coconut"': '"Kobbari/Coconut"',
      '"Jantikalu"': '"Jantikalu/Murukulu/Chakli"',
      '"Chekka Carelu"': '"Chekka Garelu/Thattai/Nippattu"',
      '"Ariselu"': '"Ariselu/Adhirasam/Kajjaya/Anarsa"',
      '"Kajjikayalu"': '"Kajjikayelu/Karjikai/Karanji/Gujiya"',
      '"Amla"': '"Amla/Indian Gooseberry"',
      '"Prawns Pickle"': '"Prawns"',
      '"Chicken Pickle"': '"Chicken"',
      '"Mutton Pickle"': '"Mutton"',
      '"Nalla Karam"': '"Nalla Karam/Karapodi"',
      '"Coconut Karam"': '"Kobbari/Coconut Karam"',
      '"Chutney"': '"Putnala Pappu/Roasted Bengal Gram"',
      '"Raagi"': '"Ragi"',
      '"Saggubiyyam"': '"Saggubiyyam (Tapioca Pearls)"',
      '"Curd Chillies"': '"Oora Mirapakaya/Curd Chillies"',
      '"Kova Bobbatulu"': '"Kova/Coconut (Kobbari)"',
      '"Dal Bobbatulu"': '"Dal"',
      '"Instant Dosa Mix"': '"Dosa/Idli"',
      '"Instant Upma Mix"': '"Upma"',
      '"Tamarind Paste (Pulihora)"': '"Tamarind Paste (Pulihora/Pulioghere)"'
    };
    for (const [key, val] of Object.entries(replacements)) {
      content = content.split(key).join(val);
    }

    // Update 24-48 hrs text
    content = content.replace(/'Takes 24-48 hrs to prepare'/g, "'Takes 24-48 hrs to deliver'");
    content = content.replace(/'Preparation takes 24-48 hrs'/g, "'Takes 24-48 hrs to deliver'");
    content = content.replace(/'Preparation time: 24-48 hrs'/g, "'Delivery time: 24-48 hrs'");

    // Update whatsappLink handling to use primary number 9945060993
    content = content.replace(/'7829029995'/g, "'9945060993'");
    
    // Increase Business name font
    content = content.replace(/text-2xl tracking-tighter gold-text-gradient/g, 'text-4xl md:text-5xl tracking-tighter gold-text-gradient');
    content = content.replace(/text-4xl tracking-tighter gold-text-gradient/g, 'text-6xl md:text-7xl tracking-tighter gold-text-gradient');

    // Update Footer Socials and Phones
    const oldPhoneHTML = '<p className="font-bold text-white">+91 9945060993</p>'; // It was changed to 994... above
    const oldPhoneHTML2 = '<p className="font-bold text-white">+91 7829029995</p>';
    const newPhoneHTML = '<p className="font-bold text-white">+91 9945060993<br/>+91 7829029995</p>';
    content = content.replace(oldPhoneHTML, newPhoneHTML);
    content = content.replace(oldPhoneHTML2, newPhoneHTML); // just in case it didn't get replaced

    if (!content.includes('facebook.com')) {
      const socialHTML = `              <li className="flex gap-4 items-center mt-4">
                <a href="https://www.facebook.com/share/1BMTnro3vT/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-forest-900 hover:bg-gold-500 hover:text-forest-900 border border-gold-500/20 rounded-xl flex items-center justify-center text-xl shadow-lg transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/manadesilicioushomefoods/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-forest-900 hover:bg-gold-500 hover:text-forest-900 border border-gold-500/20 rounded-xl flex items-center justify-center text-xl shadow-lg transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </li>`;
      content = content.replace('</ul>\n          </div>\n        </div>', socialHTML + '\n            </ul>\n          </div>\n        </div>');
    }

    fs.writeFileSync(file, content);
  }
});

const combinedBackendData = 'd:/antigravityProject/CombinedMana/backend/data.json';
if (fs.existsSync(combinedBackendData)) {
  let data = JSON.parse(fs.readFileSync(combinedBackendData, 'utf8'));
  
  if (data.site_content) {
    let notice1 = data.site_content.find(c => c.key === 'NOTICE_1');
    if (notice1) notice1.value = 'Takes 24-48 hrs to deliver';
    
    let contact = data.site_content.find(c => c.key === 'CONTACT_NUMBER');
    if (contact) contact.value = '9945060993';
  } else if (data.siteContent) {
     let notice1 = data.siteContent.find(c => c.key === 'NOTICE_1');
    if (notice1) notice1.value = 'Takes 24-48 hrs to deliver';
    
    let contact = data.siteContent.find(c => c.key === 'CONTACT_NUMBER');
    if (contact) contact.value = '9945060993';
  } else if (data.categories) {
     // likely just data.json structure
     // we have array of objects
  }

  // Update actual JSON format of data.json
  if (Array.isArray(data)) {
     let notice1 = data.find(c => c.key === 'NOTICE_1');
     if (notice1) notice1.value = 'Takes 24-48 hrs to deliver';
     let contact = data.find(c => c.key === 'CONTACT_NUMBER');
     if (contact) contact.value = '9945060993';
  }
  
  if (data.categories) {
    const nameMap = {
      'Bellam': 'Bellam/Jaggery',
      'Sesame': 'Nuvvulu/Sesame',
      'Groundnut': 'Groundnut/Peanut',
      'Ragi': 'Ragi',
      'Ravva': 'Ravva',
      'Coconut': 'Kobbari/Coconut',
      'Gond': 'Gond',
      'Boondi': 'Boondi',
      'Jantikalu': 'Jantikalu/Murukulu/Chakli',
      'Chekka Carelu': 'Chekka Garelu/Thattai/Nippattu',
      'Karam Boondi': 'Karam Boondi',
      'Ragi Muruku': 'Ragi Muruku',
      'Ariselu': 'Ariselu/Adhirasam/Kajjaya/Anarsa',
      'Kajjikayalu': 'Kajjikayelu/Karjikai/Karanji/Gujiya',
      'Tomato': 'Tomato',
      'Mango Avakai': 'Mango Avakai',
      'Amla': 'Amla/Indian Gooseberry',
      'Prawns Pickle': 'Prawns',
      'Chicken Pickle': 'Chicken',
      'Mutton Pickle': 'Mutton',
      'Rasam': 'Rasam',
      'Nalla Karam': 'Nalla Karam/Karapodi',
      'Curry Leaves': 'Curry Leaves',
      'Coconut Karam': 'Kobbari/Coconut Karam',
      'Chutney': 'Putnala Pappu/Roasted Bengal Gram',
      'Raagi': 'Ragi',
      'Saggubiyyam': 'Saggubiyyam (Tapioca Pearls)',
      'Rice Flour': 'Rice Flour',
      'Curd Chillies': 'Oora Mirapakaya/Curd Chillies',
      'Kova Bobbatulu': 'Kova/Coconut (Kobbari)',
      'Dal Bobbatulu': 'Dal',
      'Instant Dosa Mix': 'Dosa/Idli',
      'Instant Upma Mix': 'Upma',
      'Tamarind Paste (Pulihora)': 'Tamarind Paste (Pulihora/Pulioghere)'
    };
    const catNameMap = {
      'Pootarekulu': 'Pootarekulu/Paper Sweet',
      'Laddus': 'Laddu',
      'Sunnundalu': 'Sunnundalu/Blackgram/Urad Dal Laddu',
      'Traditional Sweets': 'Traditional',
      'Non-Veg Pickles': 'Non-Veg Pickles',
      'Bobbatulu': 'Bobbatulu/Obbattu/Pooran Poli'
    };

    data.products.forEach(p => {
      if (nameMap[p.name]) p.name = nameMap[p.name];
    });
    data.categories.forEach(c => {
      if (catNameMap[c.name]) c.name = catNameMap[c.name];
    });
  }

  fs.writeFileSync(combinedBackendData, JSON.stringify(data, null, 2));
}

// same for ManaNetlify/backend/data.json just in case
const netlifyData = 'd:/antigravityProject/ManaNetlify/backend/data.json';
if (fs.existsSync(netlifyData)) {
  let content = fs.readFileSync(combinedBackendData, 'utf8');
  fs.writeFileSync(netlifyData, content);
}
