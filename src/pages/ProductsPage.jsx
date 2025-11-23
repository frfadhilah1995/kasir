import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Search, X } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import Footer from '../components/Shared/Footer';
import ProductForm from '../components/Products/ProductForm';

const ProductsPage = () => {
    const { products, addProduct, editProduct, deleteProduct, categories, addCategory, deleteCategory } = useDatabase();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [newCategory, setNewCategory] = useState("");

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const handleSave = (productData) => {
        if (editingProduct) {
            editProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-full">
            <div className="p-8 animate-in fade-in duration-300 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-[#0f2942]">Product Management</h2>
                        <p className="text-slate-400 text-sm">Manage your inventory items</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-[#0f2942] border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                        >
                            <Package size={18} /> Categories
                        </button>
                        <button
                            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0f2942] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors shadow-lg shadow-blue-900/20"
                        >
                            <Plus size={18} /> Add Product
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
                        <Package size={48} className="mb-4 opacity-50" />
                        <p className="font-semibold">No products yet</p>
                        <p className="text-sm">Click "Add Product" to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                <div className="aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                                    <img src={product.image || 'https://via.placeholder.com/300?text=No+Image'} alt={product.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(product)} className="p-2 bg-white rounded-full shadow-md hover:text-amber-500 transition-colors"><Edit size={14} /></button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 bg-white rounded-full shadow-md hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{product.category}</span>
                                        <span className="font-bold text-[#0f2942]">{formatCurrency(product.price)}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1 truncate">{product.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">{product.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            {isModalOpen && (
                <ProductForm
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    initialData={editingProduct}
                />
            )}

            {/* Category Management Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#0f2942]">Manage Categories</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-6">
                                <input
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="New category name..."
                                    className="flex-1 p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                                <button
                                    onClick={() => {
                                        if (newCategory.trim()) {
                                            addCategory(newCategory.trim());
                                            setNewCategory('');
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#0f2942] text-white rounded-lg font-bold hover:bg-[#1e3a8a]"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {categories.map(cat => (
                                    <div key={cat} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg group">
                                        <span className="font-medium text-slate-700">{cat}</span>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Delete category "${cat}"?`)) deleteCategory(cat);
                                            }}
                                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
