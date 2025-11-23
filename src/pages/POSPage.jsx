import React, { useState } from 'react';
import ProductGrid from '../components/POS/ProductGrid';
import CartSidebar from '../components/POS/CartSidebar';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const POSPage = () => {
    const [cart, setCart] = useState([]);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const { addTransaction, customers, settings } = useDatabase();
    const { user } = useAuth(); // Get current user for role check

    const addToCart = (product) => {
        setCart(prev => {
            const exist = prev.find(item => item.id === product.id);
            return exist
                ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                : [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
    };

    const handlePayment = (selectedCustomerId) => {
        const customer = customers.find(c => c.id === Number(selectedCustomerId)) || { name: "Walk-in Guest" };
        const subtotal = cart.reduce((a, c) => a + c.price * c.quantity, 0);
        const tax = subtotal * (settings.taxRate / 100);
        const total = subtotal + tax;

        // Create Transaction Record
        const newTransaction = {
            id: `#TRX-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            customer: customer.name,
            customerId: customer.id || null,
            items: cart,
            subtotal: subtotal,
            tax: tax,
            total: total,
            status: "Success"
        };

        addTransaction(newTransaction);
        setShowPaymentSuccess(true);

        setTimeout(() => {
            setShowPaymentSuccess(false);
            setCart([]);
        }, 2000);
    };

    return (
        <div className="flex h-full overflow-hidden relative">
            <ProductGrid addToCart={addToCart} />
            <CartSidebar
                cart={cart}
                updateQuantity={updateQuantity}
                handlePayment={handlePayment}
                customers={customers}
                settings={settings}
                user={user}
                addToCart={addToCart} // Pass addToCart for manual items
            />

            {/* Payment Success Modal */}
            {showPaymentSuccess && (
                <div className="absolute inset-0 z-[60] bg-[#0f2942]/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#0f2942] mb-2">Payment Successful!</h3>
                        <p className="text-slate-500 mb-6">Receipt has been sent to printer.</p>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-full animate-[wiggle_1s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POSPage;
