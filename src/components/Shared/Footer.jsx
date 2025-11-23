import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-100 py-4 px-8 text-center">
            <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} <span className="font-bold text-[#1e3a8a]" style={{ fontFamily: "'Lobster', cursive" }}>Mitra Cuan</span>.
                All rights reserved.
            </p>
            <p className="text-xs text-slate-400 mt-1">
                Developed by <span className="font-bold text-[#1e3a8a]">RMD TECH</span>
            </p>
        </footer>
    );
};

export default Footer;
