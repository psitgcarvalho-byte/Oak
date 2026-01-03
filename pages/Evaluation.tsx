
import React, { useState, useContext, useEffect } from 'react';
import { 
  Plus, 
  Brain, 
  Search, 
  LineChart as ChartIcon, 
  History,
  FileUp,
  Save,
  Sparkles,
  Loader2,
  Stethoscope,
  ChevronRight,
  Info,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { MOCK_TESTS, MOCK_PATIENTS } from '../constants';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { LanguageContext } from '../App';
import { useTranslation } from '../services/i18n';
import { analyzeDiagnosticHypothesis } from '../services/geminiService';
import { NeuroTest, TestResult } from '../types';

const Evaluation: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = useTranslation(lang);
  
  // States
  const [selectedPatientId, setSelectedPatientId] = useState(MOCK_PATIENTS[0].id);
  const [activeTab, setActiveTab] = useState<'tests' | 'results' | 'diagnosis'>('tests');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<NeuroTest | null>(null);
  
  // Dynamic session results
  const [sessionResults, setSessionResults] = useState<TestResult[]>([]);
  
  // Form states
  const [rawScore, setRawScore] = useState('');
  const [standardScore, setStandardScore] = useState('');
  const [percentile, setPercentile] = useState('');
  const [obs, setObs] = useState('');

  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);

  const handleSaveResult = () => {
    if (!selectedTest) return;
    
    const newResult: TestResult = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: selectedPatientId,
      testId: selectedTest.id,
      rawScore: Number(rawScore),
      standardScore: Number(standardScore),
      percentile: Number(percentile),
      date: new Date().toISOString(),
      observations: obs
    };

    setSessionResults([...sessionResults, newResult]);
    
    // Reset form
    setRawScore('');
    setStandardScore('');
    setPercentile('');
    setObs('');
    setSelectedTest(null);
    setActiveTab('tests'); // Go back to catalogue to pick another or proceed
  };

  const handleRemoveResult = (id: string) => {
    setSessionResults(sessionResults.filter(r => r.id !== id));
  };

  const handleAIAnalysis = async () => {
    if (sessionResults.length === 0) {
      alert("Por favor, registre pelo menos um resultado de teste antes da análise.");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    const resultsStr = sessionResults
      .map(r => {
        const testName = MOCK_TESTS.find(t => t.id === r.testId)?.name || 'Teste';
        return `${testName}: Bruto=${r.rawScore}, Padrão=${r.standardScore}, Percentil=${r.percentile}. Obs: ${r.observations}`;
      })
      .join("\n");
      
    try {
      const result = await analyzeDiagnosticHypothesis(selectedPatient?.anamnesis || '', resultsStr, lang);
      setAnalysisResult(result || '');
      setActiveTab('diagnosis');
    } catch (err) {
      alert("Erro na análise profunda. Verifique sua conexão e chave API.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Radar Data calculation based on session results
  const getRadarData = () => {
    const base = [
      { subject: 'Atenção', A: 100 },
      { subject: 'Memória', A: 100 },
      { subject: 'Executivo', A: 100 },
      { subject: 'Linguagem', A: 100 },
      { subject: 'Visuoespacial', A: 100 },
      { subject: 'Inteligência', A: 100 },
    ];

    if (sessionResults.length === 0) return base;

    // Mapping domains to radar subjects (simplification)
    return base.map(b => {
      const relevant = sessionResults.filter(r => {
        const test = MOCK_TESTS.find(mt => mt.id === r.testId);
        return test?.domain.toLowerCase().includes(b.subject.toLowerCase().substring(0, 4));
      });
      if (relevant.length === 0) return b;
      const avg = relevant.reduce((acc, curr) => acc + curr.standardScore, 0) / relevant.length;
      return { ...b, A: avg };
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{t('evaluations')}</h2>
          <p className="text-slate-500">Fluxo dinâmico de testagem e síntese diagnóstica diferencial.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all">
            <History size={18} />
            {t('history')}
          </button>
          <button 
            onClick={handleAIAnalysis}
            disabled={isAnalyzing || sessionResults.length === 0}
            className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-600 flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Análise Diferencial IA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Paciente em Atendimento</label>
            <div className="relative">
              <select 
                className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer text-slate-800 font-medium"
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setSessionResults([]); // Reset session when patient changes
                }}
              >
                {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setActiveTab('tests')}
              className={`w-full flex items-center gap-3 px-6 py-4 border-b border-slate-50 transition-all ${activeTab === 'tests' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Brain size={20} />
              <span>Catálogo ({MOCK_TESTS.length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('results')}
              className={`w-full flex items-center justify-between px-6 py-4 border-b border-slate-50 transition-all ${activeTab === 'results' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <ChartIcon size={20} />
                <span>Resultados Lançados</span>
              </div>
              <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full font-bold">{sessionResults.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('diagnosis')}
              className={`w-full flex items-center gap-3 px-6 py-4 border-b border-slate-50 transition-all ${activeTab === 'diagnosis' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Stethoscope size={20} />
              <span>Síntese & Diferencial</span>
            </button>
            <div className="p-6">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Perfil Cognitivo Dinâmico</h4>
               <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData()}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748b'}} />
                      <Radar name="Pacientes" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
               <p className="text-[10px] text-center text-slate-400 mt-2">Valores baseados em Pontuação Padrão (Média=100)</p>
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[650px] relative">
          
          {activeTab === 'tests' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Escolha o Instrumento</h3>
                  <p className="text-sm text-slate-500">Selecione para iniciar o lançamento de escores.</p>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar teste..." className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_TESTS.map(test => {
                  const alreadyApplied = sessionResults.some(r => r.testId === test.id);
                  return (
                    <div 
                      key={test.id} 
                      onClick={() => { setSelectedTest(test); setActiveTab('results'); }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${alreadyApplied ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-teal-50/10'}`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold transition-colors ${alreadyApplied ? 'text-emerald-700' : 'text-slate-800 group-hover:text-teal-700'}`}>{test.name}</h4>
                          {alreadyApplied && <CheckCircle size={16} className="text-emerald-500" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{test.domain}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{test.description}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">Aplicar agora →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
             <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
               {selectedTest ? (
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-teal-50 rounded-2xl border border-teal-100">
                      <div className="flex items-center gap-3">
                        <Brain className="text-teal-600" size={24} />
                        <div>
                          <h3 className="font-bold text-teal-900">{selectedTest.name}</h3>
                          <p className="text-xs text-teal-700 uppercase font-bold">{selectedTest.domain}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedTest(null)} className="text-xs font-bold text-teal-600 hover:underline">Trocar Teste</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Ponto Bruto</label>
                        <input value={rawScore} onChange={e => setRawScore(e.target.value)} type="number" className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ex: 50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Ponto Padrão (Z/QI/SS)</label>
                        <input value={standardScore} onChange={e => setStandardScore(e.target.value)} type="number" className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ex: 100" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Percentil (%)</label>
                        <input value={percentile} onChange={e => setPercentile(e.target.value)} type="number" className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ex: 50" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Observações Qualitativas / Erros Tipo</label>
                      <textarea value={obs} onChange={e => setObs(e.target.value)} rows={6} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Descreva comportamentos específicos, tipo de erro (omissão, comissão), tempo de execução e estratégias utilizadas..." />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setSelectedTest(null); setActiveTab('tests'); }} className="px-6 py-3 text-slate-500 font-bold">Cancelar</button>
                      <button 
                        onClick={handleSaveResult}
                        disabled={!rawScore || !standardScore}
                        className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 disabled:opacity-50"
                      >
                        Salvar e Continuar
                      </button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                   <h3 className="text-xl font-bold text-slate-800">Resultados da Sessão Atual</h3>
                   {sessionResults.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                       <div className="bg-slate-50 p-6 rounded-full text-slate-300"><ChartIcon size={48} /></div>
                       <p className="text-slate-500 max-w-xs">Nenhum teste lançado para este paciente hoje. Vá ao catálogo para começar.</p>
                       <button onClick={() => setActiveTab('tests')} className="text-teal-600 font-bold hover:underline">Ver Catálogo de Testes</button>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        {sessionResults.map(res => {
                          const test = MOCK_TESTS.find(mt => mt.id === res.testId);
                          return (
                            <div key={res.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between group hover:border-teal-100 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><Brain size={20} /></div>
                                <div>
                                  <h4 className="font-bold text-slate-800">{test?.name}</h4>
                                  <div className="flex gap-4 mt-1">
                                    <span className="text-xs text-slate-500">SS: <strong>{res.standardScore}</strong></span>
                                    <span className="text-xs text-slate-500">Percentil: <strong>{res.percentile}%</strong></span>
                                  </div>
                                </div>
                              </div>
                              <button onClick={() => handleRemoveResult(res.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                            </div>
                          );
                        })}
                        <div className="pt-6 flex justify-between items-center">
                          <button onClick={() => setActiveTab('tests')} className="flex items-center gap-2 text-teal-600 font-bold hover:underline"><Plus size={18} /> Lançar outro teste</button>
                          <button 
                            onClick={handleAIAnalysis}
                            className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                          >
                            Proceder para Análise IA
                          </button>
                        </div>
                     </div>
                   )}
                 </div>
               )}
             </div>
          )}

          {activeTab === 'diagnosis' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Síntese Neuropsicológica</h3>
                  <p className="text-sm text-slate-500">Fundamentação baseada em evidências quantitativas e qualitativas.</p>
                </div>
                <button 
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing || sessionResults.length === 0}
                  className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors"
                >
                  Regerar Análise
                </button>
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                  <div className="relative">
                    <Loader2 size={64} className="animate-spin text-amber-500" />
                    <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-slate-800 text-lg">Raciocínio Clínico em curso...</h4>
                    <p className="text-slate-500 max-w-sm">O Gemini 3 Pro está cruzando dados do DSM-5 e CID-11 com os escores de {selectedPatient?.name}.</p>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  <div className="bg-amber-50 p-8 rounded-3xl border-2 border-amber-100 shadow-xl shadow-amber-900/5 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-2 text-amber-600 mb-6 font-bold text-[10px] uppercase tracking-widest bg-white w-fit px-4 py-1.5 rounded-full border border-amber-100">
                      <Sparkles size={14} /> Laudo Hipotético & Diferencial
                    </div>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-serif text-lg whitespace-pre-line bg-white/60 p-8 rounded-2xl border border-white">
                      {analysisResult}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl text-xs flex gap-3">
                      <Info size={24} className="flex-shrink-0" />
                      <p><strong>Diferencial:</strong> A análise acima prioriza a exclusão de comorbidades mimetizadoras para garantir a precisão diagnóstica.</p>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs flex gap-3">
                      <CheckCircle size={24} className="flex-shrink-0" />
                      <p><strong>Evidência:</strong> Justificativa baseada estritamente nos desvios padrão observados na sessão atual.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 border-2 border-dashed border-slate-100 rounded-3xl">
                  <div className="bg-amber-50 p-6 rounded-full text-amber-500 animate-pulse">
                    <Stethoscope size={64} />
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Sem análise gerada</h4>
                    <p className="text-slate-500 mb-6">Lance os resultados dos testes no catálogo para que a IA possa fundamentar as hipóteses diagnósticas.</p>
                    <button onClick={() => setActiveTab('tests')} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-600/20">Ir para Catálogo</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
