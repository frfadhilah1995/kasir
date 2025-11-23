import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

import { useDatabase } from '../../context/DatabaseContext';

const ProductForm = ({ onClose, onSave, initialData }) => {
    const { categories } = useDatabase();
    const [formData, setFormData] = useState(initialData || {
        name: '',
        category: categories[0] || 'Other',
        price: '',
        image: '',
        desc: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: Number(formData.price)
        });
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#0f2942]">{initialData ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="e.g. Fried Rice"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Price (Rp)</label>
                            <input
                                required
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                        <div className="flex gap-2">
                            <input
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                placeholder="https://..."
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Paste a direct image link (Unsplash, etc.)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            rows="2"
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Short description..."
                        />
                    </div>

                    <button type="submit" className="w-full py-3 bg-[#0f2942] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors mt-2">
                        Save Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
