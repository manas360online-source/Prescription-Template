
import React from 'react';
import { UserRole } from '../types.ts';

interface HeaderProps {
  role?: UserRole;
}

const Header: React.FC<HeaderProps> = ({ role }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="serif-heading text-4xl md:text-5xl font-light tracking-[0.4em] text-[#1e293b] uppercase leading-relaxed">
        Prescription <br className="hidden md:block" />
        <span className="opacity-60 text-3xl tracking-[0.6em]">Template</span>
      </h1>
      <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#1e3a8a]/20 to-transparent mx-auto mt-6"></div>
      {role !== UserRole.NONE && (
        <div className="mt-4">
          <span className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-[0.5em] bg-blue-50/50 px-6 py-2 rounded-full border border-blue-100/30">
            {role} Portal
          </span>
        </div>
      )}
    </div>
  );
};

export default Header;
