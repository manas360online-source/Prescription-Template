
import React, { useState } from 'react';
import { generateWellnessPlan } from '../services/geminiService';

interface GeneratorModalProps {
  onClose: () => void;
}

const GeneratorModal: React.FC<GeneratorModalProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const plan = await generateWellnessPlan(input);
      setResult(plan || 'Failed to generate plan.');
    } catch (err) {
      console.error(err);
      setResult('An error occurred while generating the plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="serif-heading text-2xl font-semibold text-[#1e3a8a] uppercase tracking-wide">
            AI Prescription Generator
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 flex-grow overflow-y-auto">
          {!result ? (
            <div className="space-y-6">
              <p className="text-gray-600 font-light">
                Describe the patient's current symptoms, stress levels, or specific therapeutic goals to generate a tailored holistic wellness plan.
              </p>
              <textarea 
                className="w-full h-40 p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all resize-none text-gray-700"
                placeholder="e.g., Patient is experiencing high work-related anxiety, poor sleep quality, and digital burnout..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className="w-full py-4 rounded-xl text-white font-medium shadow-md transition-all duration-300 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}
              >
                {loading ? 'Analyzing Clinical Data...' : 'Generate Wellness Template'}
              </button>
            </div>
          ) : (
            <div className="prose prose-blue max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 font-light leading-relaxed">
                {result}
              </div>
              <button 
                onClick={() => setResult(null)}
                className="mt-8 text-blue-600 font-medium hover:text-blue-800 transition-colors underline underline-offset-4"
              >
                Back to Input
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratorModal;
