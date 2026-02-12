
import React from 'react';
import { UserRole } from '../types.ts';

interface CardGridProps {
  role: UserRole;
  onStartWizard: () => void;
}

const PSYCH_MODULES = [
  'Sound Therapy Prescription',
  'Ayurvedic Recommendations',
  'Behavioral Wellness',
  'Digital Detox Protocol',
  'Therapeutic Homework',
  'Daily Mood Tracking',
];

const MED_MODULES = [
  'Coordinated Care Review',
  'Psychiatric Evaluation',
  'Medication Management',
  'Parameter Tracking',
  'Dosage Adjustment Log',
  'Follow-up Schedule',
];

const CardGrid: React.FC<CardGridProps> = ({ role, onStartWizard }) => {
  const modules = role === UserRole.PSYCHIATRIST ? MED_MODULES : PSYCH_MODULES;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl p-16 rounded-[4rem] frosted-glass transition-all duration-700">
        <div className="text-center mb-16">
          <h2 className="serif-heading text-4xl text-[#1e293b] mb-4 tracking-tight">
            {role === UserRole.PSYCHIATRIST ? 'Medical Evaluation Suite' : 'Wellness Planning Suite'}
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.6em] opacity-80">
            Clinical Standard Protocols
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 mb-16">
          {modules.map((name, idx) => (
            <div key={idx} className="flex items-center gap-6 py-5 border-b border-blue-100/50 group">
              <span className="text-[11px] font-light text-blue-300 group-hover:text-blue-500 transition-colors">0{idx + 1}</span>
              <span className="text-[13px] font-medium tracking-[0.2em] text-[#1e293b] uppercase opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                {name}
              </span>
            </div>
          ))}
        </div>

        <button 
          onClick={onStartWizard}
          className="group relative w-full py-8 rounded-3xl text-white font-bold tracking-[0.4em] uppercase text-xs shadow-xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}
        >
          <span className="relative z-10">Initialize {role === UserRole.PSYCHIATRIST ? 'Clinical' : 'Wellness'} Session</span>
          <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
        </button>
      </div>
    </div>
  );
};

export default CardGrid;
