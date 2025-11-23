import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, User, PlusCircle } from 'lucide-react';

const CartSidebar = ({ cart, updateQuantity, handlePayment, customers, settings, user, addToCart }) => {
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualItem, setManualItem] = useState({ name: '', price: '' });

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const subtotal = cart.reduce((a, c) => a + c.price * c.quantity, 0);
    const taxRate = settings?.taxRate || 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    const handleAddManualItem = () => {
        if (manualItem.name && manualItem.price) {
            addToCart({
                id: `manual-${Date.now()}`,
                name: manualItem.name,
                price: Number(manualItem.price),
                image: 'https://via.placeholder.com/150?text=Manual',
                category: 'Manual'
            });
            setManualItem({ name: '', price: '' });
            setShowManualInput(false);
        }
    };

    return (
        <div className="w-[380px] bg-white shadow-2xl flex flex-col border-l border-slate-100 z-30 h-full">
            <div className="p-6 bg-slate-50 border-b border-slate-100 shrink-0 space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Current Order</h2>
                    <p className="text-xs text-slate-400">Order ID #{Math.floor(Math.random() * 10000)}</p>
                </div>

                {/* Customer Select */}
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Customer</label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value="">Walk-in Guest</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Admin Only: Manual Item Entry */}
                {user?.role === 'owner' && (
                    <div>
                        <button
                            onClick={() => setShowManualInput(!showManualInput)}
                            className="text-xs font-bold text-[#0f2942] flex items-center gap-1 hover:underline"
                        >
                            <PlusCircle size={14} /> Add Manual Item
                        </button>

                        {showManualInput && (
                            <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg space-y-2 animate-in slide-in-from-top-2">
                                <input
                                    placeholder="Item Name"
                                    value={manualItem.name}
                                    onChange={e => setManualItem({ ...manualItem, name: e.target.value })}
                                    className="w-full p-2 text-sm border border-slate-200 rounded"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={manualItem.price}
                                        onChange={e => setManualItem({ ...manualItem, price: e.target.value })}
                                        className="w-full p-2 text-sm border border-slate-200 rounded"
                                    />
                                    <button
                                        onClick={handleAddManualItem}
                                        className="px-3 py-1 bg-[#0f2942] text-white rounded text-sm font-bold"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="text-center mt-20 text-slate-300">
                        <ShoppingCart size={48} className="mx-auto mb-2 opacity-20" />
                        <p>No items yet</p>
                    </div>
                ) : cart.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-slate-100" />
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                            <p className="text-xs text-slate-500 mb-2">{formatCurrency(item.price)}</p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200"><Minus size={12} /></button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-[#0f2942] text-white flex items-center justify-center hover:bg-blue-900"><Plus size={12} /></button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                            <span className="font-bold text-sm">{formatCurrency(item.price * item.quantity)}</span>
                            <button onClick={() => updateQuantity(item.id, -100)} className="text-red-300 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)] shrink-0">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm"><span>Subtotal</span> <span className="font-bold">{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between text-sm text-slate-500"><span>Tax ({taxRate}%)</span> <span>{formatCurrency(tax)}</span></div>
                    <div className="flex justify-between text-lg font-extrabold text-[#0f2942] pt-2 border-t border-slate-100">
                        <span>Total</span> <span>{formatCurrency(total)}</span>
                    </div>
                </div>
                <button onClick={() => handlePayment(selectedCustomer)} disabled={cart.length === 0}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-white font-bold shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    PAY NOW
                </button>
            </div>
        </div>
    );
};

export default CartSidebar;
