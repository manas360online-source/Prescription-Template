
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import RoleSelector from './components/RoleSelector.tsx';
import CardGrid from './components/CardGrid.tsx';
import ClinicalPage from './components/ClinicalPage.tsx';
import SavedPrescriptions from './components/SavedPrescriptions.tsx';
import { AppViews, SavedPlan, UserRole } from './types.ts';

const PSYCHOLOGIST_SEQUENCE = [
  AppViews.SOUND,
  AppViews.AYURVEDIC,
  AppViews.BEHAVIORAL,
  AppViews.DETOX,
  AppViews.CBT,
  AppViews.MOOD
];

const PSYCHIATRIST_SEQUENCE = [
  AppViews.PSYCH_PLAN_VIEW,
  AppViews.EVALUATION,
  AppViews.MEDICATION,
  AppViews.TRACKING,
  AppViews.ADJUSTMENT,
  AppViews.FOLLOWUP
];

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [view, setView] = useState<AppViews>(AppViews.HOME);
  const [globalSelections, setGlobalSelections] = useState<Record<string, Record<string, any>>>(() => {
    const saved = localStorage.getItem('global_clinical_state');
    return saved ? JSON.parse(saved) : {};
  });
  const [recentPlans, setRecentPlans] = useState<SavedPlan[]>([]);
  const [initialSelectedId, setInitialSelectedId] = useState<string | undefined>(undefined);
  const [wizardIndex, setWizardIndex] = useState<number>(-1);

  useEffect(() => {
    localStorage.setItem('global_clinical_state', JSON.stringify(globalSelections));
  }, [globalSelections]);

  useEffect(() => {
    const updateHistory = () => {
      const saved = JSON.parse(localStorage.getItem('wellness_plans') || '[]');
      setRecentPlans(saved.slice(0, 3));
    };
    updateHistory();
    window.addEventListener('storage', updateHistory);
    return () => window.removeEventListener('storage', updateHistory);
  }, [view]);

  const updateSelections = (sectionView: AppViews, selections: Record<string, any>) => {
    setGlobalSelections(prev => ({ ...prev, [sectionView]: selections }));
  };

  const startWizard = () => {
    setWizardIndex(0);
    const sequence = role === UserRole.PSYCHIATRIST ? PSYCHIATRIST_SEQUENCE : PSYCHOLOGIST_SEQUENCE;
    setView(sequence[0]);
  };

  const nextWizardStep = () => {
    const sequence = role === UserRole.PSYCHIATRIST ? PSYCHIATRIST_SEQUENCE : PSYCHOLOGIST_SEQUENCE;
    if (wizardIndex < sequence.length - 1) {
      const nextIdx = wizardIndex + 1;
      setWizardIndex(nextIdx);
      setView(sequence[nextIdx]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setWizardIndex(-1);
      setView(AppViews.SAVED);
    }
  };

  const handleBack = () => {
    setWizardIndex(-1);
    setView(AppViews.HOME);
  };

  const renderDashboard = () => (
    <div className="mt-8 w-full max-w-6xl mx-auto flex flex-col pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <button 
        onClick={() => setRole(UserRole.NONE)}
        className="mb-12 self-start flex items-center text-[#1e293b] text-[10px] font-bold uppercase tracking-[0.4em] hover:opacity-40 transition-all opacity-60"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
        Switch Access ({role})
      </button>

      <CardGrid role={role} onStartWizard={startWizard} />
      
      <div className="mt-24">
        <div className="flex justify-between items-end mb-12 px-6">
          <div>
            <h2 className="serif-heading text-4xl text-[#1e293b] tracking-tighter">Clinical Archives</h2>
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.4em] font-bold mt-2 opacity-60">Verified Records of Care</p>
          </div>
          <button 
            onClick={() => { setWizardIndex(-1); setView(AppViews.SAVED); }}
            className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-[0.3em] hover:opacity-50 transition-opacity border-b border-[#1e3a8a]/10 pb-2"
          >
            Access Full Vault →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
          {recentPlans.filter(p => p.role === role).length > 0 ? (
            recentPlans.filter(p => p.role === role).map((plan) => (
              <button 
                key={plan.id}
                onClick={() => { setInitialSelectedId(plan.id); setView(AppViews.SAVED); }}
                className="group text-left p-10 rounded-[3.5rem] frosted-glass frosted-glass-hover transition-all duration-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-blue-50/80 rounded-full text-[9px] font-bold text-blue-600 uppercase tracking-widest border border-blue-100/50">
                    {plan.title.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium uppercase tracking-widest opacity-60">{plan.date.split(' ')[0]}</span>
                </div>
                <h4 className="text-lg font-medium text-[#1e293b] group-hover:text-blue-900 transition-colors line-clamp-1 mb-3">{plan.title}</h4>
                <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed font-light italic opacity-70 group-hover:opacity-100">"{plan.content}"</p>
              </button>
            ))
          ) : (
            <div className="col-span-full py-20 text-center rounded-[4rem] border border-dashed border-blue-200/50 flex flex-col items-center justify-center opacity-40">
              <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-blue-900">Archive Currently Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen horizon-bg flex flex-col relative">
      <div className="orb w-[600px] h-[600px] top-[-100px] left-[-200px] bg-blue-100" />
      <div className="orb w-[800px] h-[800px] bottom-[-200px] right-[-200px] bg-teal-50" />
      <div className="orb w-[400px] h-[400px] top-[20%] left-[40%] bg-sky-100" />
      
      <div className="relative z-10 flex flex-col items-center flex-grow pt-24 pb-12 px-6">
        <Header role={role} />
        
        {role === UserRole.NONE ? (
          <RoleSelector onSelectRole={(r) => { setRole(r); setView(AppViews.HOME); }} />
        ) : (
          <>
            {view === AppViews.HOME && renderDashboard()}
            {view === AppViews.SAVED && (
              <SavedPrescriptions 
                onBack={() => setView(AppViews.HOME)} 
                initialSelectedId={initialSelectedId}
              />
            )}
            {view !== AppViews.HOME && view !== AppViews.SAVED && (
              <ClinicalPage 
                view={view} 
                role={role}
                onBack={handleBack} 
                currentSelections={globalSelections[view]}
                onSaveSelections={(s) => updateSelections(view, s)}
                fullGlobalSelections={globalSelections}
                isWizard={wizardIndex !== -1}
                onNextStep={nextWizardStep}
                stepNumber={wizardIndex + 1}
                totalSteps={role === UserRole.PSYCHIATRIST ? PSYCHIATRIST_SEQUENCE.length : PSYCHOLOGIST_SEQUENCE.length}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
