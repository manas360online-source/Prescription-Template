
import React from 'react';
import { UserRole } from '../types.ts';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in zoom-in-95 duration-1000 px-6">
      <button 
        onClick={() => onSelectRole(UserRole.PSYCHOLOGIST)}
        className="group relative flex flex-col items-center p-16 rounded-[4rem] frosted-glass frosted-glass-hover transition-all duration-1000"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[4rem]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 transition-transform duration-1000">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 font-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="serif-heading text-4xl text-[#1e293b] mb-3 tracking-tighter">Psychologist</h3>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-[0.4em] opacity-60">Wellness & Behavioral Medicine</p>
        </div>
      </button>

      <button 
        onClick={() => onSelectRole(UserRole.PSYCHIATRIST)}
        className="group relative flex flex-col items-center p-16 rounded-[4rem] frosted-glass frosted-glass-hover transition-all duration-1000"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-slate-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[4rem]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 transition-transform duration-1000">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.05.547M4.14 10.43l1.82 4.01a2 2 0 001.05.547l2.12.21a2 2 0 001.05-.547l1.82-4.01M16.5 13.5l1.5-1.5m-3 0l1.5-1.5m0 3l1.5 1.5m-1.5-1.5l1.5-1.5" />
            </svg>
          </div>
          <h3 className="serif-heading text-4xl text-slate-900 mb-3 tracking-tighter">Psychiatrist</h3>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-[0.4em] opacity-60">Advanced Medical Intervention</p>
        </div>
      </button>
    </div>
  );
};

export default RoleSelector;
