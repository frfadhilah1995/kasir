import React from 'react';
import { Clock } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import Footer from '../components/Shared/Footer';

const TransactionsPage = () => {
    const { transactions, voidTransaction } = useDatabase();
    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className="flex flex-col min-h-full">
            <div className="p-8 animate-in slide-in-from-bottom-4 duration-300 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#0f2942]">Transaction History</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                        <Clock size={16} /> Filter Date
                    </button>
                </div>

                {transactions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-400">
                        <Clock size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Customer</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Amount</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((t, idx) => (
                                    <tr key={idx} className={`hover:bg-slate-50 transition-colors ${t.status === 'Void' ? 'opacity-50 bg-slate-50' : ''}`}>
                                        <td className="p-4 text-sm font-bold text-slate-700">{t.id}</td>
                                        <td className="p-4 text-sm text-slate-500">{t.date}</td>
                                        <td className="p-4 text-sm text-slate-800">{t.customer}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${t.status === 'Success' ? 'bg-green-100 text-green-600' :
                                                t.status === 'Void' ? 'bg-red-100 text-red-600 line-through' :
                                                    'bg-amber-100 text-amber-600'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className={`p-4 text-sm font-bold text-right ${t.status === 'Void' ? 'text-slate-400 line-through' : 'text-[#0f2942]'}`}>
                                            {formatCurrency(t.total)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {t.status !== 'Void' && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to VOID this transaction? This will reverse the sales.')) {
                                                            voidTransaction(t.id, 'Admin');
                                                        }
                                                    }}
                                                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                                                >
                                                    VOID
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default TransactionsPage;
