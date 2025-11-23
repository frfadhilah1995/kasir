import React, { useState } from 'react';
import { User, Trash2, Shield, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Shared/Footer';

const AdminPage = () => {
    const { users, addUser, updateUser, deleteUser, user: currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '', name: '', role: 'cashier', photo: '' });
    const [error, setError] = useState('');

    const openAddModal = () => {
        setEditingUser(null);
        setFormData({ username: '', password: '', name: '', role: 'cashier', photo: '' });
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ ...user, password: '' }); // Don't show password
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!editingUser && !formData.password) {
            setError("Password is required for new users");
            return;
        }

        const dataToSave = { ...formData };
        if (!dataToSave.password) delete dataToSave.password; // Don't update password if empty

        let result;
        if (editingUser) {
            result = updateUser(editingUser.id, dataToSave);
        } else {
            result = addUser(dataToSave);
        }

        if (result.success) {
            setIsModalOpen(false);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex flex-col min-h-full">
            <div className="p-8 animate-in fade-in duration-300 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-[#0f2942]">User Management</h2>
                        <p className="text-slate-400 text-sm">Manage access for your staff</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0f2942] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={18} /> Add User
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((u) => (
                        <div key={u.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${u.role === 'owner' ? 'bg-amber-500' : 'bg-slate-400'}`}>
                                    {u.photo ? (
                                        <img src={u.photo} alt={u.name} className="w-full h-full object-cover" />
                                    ) : (
                                        u.role === 'owner' ? <Shield size={20} /> : <User size={20} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{u.name}</h3>
                                    <p className="text-xs text-slate-500 font-mono">@{u.username}</p>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${u.role === 'owner' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {u.role}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(u)}
                                    className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                    <User size={18} />
                                </button>
                                {u.id !== currentUser.id && (
                                    <button
                                        onClick={() => {
                                            const res = deleteUser(u.id);
                                            if (!res.success) alert(res.message);
                                        }}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {/* Add/Edit User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#0f2942]">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                                <input
                                    required
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="e.g. cashier1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="******"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="owner">Owner (Admin)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Profile Photo (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 500000) { // 500KB limit
                                                alert("File size too large! Please upload an image smaller than 500KB.");
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, photo: reader.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 text-sm"
                                />
                                {formData.photo && (
                                    <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-slate-200">
                                        <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="w-full py-3 bg-[#0f2942] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors mt-2">
                                {editingUser ? 'Update User' : 'Create User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
