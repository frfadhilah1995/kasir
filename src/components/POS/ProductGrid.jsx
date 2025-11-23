import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

const ProductGrid = ({ addToCart }) => {
    const { products } = useDatabase();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All Products");

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const filteredProducts = products.filter(p =>
        (activeCategory === "All Products" || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden h-full">
            {/* Header POS (Search & Categories) */}
            <div className="pt-8 px-8 pb-4 shrink-0">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0f2942]">Choose Products</h2>
                        <p className="text-slate-400 text-sm">Select category and add items</p>
                    </div>
                    {/* Search */}
                    <div className="relative group w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {["All Products", ...new Set(products.map(p => p.category))].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-[#0f2942] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Produk */}
            <div className="flex-1 overflow-y-auto px-8 pb-20">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p>No products found</p>
                        <p className="text-xs">Go to "Items" menu to add products</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <div key={product.id} onClick={() => addToCart(product)}
                                className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group border border-slate-100">
                                <div className="aspect-square bg-slate-100 rounded-xl mb-3 overflow-hidden relative">
                                    <img src={product.image || 'https://via.placeholder.com/300?text=No+Image'} alt={product.name} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={16} className="text-[#0f2942]" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm truncate">{product.name}</h3>
                                <p className="font-extrabold text-[#0f2942] text-sm">{formatCurrency(product.price)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;
