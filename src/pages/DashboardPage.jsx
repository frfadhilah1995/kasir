import React from 'react';
import { TrendingUp, Package, Users, Clock, FileText } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import Footer from '../components/Shared/Footer';

const DashboardPage = () => {
    const { transactions, customers } = useDatabase();

    const totalSales = transactions.filter(t => t.status === 'Success').reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = transactions.length;
    const totalCustomers = customers.length;
    const pendingOrders = transactions.filter(t => t.status === 'Pending').length;

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className="flex flex-col min-h-full">
            <div className="p-8 animate-in fade-in zoom-in duration-300 flex-1">
                <h2 className="text-3xl font-bold text-[#0f2942] mb-6">Dashboard Overview</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Sales", val: formatCurrency(totalSales), icon: TrendingUp, color: "bg-green-100 text-green-600" },
                        { title: "Total Orders", val: totalOrders, icon: Package, color: "bg-blue-100 text-blue-600" },
                        { title: "Customers", val: totalCustomers, icon: Users, color: "bg-amber-100 text-amber-600" },
                        { title: "Pending", val: pendingOrders, icon: Clock, color: "bg-red-100 text-red-600" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-slate-800">{stat.val}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity / Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex flex-col">
                        <h3 className="font-bold text-slate-700 mb-6">Sales Overview (Last 7 Days)</h3>
                        <div className="flex-1 flex items-end justify-between gap-2">
                            {(() => {
                                const last7Days = [...Array(7)].map((_, i) => {
                                    const d = new Date();
                                    d.setDate(d.getDate() - (6 - i));
                                    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                });

                                const salesData = last7Days.map(date => {
                                    const dayTotal = transactions
                                        .filter(t => t.date === date && t.status === 'Success')
                                        .reduce((acc, curr) => acc + curr.total, 0);
                                    return { date: date.split(' ').slice(0, 2).join(' '), total: dayTotal };
                                });

                                const maxSale = Math.max(...salesData.map(d => d.total), 1); // Avoid div by 0

                                return salesData.map((data, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2 group w-full">
                                        <div className="relative w-full flex justify-center items-end h-48 bg-slate-50 rounded-t-lg overflow-hidden">
                                            <div
                                                className="w-full mx-1 bg-[#0f2942] rounded-t-md transition-all duration-500 group-hover:bg-amber-400 relative"
                                                style={{ height: `${(data.total / maxSale) * 100}%` }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                    {formatCurrency(data.total)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{data.date}</span>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 overflow-hidden flex flex-col">
                        <h3 className="font-bold text-slate-700 mb-4">Recent Transactions</h3>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {transactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <FileText size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm">No transactions yet</p>
                                </div>
                            ) : (
                                transactions.slice(0, 10).map((t, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <FileText size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{t.id}</p>
                                                <p className="text-xs text-slate-400">{t.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-sm font-bold text-[#0f2942]">{formatCurrency(t.total)}</span>
                                            <span className="text-[10px] text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full">{t.status}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
