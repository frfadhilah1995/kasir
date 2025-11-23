import React from 'react';
import Sidebar from './Sidebar';
import LogoIcon from '../Shared/LogoIcon';
import { Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const brandStyles = `
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes glow-pulse {
    0%, 100% { text-shadow: 0 0 8px rgba(217, 119, 6, 0.4), 0 0 15px rgba(217, 119, 6, 0.2); }
    50% { text-shadow: 0 0 15px rgba(217, 119, 6, 0.7), 0 0 25px rgba(217, 119, 6, 0.4), 0 0 35px rgba(217, 119, 6, 0.2); }
  }
  
  .brand-name {
    background: linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa, #3b82f6, #1e3a8a);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-shift 3s ease-in-out infinite;
  }
  
  .slogan-glow {
    animation: glow-pulse 2s ease-in-out infinite;
  }
`;

const MainLayout = () => {
    const location = useLocation();
    const isPosPage = location.pathname === '/pos';
    const { user } = useAuth();

    return (
        <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 ml-24 relative h-full">
                {/* Header - Show on all pages except POS */}
                {!isPosPage && (
                    <div className="bg-white h-20 border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
                        <style>{brandStyles}</style>
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 relative"><LogoIcon /></div>
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-4xl leading-none tracking-wide brand-name" style={{ fontFamily: "'Lobster', cursive" }}>Mitra Cuan</h1>
                                <p className="text-[10px] text-[#d97706] font-bold tracking-[0.3em] uppercase mt-1 slogan-glow">Web POS System</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-700">{user?.name || 'User'}</p>
                                <p className="text-xs text-slate-400 capitalize">{user?.role || 'Staff'}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-300 flex items-center justify-center text-slate-500">
                                {user?.photo ? (
                                    <img src={user.photo} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users size={24} />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-auto bg-[#f8fafc]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
