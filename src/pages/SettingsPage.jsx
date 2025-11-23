import React from 'react';
import { Save } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import Footer from '../components/Shared/Footer';

const SettingsPage = () => {
    const { settings, updateSettings } = useDatabase();
    const [formData, setFormData] = React.useState(settings);
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        updateSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex flex-col min-h-full">
            <div className="p-8 animate-in fade-in duration-300 flex-1">
                <h2 className="text-3xl font-bold text-[#0f2942] mb-6">Application Settings</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side - Settings Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                            {saved && (
                                <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm border border-green-100 mb-4">
                                    Settings saved successfully!
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Store Name</label>
                                <input
                                    type="text"
                                    value={formData.storeName}
                                    onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        value={formData.taxRate}
                                        onChange={e => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Currency</label>
                                    <select
                                        value={formData.currency}
                                        onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    >
                                        <option>IDR (Rp)</option>
                                        <option>USD ($)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                                <textarea
                                    rows="3"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                            <button
                                onClick={handleSave}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-[#0f2942] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors"
                            >
                                <Save size={18} /> Save Changes
                            </button>

                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                                <p className="text-sm text-slate-500 mb-4">Clear all data (Products, Transactions, Customers) and reset to empty state.</p>
                                <button
                                    onClick={() => {
                                        if (confirm("Are you sure? This will delete ALL data permanently!")) {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    }}
                                    className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition-colors"
                                >
                                    Reset Database (Clear All Data)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - About Mitra Cuan */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-2xl border border-blue-100 sticky top-8">
                            <h3 className="text-base font-bold text-[#0f2942] mb-4">About <span style={{ fontFamily: "'Lobster', cursive" }}>Mitra Cuan</span></h3>
                            <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                                <strong className="text-[#1e3a8a]" style={{ fontFamily: "'Lobster', cursive" }}>Mitra Cuan</strong> is a web-based Point of Sale (POS) system designed to help businesses efficiently manage sales transactions, product inventory, and customer data.
                            </p>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                This application provides an intuitive and modern interface for cashiers and store owners, with comprehensive features including product management, transaction history, customer management, and customizable system settings.
                            </p>

                            <div className="border-t border-blue-200 pt-5">
                                <p className="text-sm text-slate-500 mb-3">Developed by</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                                        <img src="/rmd-tech-logo.svg" alt="RMD TECH" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#1e3a8a] tracking-wide leading-tight">RMD TECH</h4>
                                        <p className="text-sm text-slate-500 mt-0.5">Professional Software Development</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SettingsPage;
