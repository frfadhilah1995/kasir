import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoIcon from '../components/Shared/LogoIcon';
import { Lock, User } from 'lucide-react';

const brandStyles = `
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes glow-pulse {
    0%, 100% { text-shadow: 0 0 10px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3); }
    50% { text-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.3); }
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

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 text-center bg-[#0f2942] text-white">
                    <style>{brandStyles}</style>
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                        <LogoIcon />
                    </div>
                    <h1 className="text-3xl font-bold brand-name" style={{ fontFamily: "'Lobster', cursive" }}>Mitra Cuan</h1>
                    <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mt-2 slogan-glow">Web POS System</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Login to your account</h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 bg-[#0f2942] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors shadow-lg shadow-blue-900/20 mt-4">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        <p>Default Admin: admin / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
