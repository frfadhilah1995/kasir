import React from 'react';
import LogoIcon from './LogoIcon';

const MainLogo = () => (
    <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
            <LogoIcon />
        </div>
        <div className="text-center leading-none">
            <h1 className="text-2xl font-extrabold text-[#0f2942]">MITRA CUAN</h1>
            <p className="text-[10px] text-slate-500 tracking-[0.25em] font-semibold mt-1">WEB POS SOLUTIONS</p>
        </div>
    </div>
);

export default MainLogo;
