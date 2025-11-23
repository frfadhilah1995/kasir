import React from 'react';
import { Home, LayoutDashboard, ShoppingCart, Users, Settings, FileText, Package, LogOut, Shield } from 'lucide-react';
import LogoIcon from '../Shared/LogoIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const activePath = location.pathname;
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/', icon: Home, label: "Home", roles: ['owner', 'cashier'] },
        { path: '/pos', icon: LayoutDashboard, label: "POS", roles: ['owner', 'cashier'] },
        { path: '/products', icon: Package, label: "Items", roles: ['owner'] },
        { path: '/transactions', icon: FileText, label: "History", roles: ['owner', 'cashier'] },
        { path: '/customers', icon: Users, label: "Customers", roles: ['owner', 'cashier'] },
        { path: '/admin', icon: Shield, label: "Admin", roles: ['owner'] },
        { path: '/settings', icon: Settings, label: "Config", roles: ['owner'] }
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="w-24 bg-[#0f2942] flex flex-col items-center py-6 gap-6 shadow-2xl z-50 h-screen fixed left-0 top-0">
            {/* Logo Small Icon Only */}
            <div className="mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                    <LogoIcon />
                </div>
            </div>

            {/* Nav Items */}
            {filteredMenu.map((menu) => (
                <Link
                    key={menu.path}
                    to={menu.path}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group
            ${activePath === menu.path
                            ? 'bg-amber-400 text-[#0f2942] shadow-lg shadow-amber-400/20 scale-105'
                            : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                >
                    <menu.icon size={22} />
                    {/* Tooltip */}
                    <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {menu.label}
                    </span>
                </Link>
            ))}

            <div className="mt-auto flex flex-col items-center gap-4 mb-4">
                <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
