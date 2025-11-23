import React, { useState } from 'react';
import { User, Plus, Edit, Trash2, X } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Shared/Footer';

const CustomersPage = () => {
    const { customers, addCustomer, editCustomer, deleteCustomer } = useDatabase();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData({ name: customer.name, phone: customer.phone, email: customer.email });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            deleteCustomer(id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCustomer) {
            editCustomer(editingCustomer.id, formData);
        } else {
            addCustomer(formData);
        }
        setIsModalOpen(false);
        setEditingCustomer(null);
        setFormData({ name: '', phone: '', email: '' });
    };

    return (
        <div className="flex flex-col min-h-full">
            <div className="p-8 animate-in slide-in-from-right-4 duration-300 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#0f2942]">Customer Database</h2>
                    {user?.role === 'owner' && (
                        <button
                            onClick={() => { setEditingCustomer(null); setFormData({ name: '', phone: '', email: '' }); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0f2942] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors shadow-lg shadow-blue-900/20"
                        >
                            <Plus size={18} /> Add Customer
                        </button>
                    )}
                </div>

                {customers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
                        <User size={48} className="mb-4 opacity-50" />
                        <p className="font-semibold">No customers yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customers.map((c) => (
                            <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-300 transition-all group relative">
                                {user?.role === 'owner' && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(c)} className="p-2 bg-slate-100 rounded-full hover:text-amber-500"><Edit size={14} /></button>
                                        <button onClick={() => handleDelete(c.id)} className="p-2 bg-slate-100 rounded-full hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0f2942] group-hover:text-white transition-colors">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{c.name}</h3>
                                        <p className="text-xs text-slate-400">ID: CST-{c.id}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-500">
                                    <div className="flex justify-between"><span>Phone:</span> <span className="text-slate-700">{c.phone || '-'}</span></div>
                                    <div className="flex justify-between"><span>Email:</span> <span className="text-slate-700">{c.email || '-'}</span></div>
                                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                        <span>Total Spend:</span>
                                        <span className="font-bold text-amber-500">{formatCurrency(c.spend || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />

            {/* Customer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#0f2942]">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                                <input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-[#0f2942] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors mt-2">
                                Save Customer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersPage;
