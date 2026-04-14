import React, { useState, useEffect } from 'react';
import { RefreshCw, Package, Users, Plus, X, Lock, LogOut, Edit3, ChevronDown, ChevronRight, Edit2, GripVertical } from 'lucide-react';
import API_BASE_URL from '../config';

const resolveImageUrl = (url) => {
  if (!url) return "/images/traditional.png";
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
  return url;
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [errorProp, setErrorProp] = useState("");

  const [activeTab, setActiveTab] = useState("inventory");
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [siteSettings, setSiteSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [expandedCats, setExpandedCats] = useState({});
  const [orderedCats, setOrderedCats] = useState([]);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Keep orderedCats in sync when categories data refreshes
  React.useEffect(() => {
    const sorted = [...categories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    setOrderedCats(sorted);
  }, [categories]);

  const sortedCategories = orderedCats;

  const toggleCat = (catName) => setExpandedCats(prev => ({...prev, [catName]: !prev[catName]}));

  const handleDragStart = (e, catId) => {
    e.dataTransfer.setData('text/plain', String(catId));
    e.dataTransfer.effectAllowed = 'move';
    // slight opacity on the dragged ghost
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDragOverIdx(null);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIdx(idx);
  };

  const handleDragLeave = () => {
    setDragOverIdx(null);
  };

  const handleDrop = async (e, targetIdx) => {
    e.preventDefault();
    setDragOverIdx(null);
    const srcId = parseInt(e.dataTransfer.getData('text/plain'));
    const srcIdx = orderedCats.findIndex(c => c.id === srcId);
    if (srcIdx < 0 || srcIdx === targetIdx) return;

    // Update local state instantly for smooth UX
    const newCats = [...orderedCats];
    const [moved] = newCats.splice(srcIdx, 1);
    newCats.splice(targetIdx, 0, moved);
    const withOrder = newCats.map((cat, idx) => ({ ...cat, displayOrder: idx + 1 }));
    setOrderedCats(withOrder);

    // Persist to backend
    try {
      await fetch(`${API_BASE_URL}/api/categories/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withOrder)
      });
      fetchData();
    } catch (err) {
      console.error('Reorder failed', err);
      fetchData(); // revert to server state on error
    }
  };

  const groupedProducts = sortedCategories.reduce((acc, cat) => {
    acc[cat.name] = { category: cat, products: products.filter(p => p.category?.id === cat.id) };
    return acc;
  }, {});

  // Modals state
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  
  const [newCat, setNewCat] = useState({ name: '', imageUrl: '' });
  const [newItem, setNewItem] = useState({ 
    categoryId: '', 
    name: '', 
    description: '', 
    price: '', 
    weight: '', 
    imageUrl: '' 
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingData, setEditingData] = useState(null); // { productId, stockId, name, description, categoryId, weight, price, imageUrl, inStock }

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'manadesi123') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setErrorProp("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/products`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/categories`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/content`).then(res => res.json())
    ]).then(([prodData, catData, contentData]) => {
      setProducts(prodData);
      setCategories(catData);
      setSiteSettings(contentData || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };




  const handleCreateProduct = (e) => {
    e.preventDefault();
    if(!newItem.categoryId || !newItem.name || !newItem.price) return;
    
    const productPayload = {
      name: newItem.name,
      description: newItem.description,
      imageUrl: newItem.imageUrl,
      category: { id: parseInt(newItem.categoryId) },
      stockLevels: [
        {
          weight: newItem.weight || '1 Item',
          price: parseFloat(newItem.price),
          inStock: true
        }
      ]
    };

    fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productPayload)
    })
    .then(res => res.json())
    .then(() => {
      setNewItem({ 
        categoryId: categories.length > 0 ? categories[0].id : '', 
        name: '', description: '', price: '', weight: '', 
        imageUrl: '' 
      });
      setShowItemForm(false);
      fetchData();
    });
  };

  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [editingCatData, setEditingCatData] = useState(null);

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!editingCatData) return;
    fetch(`${API_BASE_URL}/api/categories/${editingCatData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingCatData.name, imageUrl: editingCatData.imageUrl, description: editingCatData.description })
    }).then(() => {
      setShowEditCatModal(false);
      fetchData();
    }).catch(err => console.error(err));
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    // Assign a displayOrder at the end
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.displayOrder || 0), 0);
    const payload = {
      name: newCat.name.trim(),
      imageUrl: newCat.imageUrl || '',
      description: newCat.description || '',
      displayOrder: maxOrder + 1
    };
    fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      setNewCat({ name: '', imageUrl: '', description: '' });
      setShowCatForm(false);
      fetchData();
    })
    .catch(err => { console.error(err); alert('Failed to create category. Check server connection.'); });
  };

  const toggleStock = (stockId) => {
    fetch(`${API_BASE_URL}/api/stock/${stockId}/toggle`, { method: 'PUT' })
      .then(() => fetchData())
      .catch(err => console.error(err));
  };

  const handleImageUpload = (file, isCategory) => {
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    })
    .then(async res => {
      if (!res.ok) {
         const txt = await res.text();
         throw new Error(txt || res.statusText);
      }
      return res.json();
    })
    .then(data => {
      if (isCategory) {
        setNewCat(prev => ({...prev, imageUrl: data.imageUrl}));
      } else {
        setNewItem(prev => ({...prev, imageUrl: data.imageUrl}));
      }
      setUploadingImage(false);
    })
    .catch(err => {
      console.error("Upload failed", err);
      alert("Image upload failed! File might be too large or server is down. Error: " + err.message);
      setUploadingImage(false);
    });
  };

  const handleUpdateAll = (e) => {
    e.preventDefault();
    if (!editingData) return;

    const productPromise = fetch(`${API_BASE_URL}/api/products/${editingData.productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingData.name,
        description: editingData.description,
        imageUrl: editingData.imageUrl,
        category: { id: editingData.categoryId }
      })
    });

    const stockPromise = fetch(`${API_BASE_URL}/api/stock/${editingData.stockId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weight: editingData.weight,
        price: parseFloat(editingData.price),
        inStock: editingData.inStock
      })
    });

    Promise.all([productPromise, stockPromise])
      .then(() => {
        setShowEditModal(false);
        fetchData();
      })
      .catch(err => console.error(err));
  };

  const updatePrice = (stockId, newPrice) => {
    fetch(`${API_BASE_URL}/api/stock/${stockId}/price?price=${newPrice}`, { method: 'PUT' })
      .then(() => fetchData())
      .catch(err => console.error(err));
  };

  const handleAction = (action, stockId, currentPrice, productId, product, stock) => {
    if (!action) return;
    if (action === 'toggle') {
      toggleStock(stockId);
    } else if (action === 'price') {
      const p = prompt("Enter new price", currentPrice);
      if(p && !isNaN(p)) updatePrice(stockId, p);
    } else if (action === 'edit_all') {
      setEditingData({
        productId,
        stockId,
        name: product.name,
        description: product.description || '',
        categoryId: product.category?.id || '',
        weight: stock.weight,
        price: stock.price,
        imageUrl: product.imageUrl || '',
        inStock: stock.inStock
      });
      setShowEditModal(true);
    } else if (action === 'variant') {
      const weight = prompt("Enter new weight/variant name (e.g., 1KG, Large Box):");
      if (!weight) return;
      const price = prompt("Enter price for this new variant:", "0");
      if (price === null || isNaN(price)) return;
      
      fetch(`${API_BASE_URL}/api/products/${productId}/stock`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ weight, price: parseFloat(price), inStock: true })
      })
      .then(() => fetchData())
      .catch(err => console.error(err));
    } else if (action === 'delete') {
      if (window.confirm("Are you sure you want to delete this specific variant?")) {
         fetch(`${API_BASE_URL}/api/stock/${stockId}`, { method: 'DELETE' })
          .then(() => fetchData())
          .catch(err => console.error(err));
      }
    } else if (action === 'delete_product') {
       if (window.confirm(`WARNING: Are you sure you want to delete the entire product group? This will remove all weights/variants associated with it.`)) {
         if (productId) {
           fetch(`${API_BASE_URL}/api/products/${productId}`, { method: 'DELETE' })
            .then(() => fetchData())
            .catch(err => console.error(err));
         } else {
           alert("Could not find Product ID for deletion.");
         }
       }
    }
    // Reset dropdown
    const selectEl = document.getElementById(`action-${stockId}`);
    if (selectEl) selectEl.value = "";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-900 border-t-4 border-gold-500">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-forest-50 p-4 rounded-full flex items-center justify-center shadow-inner">
              <Lock className="w-10 h-10 text-forest-900" />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-center text-forest-900 mb-2">Admin Portal</h2>
          <p className="text-center text-gray-500 mb-8 font-light">Enter key to access Mana Desi-licious</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-gray-50 border-2 border-gray-100 placeholder-gray-400 text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            {errorProp && <p className="text-red-500 text-sm text-center font-medium animate-pulse">{errorProp}</p>}
            <button 
              type="submit"
              className="w-full bg-forest-900 hover:bg-forest-800 text-white font-medium py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Unlock Access
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-6 mt-4">For demo purposes, password is <code>manadesi123</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-forest-900 text-white flex flex-col shadow-2xl z-10 sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold text-gold-500">Mana Admin</h1>
          <p className="text-forest-200 text-sm mt-1">Management Portal</p>
        </div>
        
        <nav className="flex-1 mt-6 space-y-2 px-4">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-gold-500 text-forest-900 font-bold shadow-md' : 'text-forest-100 hover:bg-forest-800'}`}
          >
            <Package className="w-5 h-5" />
            <span>Inventory</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-gold-500 text-forest-900 font-bold shadow-md' : 'text-forest-100 hover:bg-forest-800'}`}
          >
            <Users className="w-5 h-5" />
            <span>Manage Users</span>
          </button>
          <button 
            onClick={() => setActiveTab('site_editor')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'site_editor' ? 'bg-gold-500 text-forest-900 font-bold shadow-md' : 'text-forest-100 hover:bg-forest-800'}`}
          >
            <Edit3 className="w-5 h-5" />
            <span>Site Content Editor</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-forest-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-forest-800 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'inventory' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-forest-900">Inventory Dashboard</h2>
                  <p className="text-gray-500 text-sm mt-1">Manage the default menu and customized categories.</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowCatForm(true)}
                    className="flex items-center space-x-2 bg-forest-50 px-4 py-2.5 rounded-lg font-medium text-forest-900 hover:bg-forest-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Category</span>
                  </button>
                  <button onClick={fetchData} className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {sortedCategories.map((cat, catIdx) => {
                  const catName = cat.name;
                  const group = groupedProducts[catName];
                  if (!group) return null;
                  const isExpanded = expandedCats[catName] !== false;
                  
                  return (
                    <div
                      key={cat.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cat.id)}
                      onDragOver={(e) => handleDragOver(e, catIdx)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, catIdx)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white shadow-lg rounded-2xl overflow-hidden border-2 transition-all duration-150 select-none ${
                        dragOverIdx === catIdx
                          ? 'border-gold-500 shadow-xl shadow-gold-500/20 -translate-y-1'
                          : 'border-transparent'
                      }`}
                    >
                        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors border-b border-gray-100">
                         <div className="flex items-center space-x-3">
                             <div
                               className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gold-500 transition-colors p-1"
                               onClick={e => e.stopPropagation()}
                               title="Drag to reorder"
                             >
                               <GripVertical className="w-5 h-5" />
                             </div>
                             <div
                               className="flex items-center space-x-4 cursor-pointer flex-1"
                               onClick={() => toggleCat(catName)}
                             >
                               {isExpanded ? <ChevronDown className="w-6 h-6 text-gold-500" /> : <ChevronRight className="w-6 h-6 text-gold-500" />}
                               <div className="flex flex-col">
                                 <h3 className="text-xl font-serif font-black text-forest-900 uppercase tracking-widest">{catName}</h3>
                                 {group.category.description && <p className="text-xs text-gray-400 font-medium italic mt-0.5">{group.category.description}</p>}
                               </div>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setEditingCatData(group.category);
                                   setShowEditCatModal(true);
                                 }}
                                 className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                 title="Edit Category Details"
                               >
                                 <Edit2 className="w-4 h-4" />
                               </button>
                               <span className="text-xs font-bold text-forest-800 bg-gold-500/20 px-3 py-1 rounded-full">
                                 {group.products.reduce((acc, p) => acc + (p.stockLevels?.length || 0), 0)} Varieties
                               </span>
                             </div>
                         </div>
                        <div className="flex items-center space-x-3">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               if (window.confirm(`Are you sure you want to delete the category "${catName}" and all its products?`)) {
                                  fetch(`${API_BASE_URL}/api/categories/${group.category.id}`, { method: 'DELETE' }).then(() => fetchData());
                               }
                             }}
                             className="p-2.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors mr-2"
                             title="Delete Category"
                           >
                             <X className="w-5 h-5" />
                           </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               const defaultWeight = catName === 'Pootarekulu' ? '10 Pcs' : '250 Gms';
                               setNewItem(prev => ({...prev, categoryId: group.category.id, weight: defaultWeight}));
                               setShowItemForm(true);
                             }}
                             className="flex items-center space-x-2 bg-gold-500 text-forest-900 hover:bg-gold-400 px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                           >
                             <Plus className="w-4 h-4" />
                             <span>Add Item Here</span>
                           </button>
                        </div>
                       </div>

                      {isExpanded && (
                        <div className="overflow-x-auto bg-gray-50/20">
                           {group.products.length > 0 ? (
                             <table className="w-full text-left border-collapse">
                               <thead>
                                 <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-100">
                                   <th className="p-5 font-black">Product Name</th>
                                   <th className="p-5 font-black hidden lg:table-cell">Category</th>
                                   <th className="p-5 font-black">Quantity/Weight</th>
                                   <th className="p-5 font-black">Price (₹)</th>
                                   <th className="p-5 font-black text-center">Status</th>
                                   <th className="p-5 font-black text-right">Actions</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-100">
                                 {group.products.map((product) => (
                                   product.stockLevels?.map((stock) => (
                                     <tr key={`${product.id}-${stock.id}`} className="hover:bg-orange-50/30 transition-colors group/row">
                                       <td className="p-5">
                                         <div className="flex items-center space-x-4">
                                           <img src={resolveImageUrl(product.imageUrl)} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gold-500/20" />
                                           <div>
                                             <span className="block font-bold text-gray-800">{product.name}</span>
                                           </div>
                                         </div>
                                       </td>
                                       <td className="p-5 hidden lg:table-cell">
                                         <span className="inline-block px-3 py-1 bg-white text-gray-500 rounded-full text-xs font-bold border border-gray-200/60 shadow-sm uppercase tracking-wide">
                                           {product.category?.name || 'Uncategorized'}
                                         </span>
                                       </td>
                                       <td className="p-5 font-black text-forest-900 tracking-wide text-sm">{stock.weight}</td>
                                       <td className="p-5">
                                         <div className="flex items-center space-x-1 group-hover/row:scale-105 transition-transform origin-left">
                                           <span className="text-gray-400 text-sm font-black">₹</span>
                                           <input 
                                             key={`price-input-${stock.id}-${stock.price}`}
                                             type="number" 
                                             defaultValue={stock.price}
                                             onBlur={(e) => updatePrice(stock.id, e.target.value)}
                                             className="w-24 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-gold-500 px-1 py-1 font-black text-gray-800 focus:outline-none transition-colors"
                                           />
                                         </div>
                                       </td>
                                       <td className="p-5 text-center">
                                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${stock.inStock ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                           {stock.inStock ? 'In Stock' : 'Out of Stock'}
                                         </span>
                                       </td>
                                       <td className="py-5 px-6 font-medium text-right">
                                         <select 
                                           id={`action-${stock.id}`}
                                           value=""
                                           onChange={(e) => handleAction(e.target.value, stock.id, stock.price, product.id, product, stock)}
                                           className="bg-white border-2 border-forest-100 text-forest-900 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all cursor-pointer shadow-sm hover:border-forest-200 text-right appearance-none"
                                         >
                                           <option value="" disabled>⚙️ Options</option>
                                           <option value="toggle" className="font-medium text-forest-900">
                                             {stock.inStock ? '🚫 Mark Out of Stock' : '✅ Mark In Stock'}
                                           </option>
                                           <option value="edit_all" className="font-medium text-emerald-600">📝 Edit Lead/Product</option>
                                           <option value="price" className="font-medium text-forest-900">💵 Update Price</option>
                                           <option value="variant" className="font-medium text-blue-600">➕ Add New Weight</option>
                                           <option disabled>──────────</option>
                                           <option value="delete" className="font-medium text-red-500">🗑️ Delete Variant</option>
                                           <option value="delete_product" className="font-medium text-red-700">⚠️ Delete Product</option>
                                         </select>
                                       </td>
                                     </tr>
                                   ))
                                 ))}
                               </tbody>
                             </table>
                           ) : (
                             <div className="p-12 text-center text-gray-400 font-medium italic">
                               No items in this category yet. Click 'Add Item Here' to start populating this menu section!
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {Object.keys(groupedProducts).length === 0 && !loading && (
                   <div className="p-16 bg-white rounded-3xl border border-dashed border-gray-300 text-center text-gray-500 shadow-sm font-medium">
                     No categories exist. Create a new category first!
                   </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
           <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
             <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10" />
             </div>
             <h2 className="text-3xl font-serif font-bold text-forest-900 mb-2">User Management</h2>
             <p className="text-gray-500 text-center max-w-md">This module allows checking registered customers or other admins. Currently in development.</p>
           </div>
          )}

          {activeTab === 'site_editor' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-forest-900">Live Site Editor</h2>
                  <p className="text-gray-500 text-sm mt-1">Directly modify the text shown on your live storefront pages.</p>
                </div>
                <button 
                  onClick={() => {
                    fetch(`${API_BASE_URL}/api/content`, {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify(siteSettings)
                    }).then(() => alert('Live site updated successfully!'));
                  }}
                  className="bg-gold-500 text-forest-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gold-400 transition"
                >
                  Publish Changes
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 grid gap-6">
                {siteSettings.map((setting, idx) => (
                  <div key={setting.contentKey} className="border-b border-gray-100 pb-6 relative group">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{setting.contentKey.replace(/_/g, ' ')}</label>
                    <textarea 
                      rows="2"
                      value={setting.contentValue}
                      onChange={(e) => {
                        const newSettings = [...siteSettings];
                        newSettings[idx].contentValue = e.target.value;
                        setSiteSettings(newSettings);
                      }}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-gold-500 rounded-xl px-5 py-3 font-medium text-gray-800 transition shadow-inner resize-y"
                    />
                  </div>
                ))}
                {siteSettings.length === 0 && (
                  <p className="text-center text-gray-400 italic">No site content seeds found. Please restart backend database.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Adding Modals */}
      {showCatForm && (
        <div className="fixed inset-0 bg-forest-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in-up">
            <button onClick={() => setShowCatForm(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-serif font-bold text-forest-900 mb-6">New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input required type="text" value={newCat.name} onChange={e=>setNewCat({...newCat, name: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 transition-all font-medium text-gray-800" placeholder="E.g., Pickles, Sweets, Podis" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea rows="2" value={newCat.description || ''} onChange={e=>setNewCat({...newCat, description: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-all resize-none text-gray-800" placeholder="Short description shown on website..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                <div className="flex space-x-2 items-center">
                  <input type="text" value={newCat.imageUrl || ''} onChange={e=>setNewCat({...newCat, imageUrl: e.target.value})} className="flex-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-all font-medium text-gray-600 text-sm" placeholder="Paste URL or pick file →" />
                  <label className={`flex items-center space-x-1.5 border-2 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer text-sm ${uploadingImage ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-gold-500/10 text-forest-900 border-gold-500/40 hover:bg-gold-500/20'}`}>
                    <span>📁</span>
                    <span>{uploadingImage ? 'Uploading...' : 'Browse File'}</span>
                    <input type="file" className="hidden" accept="image/*" disabled={uploadingImage} onChange={e => handleImageUpload(e.target.files[0], true)} />
                  </label>
                </div>
                {newCat.imageUrl && (
                  <div className="mt-2 flex items-center space-x-2">
                    <img src={newCat.imageUrl.startsWith('/uploads/') ? `${API_BASE_URL}${newCat.imageUrl}` : newCat.imageUrl} alt="preview" className="h-12 w-12 rounded-lg object-cover border border-gray-200" onError={e => e.target.style.display='none'} />
                    <span className="text-xs text-green-600 font-medium">✓ Image set</span>
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-forest-900 text-white font-bold py-3.5 rounded-xl hover:bg-forest-800 transition-colors shadow-lg shadow-forest-900/30">Create Category</button>
            </form>
          </div>
        </div>
      )}

      {showItemForm && (
        <div className="fixed inset-0 bg-forest-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowItemForm(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-serif font-bold text-forest-900 mb-6">
              Add item under {categories.find(c => String(c.id) === String(newItem.categoryId))?.name || 'Category'}
            </h3>
            <form onSubmit={handleCreateProduct} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required value={newItem.categoryId} onChange={e=>setNewItem({...newItem, categoryId: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-all text-gray-800">
                    <option value="" disabled>Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity/Weight</label>
                  <input required type="text" value={newItem.weight} onChange={e=>setNewItem({...newItem, weight: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-all text-gray-800" placeholder="e.g. 500g, 1KG, Box" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input required type="text" value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-all text-gray-800" placeholder="Mango Pickle, Kaju Barfi..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea rows="2" value={newItem.description} onChange={e=>setNewItem({...newItem, description: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-all resize-none text-gray-800" placeholder="Authentic details..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" step="0.01" value={newItem.price} onChange={e=>setNewItem({...newItem, price: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-all text-gray-800" placeholder="e.g. 450" />
                </div>
              </div>

              <button type="submit" className="w-full bg-gold-500 text-forest-900 font-bold py-4 rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/30 mt-6">Publish Item to Catalog</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Custom Styles for Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      {/* Zoho-Style Edit Modal */}
      {showEditModal && editingData && (
        <div className="fixed inset-0 bg-forest-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-10 relative animate-fade-in-up border border-gold-500/20 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">📝</div>
              <div>
                <h3 className="text-3xl font-serif font-black text-forest-900">Modify Lead Details</h3>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.1em]">Editing Reference: #{editingData.productId}-{editingData.stockId}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateAll} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Item Name</label>
                  <input required type="text" value={editingData.name} onChange={e=>setEditingData({...editingData, name: e.target.value})} className="w-full border-2 border-gray-100 bg-gray-50/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-bold text-gray-800" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description / Notes</label>
                  <textarea rows="3" value={editingData.description} onChange={e=>setEditingData({...editingData, description: e.target.value})} className="w-full border-2 border-gray-100 bg-gray-50/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-medium text-gray-600" />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Weight/Variant</label>
                  <input required type="text" value={editingData.weight} onChange={e=>setEditingData({...editingData, weight: e.target.value})} className="w-full border-2 border-gray-100 bg-gray-50/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-bold text-gray-800" />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Market Price (₹)</label>
                  <input required type="number" value={editingData.price} onChange={e=>setEditingData({...editingData, price: e.target.value})} className="w-full border-2 border-gray-100 bg-gray-50/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-black text-gold-600" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                  <input type="text" value={editingData.imageUrl} onChange={e=>setEditingData({...editingData, imageUrl: e.target.value})} className="w-full border-2 border-gray-100 bg-gray-50/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-medium text-gray-500" />
                </div>

                <div className="col-span-2 flex items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <label className="flex items-center space-x-4 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" checked={editingData.inStock} onChange={e=>setEditingData({...editingData, inStock: e.target.checked})} className="sr-only" />
                      <div className={`w-14 h-8 rounded-full transition-colors ${editingData.inStock ? 'bg-green-500' : 'bg-red-400'}`}></div>
                      <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${editingData.inStock ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs text-gray-700">{editingData.inStock ? 'Available for Customers' : 'Marked as Sold Out'}</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-8 py-5 border-2 border-gray-100 font-black text-gray-400 rounded-2xl hover:bg-gray-50 uppercase tracking-widest text-xs transition-all">Cancel</button>
                <button type="submit" className="flex-[2] bg-forest-900 text-gold-400 font-black py-5 rounded-2xl hover:bg-forest-800 transition-all shadow-xl shadow-forest-900/30 uppercase tracking-[0.2em] text-xs">Save Lead Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCatModal && editingCatData && (
        <div className="fixed inset-0 bg-forest-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 relative animate-fade-in-up border border-gold-500/20">
            <button onClick={() => setShowEditCatModal(false)} className="absolute top-8 right-8 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-all">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-3xl font-serif font-black text-forest-900 mb-8 flex items-center">
               <Edit2 className="w-6 h-6 mr-3 text-gold-500" /> Edit Category
            </h3>
            <form onSubmit={handleUpdateCategory} className="space-y-6">
               <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category Name</label>
                 <input required type="text" value={editingCatData.name} onChange={e=>setEditingCatData({...editingCatData, name: e.target.value})} className="w-full border-2 border-gray-100 bg-gray-50/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-bold text-gray-800" />
               </div>
               <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Root Description</label>
                 <textarea rows="3" value={editingCatData.description || ''} onChange={e=>setEditingCatData({...editingCatData, description: e.target.value})} className="w-full border-2 border-gray-100 bg-gray-50/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-medium text-gray-600" placeholder="Classic soft and nutritious..." />
               </div>
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                  <div className="flex space-x-2">
                    <input type="text" value={editingCatData.imageUrl || ''} onChange={e=>setEditingCatData({...editingCatData, imageUrl: e.target.value})} className="flex-1 border-2 border-gray-100 bg-gray-50/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-medium text-gray-500" />
                    <label className={`border-2 px-6 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center whitespace-nowrap uppercase tracking-widest text-[10px] ${uploadingImage ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-forest-100 text-forest-900 border-forest-200 hover:bg-forest-200 cursor-pointer'}`}>
                      {uploadingImage ? '...' : 'Upload'}
                      <input type="file" className="hidden" accept="image/*" disabled={uploadingImage} onChange={e => handleImageUpload(e.target.files[0], true)} />
                    </label>
                  </div>
               </div>
               <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setShowEditCatModal(false)} className="flex-1 px-8 py-5 border-2 border-gray-100 font-black text-gray-400 rounded-2xl hover:bg-gray-50 uppercase tracking-widest text-xs transition-all">Cancel</button>
                  <button type="submit" className="flex-[2] bg-forest-900 text-gold-400 font-black py-5 rounded-2xl hover:bg-forest-800 transition-all shadow-xl shadow-forest-900/30 uppercase tracking-[0.2em] text-xs">Save Category</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
