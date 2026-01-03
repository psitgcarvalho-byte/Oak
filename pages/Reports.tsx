
import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Share2, 
  Trash2,
  ChevronRight,
  Loader2,
  FileSearch,
  CheckCircle2
} from 'lucide-react';
import { generateReportDraft } from '../services/geminiService';
import { MOCK_PATIENTS } from '../constants';

const Reports: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(MOCK_PATIENTS[0].id);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const patient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);
    if (!patient) return;

    try {
      // For demo purposes, we pass mock data
      const mockResults = "WISC-IV: Full Scale IQ 105 (Average). RAVLT: Significant difficulty in delayed recall. Stroop: Good interference control.";
      const draft = await generateReportDraft(patient.anamnesis, mockResults);
      setContent(draft || '');
      setShowEditor(true);
    } catch (err) {
      alert("Error generating report. Check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Reports</h2>
          <p className="text-slate-500">Generate, edit and sign clinical reports.</p>
        </div>
        <button className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 flex items-center gap-2 shadow-lg shadow-teal-600/20">
          <FileText size={20} />
          New Blank Report
        </button>
      </div>

      {!showEditor ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles className="text-teal-600" size={24} />
                Report Assistant (AI Powered)
              </h3>
              <p className="text-slate-600 mb-8">
                The assistant uses patient anamnesis and recorded test scores to generate a professional draft. 
                You can then refine and add your clinical impressions.
              </p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Patient</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                  >
                    {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  {isGenerating ? 'Synthesizing Data...' : 'Generate Clinical Draft'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Recent Reports</h3>
                <button className="text-teal-600 text-sm font-medium hover:underline">View Archived</button>
              </div>
              <div className="divide-y divide-slate-50">
                {[1, 2].map(i => (
                  <div key={i} className="px-6 py-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                        <FileSearch size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">Complete Evaluation - João Silva</h4>
                        <p className="text-xs text-slate-500">Last edited: 2 days ago • PDF Generated</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-teal-600"><Share2 size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-teal-600"><Download size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                      <ChevronRight className="text-slate-300 ml-2" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-2xl text-white shadow-lg shadow-teal-900/20">
               <div className="bg-white/20 p-2 w-fit rounded-lg mb-4">
                 <CheckCircle2 size={24} />
               </div>
               <h3 className="text-xl font-bold mb-2">Ready to sign?</h3>
               <p className="text-teal-100 text-sm mb-6">You have 3 reports awaiting your digital signature for formal release.</p>
               <button className="w-full py-3 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors">
                 Go to Signature Queue
               </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
           <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Report Editor</h3>
              <div className="flex gap-3">
                <button onClick={() => setShowEditor(false)} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-800">Cancel</button>
                <button className="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 flex items-center gap-2">
                  <Download size={18} />
                  Export PDF
                </button>
              </div>
           </div>
           
           <div className="bg-slate-50 p-4 rounded-xl mb-6 flex gap-4 text-xs font-bold text-slate-400">
             <button className="px-3 py-1 bg-white shadow-sm rounded text-slate-800 uppercase">Bold</button>
             <button className="px-3 py-1 hover:bg-white transition-all rounded uppercase">Italic</button>
             <button className="px-3 py-1 hover:bg-white transition-all rounded uppercase">List</button>
             <button className="px-3 py-1 hover:bg-white transition-all rounded uppercase">Insert Chart</button>
             <div className="border-l border-slate-200 h-6"></div>
             <button className="px-3 py-1 hover:bg-white transition-all rounded uppercase text-teal-600">Dynamic Variables</button>
           </div>

           <textarea 
            className="w-full h-[600px] p-8 border-none bg-slate-50/30 rounded-2xl text-slate-800 leading-relaxed font-serif focus:ring-0 outline-none resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
           />
        </div>
      )}
    </div>
  );
};

export default Reports;
