
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SavedPlan, AppViews } from '../types.ts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface SavedPrescriptionsProps {
  onBack: () => void;
  initialSelectedId?: string;
}

const SavedPrescriptions: React.FC<SavedPrescriptionsProps> = ({ onBack, initialSelectedId }) => {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);
  const [viewMode, setViewMode] = useState<'individual' | 'combined'>('individual');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');

  const prescriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wellness_plans') || '[]');
    setPlans(saved);
    
    if (initialSelectedId) {
      const plan = saved.find((p: SavedPlan) => p.id === initialSelectedId);
      if (plan) {
        setSelectedPlan(plan);
      }
    } else if (saved.length > 0 && !selectedPlan) {
      setSelectedPlan(saved[0]);
    }
  }, [initialSelectedId]);

  const combinedData = useMemo(() => {
    const latestByCategory: Record<string, SavedPlan> = {};
    [...plans].reverse().forEach(plan => {
      latestByCategory[plan.title] = plan;
    });
    return latestByCategory;
  }, [plans]);

  const getCombinedVal = (view: AppViews, category: string, defaultVal: string = 'N/A') => {
    const titleMap: Record<string, string> = {
      [AppViews.SOUND]: 'SOUND THERAPY',
      [AppViews.AYURVEDIC]: 'AYURVEDIC SUPPLEMENTS',
      [AppViews.BEHAVIORAL]: 'BEHAVIORAL PRESCRIPTIONS',
      [AppViews.DETOX]: 'DIGITAL DETOX PROTOCOL',
      [AppViews.CBT]: 'CBT / DBT HOMEWORK',
      [AppViews.MOOD]: 'DAILY MOOD TRACKING',
    };

    const targetTitle = titleMap[view];
    const plan = combinedData[targetTitle];
    if (!plan) return defaultVal;

    const section = plan.selections[view];
    if (!section) return defaultVal;
    
    const val = section[category];
    if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : defaultVal;
    return val || defaultVal;
  };

  const handleOpenCombined = () => {
    setShowDetailsModal(true);
  };

  const finalizeCombined = () => {
    setShowDetailsModal(false);
    setViewMode('combined');
  };

  const handleDownloadPDF = async () => {
    if (!prescriptionRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const element = prescriptionRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollY: -window.scrollY, 
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210; 
      const imgProps = { width: canvas.width, height: canvas.height };
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const safeName = (patientName || 'Patient').trim().replace(/\s+/g, '_');
      pdf.save(`Prescription_${safeName}.pdf`);

    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderCombinedPrescription = () => {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return (
      <div className="flex flex-col items-center">
        <div 
          ref={prescriptionRef}
          className="bg-white p-12 md:p-16 border border-gray-100 shadow-2xl rounded-sm max-w-4xl mx-auto clinical-paper-bg select-all animate-in zoom-in-95 duration-1000 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 24 24" fill="#1e3a8a">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
          </div>

          <div className="flex justify-between items-start border-b-2 border-[#1e3a8a] pb-8 mb-10 relative z-10">
            <div>
              <h1 className="serif-heading text-4xl text-[#1e3a8a] font-bold tracking-tighter uppercase mb-1">Clinic of Psychotherapy</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold italic">Holistic Wellness & Behavioral Medicine</p>
            </div>
            <div className="text-right text-[11px] text-[#1e3a8a] opacity-60 leading-relaxed font-mono">
              ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}<br />
              GEN-REF: {new Date().getTime().toString().substr(-6)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12 relative z-10">
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Patient Name</label>
                <div className="text-lg font-medium text-[#1e293b] border-b border-gray-100 pb-1">{patientName || "[Unnamed Patient]"}</div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Prescribing Clinician</label>
                <div className="text-lg font-medium text-[#1e293b] border-b border-gray-100 pb-1">Dr. {doctorName || "[Clinician]"}</div>
              </div>
            </div>
            <div className="text-right">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Prescription Date</label>
              <div className="text-lg font-medium text-[#1e293b]">{today}</div>
            </div>
          </div>

          <div className="bg-[#1e3a8a] text-white px-6 py-2 rounded-sm text-[11px] font-bold tracking-[0.4em] uppercase mb-10 inline-block relative z-10">
            Prescription Rx
          </div>

          <div className="space-y-10 mb-16 font-serif text-gray-800 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <section className="relative group">
                <div className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest mb-2 border-l-4 border-[#1e3a8a] pl-3">I. Neuro-Acoustic Stimulation</div>
                <div className="text-sm leading-relaxed pl-4 border-l border-gray-100">
                  Patient is to engage in <span className="font-semibold">{getCombinedVal(AppViews.SOUND, 'frequency')}</span> sound therapy for <span className="font-semibold">{getCombinedVal(AppViews.SOUND, 'duration')}</span> specifically during the <span className="font-semibold">{getCombinedVal(AppViews.SOUND, 'timing')}</span>.
                </div>
              </section>

              <section className="relative group">
                <div className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest mb-2 border-l-4 border-[#1e3a8a] pl-3">II. Nutraceutical Support</div>
                <div className="text-sm leading-relaxed pl-4 border-l border-gray-100">
                  Administration of <span className="font-semibold">{getCombinedVal(AppViews.AYURVEDIC, 'supplement')} {getCombinedVal(AppViews.AYURVEDIC, 'dosage')}</span> daily, recommended <span className="font-semibold">{getCombinedVal(AppViews.AYURVEDIC, 'timing')}</span>.
                </div>
              </section>

              <section className="relative group">
                <div className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest mb-2 border-l-4 border-[#1e3a8a] pl-3">III. Behavioral Intervention</div>
                <div className="text-sm leading-relaxed pl-4 border-l border-gray-100">
                  Prescribed behavior: <span className="font-semibold">{getCombinedVal(AppViews.BEHAVIORAL, 'core')}</span>. Dosage: <span className="font-semibold">{getCombinedVal(AppViews.BEHAVIORAL, 'frequency')}</span>.
                </div>
              </section>

              <section className="relative group">
                <div className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest mb-2 border-l-4 border-[#1e3a8a] pl-3">IV. Digital Hygiene Protocol</div>
                <div className="text-sm leading-relaxed pl-4 border-l border-gray-100 italic">
                  {getCombinedVal(AppViews.DETOX, 'evening')}. Morning constraint: {getCombinedVal(AppViews.DETOX, 'morning', 'Active focus routine')}.
                </div>
              </section>

              <section className="relative group">
                <div className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest mb-2 border-l-4 border-[#1e3a8a] pl-3">V. Clinical Homework</div>
                <div className="text-sm leading-relaxed pl-4 border-l border-gray-100">
                  Target areas: <span className="font-semibold">{getCombinedVal(AppViews.CBT, 'assignments')}</span>. Regular notation requested.
                </div>
              </section>

              <section className="relative group">
                <div className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-widest mb-2 border-l-4 border-[#1e3a8a] pl-3">VI. Objective Data Tracking</div>
                <div className="text-sm leading-relaxed pl-4 border-l border-gray-100">
                  Monitoring metrics: <span className="font-semibold">{getCombinedVal(AppViews.MOOD, 'metrics')}</span> via <span className="font-semibold">{getCombinedVal(AppViews.MOOD, 'method')}</span>.
                </div>
              </section>
            </div>
          </div>

          <div className="mt-20 border-t border-gray-100 pt-12 flex justify-between items-end relative z-10">
            <div className="text-[9px] text-gray-400 font-mono space-y-1">
              <p>NOTE: THIS DOCUMENT IS FOR THERAPEUTIC GUIDANCE ONLY.</p>
              <p>© {new Date().getFullYear()} PSYCHOLOGIST CLINICAL PORTAL</p>
            </div>
            <div className="text-center">
              <div className="signature-font text-3xl text-[#1e3a8a] mb-2">{doctorName ? `Dr. ${doctorName}` : "Psychologist Signature"}</div>
              <div className="w-64 h-px bg-gray-300 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Authorized Clinician Signature</p>
            </div>
          </div>
        </div>

        <div className="mt-16 w-full max-w-4xl pt-8 border-t border-dashed border-gray-200 flex justify-between items-center print:hidden">
          <button 
            onClick={() => setViewMode('individual')}
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1e3a8a] transition-colors"
          >
            ← Back to Records
          </button>
          <div className="flex gap-4">
            <button 
                onClick={handleDownloadPDF} 
                disabled={isGenerating}
                className="bg-[#1e3a8a] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
                {isGenerating ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mt-12 pb-24 animate-in fade-in duration-700 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 print:hidden">
        <button onClick={onBack} className="flex items-center text-[#1e3a8a] font-medium hover:opacity-70 transition-opacity">
          Back to Dashboard
        </button>
        <button 
          onClick={handleOpenCombined}
          className="bg-white/60 backdrop-blur-md border border-[#1e3a8a]/20 text-[#1e3a8a] px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-[#1e3a8a] hover:text-white transition-all duration-500"
        >
          Generate Prescription
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 print:hidden">
          <h3 className="serif-heading text-xl text-[#1e3a8a] uppercase tracking-widest mb-6 border-b border-[#1e3a8a]/10 pb-2">Record History</h3>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {plans.map(plan => (
              <button 
                key={plan.id} 
                onClick={() => {
                  setSelectedPlan(plan);
                  setViewMode('individual');
                }}
                className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 ${selectedPlan?.id === plan.id && viewMode === 'individual' ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-lg scale-[1.02]' : 'bg-white/70 border-white/60 text-[#1e293b] hover:bg-white/90'}`}
              >
                <div className="font-bold text-sm uppercase tracking-wider mb-1">{plan.title}</div>
                <div className="text-[10px] uppercase tracking-tighter opacity-60">{plan.date}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 lg:p-12 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/60 premium-shadow min-h-[500px] flex flex-col overflow-hidden">
          {viewMode === 'combined' ? renderCombinedPrescription() : selectedPlan ? (
            <div className="animate-in fade-in duration-500">
              <h2 className="serif-heading text-2xl text-[#1e3a8a] uppercase tracking-widest mb-6">{selectedPlan.title}</h2>
              <div className="p-8 bg-white/30 rounded-3xl border border-white/20 italic text-[#1e293b] leading-relaxed text-xl font-light">
                "{selectedPlan.content}"
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 min-h-[400px]">
              <p className="tracking-widest uppercase text-xs font-medium">Select a saved record</p>
            </div>
          )}
        </div>
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl">
                <h3 className="serif-heading text-3xl font-bold text-[#1e3a8a] mb-8 text-center uppercase tracking-tighter">Plan Details</h3>
                <div className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Patient Name</label>
                        <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-medium text-[#1e293b]" placeholder="John Doe" autoFocus />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Psychologist Name</label>
                        <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-medium text-[#1e293b]" placeholder="Smith" />
                    </div>
                </div>
                <div className="mt-12 flex gap-4">
                    <button onClick={() => setShowDetailsModal(false)} className="flex-1 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Cancel</button>
                    <button onClick={finalizeCombined} disabled={!patientName || !doctorName} className="flex-1 py-5 bg-[#1e3a8a] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-20 transition-all">Finalize</button>
                </div>
            </div>
        </div>
      )}
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');
        .signature-font { font-family: 'Dancing Script', cursive; }
        .clinical-paper-bg { background-image: radial-gradient(#e5e7eb 0.5px, transparent 0.5px); background-size: 20px 20px; background-color: #ffffff; }
      `}</style>
    </div>
  );
};

export default SavedPrescriptions;
