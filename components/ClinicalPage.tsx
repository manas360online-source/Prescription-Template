
import React, { useState, useMemo, useEffect } from 'react';
import { AppViews, SavedPlan, UserRole } from '../types.ts';

interface ClinicalPageProps {
  view: AppViews;
  role: UserRole;
  onBack: () => void;
  currentSelections?: Record<string, any>;
  onSaveSelections: (selections: Record<string, any>) => void;
  fullGlobalSelections: Record<string, Record<string, any>>;
  isWizard?: boolean;
  onNextStep?: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

const ClinicalPage: React.FC<ClinicalPageProps> = ({ 
  view, 
  role,
  onBack, 
  currentSelections, 
  onSaveSelections, 
  fullGlobalSelections,
  isWizard,
  onNextStep,
  stepNumber,
  totalSteps
}) => {
  const [showOutput, setShowOutput] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selections, setSelections] = useState<Record<string, any>>({});

  const pageConfig = useMemo(() => {
    switch (view) {
      case AppViews.CBT:
        return {
          title: '🧠 THERAPEUTIC HOMEWORK',
          instructions: 'Session-Specific Assignments for Cognitive & Behavioral Growth.',
          sections: [
            { title: 'Cognitive Restructuring', category: 'cognitive', multi: true, options: [
              { label: 'Thought record (3 neg. thoughts/day)', value: 'Thought Record', recommended: true },
              { label: 'Evidence for/against each thought', value: 'Evidence Log', recommended: true },
              { label: 'Reframe to balanced thought', value: 'Balanced Reframe', recommended: true }
            ]},
            { title: 'Behavioral Activation', category: 'activation', multi: true, options: [
              { label: 'Schedule 3 pleasant activities this week', value: 'Schedule Activities', recommended: true },
              { label: 'Rate mood before/after each activity', value: 'Mood Rating', recommended: true },
              { label: 'Track on calendar (bring to next session)', value: 'Calendar Tracking', recommended: true }
            ]},
            { title: 'Mindfulness Practice', category: 'mindfulness', multi: true, options: [
              { label: '10 minutes daily mindfulness (Calm, Headspace)', value: 'Daily Mindfulness', recommended: true },
              { label: 'Body scan meditation 3x/week', value: 'Body Scan', recommended: true },
              { label: 'Mindful eating 1 meal/day', value: 'Mindful Eating', recommended: true }
            ]},
            { title: 'Exposure Hierarchy', category: 'exposure', multi: true, options: [
              { label: 'List feared situations (0-100 scale)', value: 'Hierarchy List' },
              { label: 'Practice easiest one this week', value: 'Exposure Practice' },
              { label: 'Document: anxiety pre/during/post', value: 'Exposure Log' }
            ]},
            { title: 'DBT Skills', category: 'dbt', multi: true, options: [
              { label: 'TIPP skill practice (when distressed)', value: 'TIPP Skills' },
              { label: 'Opposite action (urge management)', value: 'Opposite Action' },
              { label: 'Radical acceptance worksheet', value: 'Radical Acceptance' }
            ]},
            { title: 'Reading & Resources', category: 'reading', multi: true, options: [
              { label: 'Read: Ch 3 of "Feeling Good" (Burns)', value: 'Feeling Good Reading', recommended: true },
              { label: 'Watch: Dr. K video on anxiety', value: 'Anxiety Video', recommended: true },
              { label: 'Listen: Huberman Lab on sleep', value: 'Sleep Podcast', recommended: true }
            ]}
          ],
          generateOutput: (sel: any) => `Prescribed Homework: ${sel.cognitive?.length ? 'Cognitive Restructuring, ' : ''}${sel.activation?.length ? 'Behavioral Activation, ' : ''}${sel.mindfulness?.length ? 'Mindfulness Exercises, ' : ''}and Reading: ${sel.reading?.join(', ') || 'N/A'}.`
        };

      case AppViews.TRACKING:
        return {
          title: '📊 PARAMETER TRACKING',
          instructions: 'VITAL PARAMETERS & SIDE EFFECT MONITORING (Section 4)',
          sections: [
            { title: 'Mood Metrics (Weekly)', category: 'mood_metrics', multi: true, options: [
              { label: 'PHQ-9 Score Tracking', value: 'PHQ-9', recommended: true },
              { label: 'GAD-7 Score Tracking', value: 'GAD-7', recommended: true },
              { label: 'Trend: ↗️ Improving', value: 'Improving', recommended: true },
              { label: 'Trend: ↔️ Stable', value: 'Stable' },
              { label: 'Trend: ↘️ Worsening', value: 'Worsening' }
            ]},
            { title: 'Side Effects (Patient Reported)', category: 'side_effects', multi: true, options: [
              { label: 'Nausea (0-10 scale)', value: 'Nausea' },
              { label: 'Headache (0-10 scale)', value: 'Headache' },
              { label: 'Insomnia (0-10 scale)', value: 'Insomnia' },
              { label: 'Sexual dysfunction (0-10 scale)', value: 'Sexual' },
              { label: 'Weight change: ___ kg', value: 'Weight Monitor', recommended: true }
            ]},
            { title: 'Vital Parameters', category: 'vitals', multi: true, options: [
              { label: 'Blood Pressure Monitoring', value: 'BP', recommended: true },
              { label: 'Heart Rate Monitoring', value: 'HR', recommended: true },
              { label: 'Weight Tracking', value: 'Weight', recommended: true }
            ]},
            { title: 'Clinical Global Impression', category: 'cgi', multi: false, options: [
              { label: 'CGI Severity: 1-2 (Mild)', value: 'Mild' },
              { label: 'CGI Severity: 4 (Moderate)', value: 'Moderate', recommended: true },
              { label: 'CGI Severity: 6-7 (Severe)', value: 'Severe' }
            ]}
          ],
          generateOutput: (sel: any) => `Weekly monitoring for ${sel.mood_metrics?.join(', ')}. Side effects: ${sel.side_effects?.join(', ') || 'Stable'}. Vitals: ${sel.vitals?.join(', ')}. CGI Status: ${sel.cgi || 'Moderate'}.`
        };

      case AppViews.ADJUSTMENT:
        return {
          title: '📝 DOSAGE ADJUSTMENT LOG',
          instructions: 'MEDICATION ADJUSTMENT HISTORY & TAPER SCHEDULE (Section 5)',
          sections: [
            { title: 'Medication History Log', category: 'history', multi: true, options: [
              { label: 'Dec 1: Sertraline 0mg → 50mg (Initial)', value: 'Initial Start', recommended: true },
              { label: 'Dec 15: Sertraline 50mg → 100mg (Tolerated)', value: 'Dose Increase', recommended: true },
              { label: 'Jan 5: Continue 100mg (Reassess)', value: 'Maintenance', recommended: true }
            ]},
            { title: 'Taper Schedule (If discontinuing)', category: 'taper', multi: true, options: [
              { label: 'Week 1: 50% Reduction', value: 'W1 Reduce' },
              { label: 'Week 2: 75% Reduction', value: 'W2 Reduce' },
              { label: 'Week 3: Final Taper', value: 'W3 Final' },
              { label: 'Week 4: Discontinue', value: 'W4 Stop' }
            ]},
            { title: 'Adjustment Notes', category: 'adjustment_notes', multi: true, options: [
              { label: 'Slow taper to avoid discontinuation syndrome', value: 'Safety Note', recommended: true },
              { label: 'Coordinate with psychologist during taper', value: 'Coordination Note', recommended: true },
              { label: 'Continue therapy during titration', value: 'Therapy Note', recommended: true }
            ]}
          ],
          generateOutput: (sel: any) => `Adjustment Log Update: ${sel.history?.join('; ') || 'No changes'}. Notes: ${sel.adjustment_notes?.join(', ') || 'Standard'}.`
        };

      case AppViews.MOOD:
        return {
          title: '📊 DAILY MOOD TRACKING',
          instructions: 'MOOD & PROGRESS TRACKING ADHERENCE (Section 6)',
          sections: [
            { title: 'Daily Recording Requirement', category: 'recording', multi: false, options: [
              { label: '☑ Daily Mood Recording (Active)', value: 'Active Recording', recommended: true }
            ]},
            { title: 'Tracking Method', category: 'method', multi: false, options: [
              { label: 'MANS360 App (in-app journal)', value: 'MANS360', recommended: true },
              { label: 'Paper journal (bring to sessions)', value: 'Paper Journal' },
              { label: 'Voice memos (records/reviews)', value: 'Voice Memos' }
            ]},
            { title: 'Daily Parameters', category: 'daily_metrics', multi: true, options: [
              { label: 'Mood (1-10 scale)', value: 'Mood', recommended: true },
              { label: 'Sleep hours', value: 'Sleep', recommended: true },
              { label: 'Medication/Supplement adherence', value: 'Adherence', recommended: true },
              { label: 'Exercise (yes/no, duration)', value: 'Exercise', recommended: true },
              { label: 'Acts of kindness completed', value: 'Kindness', recommended: true },
              { label: 'Digital detox compliance', value: 'Digital Detox', recommended: true },
              { label: 'Sound therapy completed', value: 'Sound Therapy', recommended: true }
            ]},
            { title: 'Weekly Clinical Review', category: 'weekly_review', multi: true, options: [
              { label: 'Psychologist reviews in-session', value: 'Psych Review', recommended: true },
              { label: 'Patient identifies patterns', value: 'Patient Patterns', recommended: true },
              { label: 'Adjust wellness plan based on data', value: 'Data Adjustment', recommended: true }
            ]},
            { title: 'AI Integration Flags', category: 'ai_flags', multi: true, options: [
              { label: 'AI flags: 3+ days consecutive low mood', value: 'Low Mood Flag', recommended: true },
              { label: 'AI flags: Skipped 5+ days tracking', value: 'Gap Flag', recommended: true },
              { label: 'AI flags: Non-adherence to plan', value: 'Adherence Flag', recommended: true },
              { label: 'AI generates weekly summary report', value: 'Weekly Summary', recommended: true }
            ]}
          ],
          generateOutput: (sel: any) => `Daily monitoring via ${sel.method || 'app'} enabled for ${sel.daily_metrics?.length || 0} metrics. AI clinical oversight active for: ${sel.ai_flags?.join(', ') || 'N/A'}.`
        };

      case AppViews.SOUND:
        return {
          title: 'SOUND THERAPY PRESCRIPTION',
          sections: [
            { title: 'Frequency', category: 'frequency', multi: false, options: [
              { label: '432 Hz - Stress Relief', value: '432 Hz', recommended: true },
              { label: '528 Hz - Healing', value: '528 Hz' }
            ]},
            { title: 'Duration', category: 'duration', multi: false, options: [
              { label: '20 min/day (Standard)', value: '20 min', recommended: true },
              { label: '30 min/day', value: '30 min' }
            ]}
          ],
          generateOutput: (sel: any) => `Sound protocol: ${sel.duration || '20 min'} @ ${sel.frequency || '432 Hz'} daily.`
        };

      case AppViews.AYURVEDIC:
        return {
          title: 'AYURVEDIC RECOMMENDATIONS',
          sections: [
            { title: 'Supplement', category: 'supplement', multi: false, options: [
              { label: 'Ashwagandha', value: 'Ashwagandha', recommended: true },
              { label: 'Brahmi', value: 'Brahmi' }
            ]},
            { title: 'Dosage', category: 'dosage', multi: false, options: [
              { label: '300mg (Standard)', value: '300mg', recommended: true },
              { label: '600mg', value: '600mg' }
            ]}
          ],
          generateOutput: (sel: any) => `Ayurvedic support: ${sel.supplement || 'Ashwagandha'} ${sel.dosage || '300mg'} daily.`
        };

      case AppViews.BEHAVIORAL:
        return {
          title: 'BEHAVIORAL WELLNESS',
          sections: [
            { title: 'Prosocial Intervention', category: 'core', multi: false, options: [
              { label: 'Random Acts of Kindness', value: 'Kindness', recommended: true },
              { label: 'Gratitude Practice', value: 'Gratitude' }
            ]},
            { title: 'Frequency', category: 'frequency', multi: false, options: [
              { label: '2 hours/month', value: '2hrs', recommended: true },
              { label: 'Weekly engagement', value: 'weekly' }
            ]}
          ],
          generateOutput: (sel: any) => `Behavioral focus: ${sel.core || 'Kindness'} intervention, targeted ${sel.frequency || '2 hrs/month'}.`
        };

      case AppViews.DETOX:
        return {
          title: 'DIGITAL DETOX PROTOCOL',
          sections: [
            { title: 'Evening Protocol', category: 'evening', multi: true, options: [
              { label: 'Phone off by 9 PM', value: '9PM Off', recommended: true },
              { label: 'No screens 1hr pre-bed', value: 'No screens', recommended: true }
            ]},
            { title: 'Morning Constraints', category: 'morning', multi: false, options: [
              { label: 'Routine First (No Phone)', value: 'Routine first', recommended: true },
              { label: 'No SM before 10 AM', value: 'No 10AM SM' }
            ]}
          ],
          generateOutput: (sel: any) => `Digital detox boundaries: ${sel.evening?.join(' & ') || 'Evening constraints'} and ${sel.morning || 'Morning protocol'}.`
        };

      case AppViews.EVALUATION:
        return {
          title: 'PSYCHIATRIC EVALUATION',
          sections: [
            { title: 'Diagnosis (Standard)', category: 'diagnosis', multi: false, options: [
              { label: 'Major Depressive Disorder', value: 'MDD', recommended: true },
              { label: 'Generalized Anxiety Disorder', value: 'GAD' }
            ]},
            { title: 'Clinical Severity', category: 'severity', multi: false, options: [
              { label: 'Moderate', value: 'Moderate', recommended: true },
              { label: 'Severe', value: 'Severe' }
            ]}
          ],
          generateOutput: (sel: any) => `Diagnosis: ${sel.diagnosis || 'MDD'}. Severity: ${sel.severity || 'Moderate'}.`
        };

      case AppViews.MEDICATION:
        return {
          title: 'MEDICATION MANAGEMENT',
          sections: [
            { title: 'Agent Selection', category: 'generic', multi: false, options: [
              { label: 'Sertraline (SSRI)', value: 'Sertraline', recommended: true },
              { label: 'Escitalopram (SSRI)', value: 'Escitalopram' }
            ]},
            { title: 'Dose Schedule', category: 'dose', multi: false, options: [
              { label: '25mg → 50mg', value: '25-50', recommended: true },
              { label: '50mg → 100mg', value: '50-100' }
            ]}
          ],
          generateOutput: (sel: any) => `Medication Plan: ${sel.generic || 'Sertraline'} (${sel.dose || '25-50mg'}).`
        };

      case AppViews.FOLLOWUP:
        return {
          title: '📅 FOLLOW-UP SCHEDULE',
          sections: [
            { title: 'Next Session', category: 'next', multi: false, options: [
              { label: '2 Weeks (Reassess Titration)', value: '2W', recommended: true },
              { label: '4 Weeks (Standard)', value: '4W' },
              { label: 'Maintenance (3 Months)', value: '3M' }
            ]}
          ],
          generateOutput: (sel: any) => `Follow-up scheduled for ${sel.next || '2 weeks'}.`
        };

      case AppViews.PSYCH_PLAN_VIEW:
        return {
          title: 'COORDINATED CARE REVIEW',
          instructions: 'Review of Psychologist Foundation Layers.',
          sections: [
            { title: 'Wellness Foundation', category: 'review', multi: true, options: [
              { label: 'Sound Therapy active', value: 's', recommended: true },
              { label: 'Ayurvedic base active', value: 'a', recommended: true },
              { label: 'Digital detox active', value: 'd', recommended: true }
            ]}
          ],
          generateOutput: () => `Psychiatrist acknowledges existing wellness foundation. Clinical layers being added to established psychologist protocol.`
        };

      default:
        return { title: 'CLINICAL MODULE', sections: [], generateOutput: () => '' };
    }
  }, [view, selections]);

  // Robust Initialization Logic for Recommended Defaults
  useEffect(() => {
    setShowOutput(false);
    
    // Always calculate fresh defaults when entering a view without current selections
    if (!currentSelections || Object.keys(currentSelections).length === 0) {
      if (pageConfig && pageConfig.sections) {
        const initial: Record<string, any> = {};
        pageConfig.sections.forEach(section => {
          const recommendedValues = section.options
            .filter(opt => opt.recommended)
            .map(opt => opt.value);
          
          if (section.multi) {
            initial[section.category] = recommendedValues;
          } else {
            initial[section.category] = recommendedValues.length > 0 
              ? recommendedValues[0] 
              : section.options[0]?.value;
          }
        });
        setSelections(initial);
        onSaveSelections(initial);
      }
    } else {
      setSelections(currentSelections);
    }
  }, [view]);

  const handleSelection = (category: string, value: string, multi: boolean) => {
    const newSelections = { ...selections };
    if (multi) {
      const current = selections[category] || [];
      newSelections[category] = current.includes(value) 
        ? current.filter((v: any) => v !== value) 
        : [...current, value];
    } else {
      newSelections[category] = value;
    }
    setSelections(newSelections);
    onSaveSelections(newSelections);
  };

  const handleInstantSave = () => {
    const outputText = pageConfig?.generateOutput(selections) || '';
    const newPlan: SavedPlan = {
      id: Date.now().toString(),
      title: pageConfig?.title || 'Clinical Entry',
      content: outputText,
      role: role,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      selections: { ...fullGlobalSelections, [view]: selections }
    };
    
    const existing = JSON.parse(localStorage.getItem('wellness_plans') || '[]');
    localStorage.setItem('wellness_plans', JSON.stringify([newPlan, ...existing]));
    
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (isWizard && onNextStep) onNextStep();
    }, 1200);
  };

  if (!pageConfig) return null;

  return (
    <div className="w-full max-w-4xl mt-12 pb-24 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center text-[#1e3a8a] font-black tracking-[0.2em] text-[10px] uppercase hover:opacity-50 transition-opacity">
          ← DASHBOARD
        </button>
        {isWizard && (
          <div className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-[0.3em] bg-white/50 px-5 py-2 rounded-full border border-white/60">
            PHASE {stepNumber} / {totalSteps}
          </div>
        )}
      </div>

      <div className="p-12 rounded-[3rem] frosted-glass relative overflow-hidden shadow-2xl">
        {saveSuccess && (
          <div className="absolute top-0 left-0 right-0 py-4 bg-green-500 text-white text-center font-bold tracking-[0.3em] text-[10px] animate-in slide-in-from-top duration-500 z-50 uppercase">
            Record Securely Synchronized
          </div>
        )}

        <div className="text-center mb-12">
            <h2 className="serif-heading text-3xl font-normal tracking-[0.05em] text-[#1e3a8a] uppercase mb-2">{pageConfig.title}</h2>
            {pageConfig.instructions && <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{pageConfig.instructions}</p>}
        </div>
        
        <div className="mb-16 space-y-12">
          {pageConfig.sections.map((section, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <h4 className="text-[#1e3a8a] text-[11px] font-black tracking-[0.3em] uppercase mb-6 opacity-30 flex items-center gap-4">
                  <span className="w-8 h-px bg-[#1e3a8a]/20"></span>
                  {section.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.options.map((opt) => {
                  const isSelected = section.multi 
                    ? (selections[section.category] || []).includes(opt.value) 
                    : selections[section.category] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      disabled={view === AppViews.PSYCH_PLAN_VIEW}
                      onClick={() => handleSelection(section.category, opt.value, section.multi)}
                      className={`text-left px-6 py-5 rounded-2xl border transition-all duration-500 flex justify-between items-center group
                        ${isSelected 
                          ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-xl scale-[1.02]' 
                          : 'bg-white/20 border-white/40 text-[#1e293b] hover:bg-white/40 hover:border-blue-200'}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">{opt.label}</span>
                        {opt.recommended && !isSelected && <span className="text-[9px] uppercase tracking-widest text-blue-400 mt-1 font-black">Suggested</span>}
                      </div>
                      {isSelected && <span className="w-6 h-6 bg-white/20 text-white rounded-full flex items-center justify-center text-[10px] border border-white/30 backdrop-blur-md">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!showOutput ? (
          <button onClick={() => setShowOutput(true)} className="w-full py-7 btn-premium text-white font-bold tracking-[0.5em] uppercase text-[11px] rounded-[2rem] shadow-2xl transition-all hover:scale-[1.01] active:scale-95">
            Process Clinical Synthesis
          </button>
        ) : (
          <div className="mt-8 p-12 bg-blue-50/70 rounded-[3rem] border border-white/60 animate-in slide-in-from-bottom-8 duration-700 backdrop-blur-2xl">
            <div className="flex justify-between items-start mb-8">
              <h4 className="text-[#1e3a8a] text-[10px] font-black tracking-[0.5em] uppercase border-b-2 border-[#1e3a8a]/20 pb-2">Synthesis Result</h4>
              <span className="text-[9px] font-mono text-blue-300 tracking-tighter">CLINICAL-V.1.0-READY</span>
            </div>
            <p className="text-[#1e293b] text-2xl italic leading-[1.8] font-light font-serif">"{pageConfig.generateOutput(selections)}"</p>
            
            <div className="mt-16 pt-10 border-t border-blue-200/40 flex justify-between items-center">
              <button onClick={() => setShowOutput(false)} className="text-[#1e3a8a] text-[10px] font-bold tracking-[0.3em] uppercase hover:opacity-50 transition-opacity">Edit Input</button>
              <button onClick={handleInstantSave} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase hover:scale-105 active:scale-95 transition-all shadow-2xl">
                {isWizard ? 'CONFIRM & CONTINUE' : 'FINALIZE ENTRY'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalPage;
