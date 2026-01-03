
import React, { useState } from 'react';
import { 
  Star, 
  Send, 
  ShieldCheck, 
  MessageSquare, 
  LayoutList, 
  BarChart3, 
  Sparkles,
  Search,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { summarizeFeedback } from '../services/geminiService';

interface FeedbackItem {
  id: string;
  date: string;
  patientName: string;
  rating: number;
  processComment: string;
  profComment: string;
  systemComment: string;
  isAnonymous: boolean;
}

const MOCK_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'f1',
    date: '2024-05-18',
    patientName: 'João Silva',
    rating: 5,
    processComment: 'Processo muito claro e acolhedor.',
    profComment: 'Dra. Silva foi extremamente profissional.',
    systemComment: 'Fácil de usar e agendar.',
    isAnonymous: false
  },
  {
    id: 'f2',
    date: '2024-05-19',
    patientName: 'Anônimo',
    rating: 3,
    processComment: 'Achei o tempo de espera um pouco longo.',
    profComment: 'Atendimento bom.',
    systemComment: 'O sistema de upload de documentos demorou a carregar.',
    isAnonymous: true
  }
];

const Feedback: React.FC = () => {
  const [viewMode, setViewMode] = useState<'patient' | 'admin'>('admin');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Patient Form States
  const [rating, setRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const summary = await summarizeFeedback(MOCK_FEEDBACKS);
      setAiSummary(summary || '');
    } catch (error) {
      alert("Erro ao gerar resumo AI.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Módulo de Feedback</h2>
          <p className="text-slate-500">Qualidade do atendimento e experiência do sistema.</p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-slate-100 flex gap-1">
          <button 
            onClick={() => setViewMode('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'admin' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Administrativo
          </button>
          <button 
            onClick={() => setViewMode('patient')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'patient' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Modo Paciente
          </button>
        </div>
      </div>

      {viewMode === 'patient' ? (
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center text-teal-600 mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Obrigado pelo seu Feedback!</h3>
              <p className="text-slate-500 text-lg">Suas respostas nos ajudam a melhorar continuamente nossos serviços de neuropsicologia.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
              >
                Enviar outro feedback
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">Como foi sua experiência?</h3>
                <p className="text-slate-500">Sua opinião é fundamental para nossa clínica.</p>
              </div>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={`transition-all hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                  >
                    <Star size={48} fill={rating >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Processo de Avaliação</label>
                  <textarea placeholder="O que achou das sessões, prazos e clareza das informações?" rows={3} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Profissional Responsável</label>
                  <textarea placeholder="Sua percepção sobre o atendimento do neuropsicólogo." rows={3} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sistema Gestor T</label>
                  <textarea placeholder="Facilidade de uso, agendamento e acesso a documentos." rows={3} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-teal-600" size={24} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Deseja ser anônimo?</p>
                    <p className="text-xs text-slate-500">Seus dados não serão vinculados à clínica.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isAnonymous ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAnonymous ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <button 
                onClick={() => setSubmitted(true)}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition-all"
              >
                <Send size={20} />
                Enviar Avaliação
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Filtrar feedbacks..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm" />
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-100"><LayoutList size={18} /></button>
                <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-100"><BarChart3 size={18} /></button>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_FEEDBACKS.map(f => (
                <div key={f.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${f.isAnonymous ? 'bg-slate-100 text-slate-400' : 'bg-teal-50 text-teal-700'}`}>
                        {f.isAnonymous ? '?' : f.patientName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{f.isAnonymous ? 'Paciente Anônimo' : f.patientName}</h4>
                        <p className="text-xs text-slate-400">{f.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} fill={f.rating >= s ? '#fbbf24' : 'none'} className={f.rating >= s ? 'text-amber-400' : 'text-slate-200'} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Processo</p>
                      <p className="text-sm text-slate-600 italic">"{f.processComment}"</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Profissional</p>
                      <p className="text-sm text-slate-600 italic">"{f.profComment}"</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sistema</p>
                      <p className="text-sm text-slate-600 italic">"{f.systemComment}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Métricas Gerais</h3>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">Maio 2024</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Média de Satisfação</span>
                  <span className="text-lg font-bold text-slate-800">4.1/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Taxa de Resposta</span>
                  <span className="text-lg font-bold text-slate-800">68%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-[82%]" />
                </div>
                <p className="text-[10px] text-slate-400">82% dos pacientes recomendariam a clínica.</p>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Sparkles size={120} />
              </div>
              <div className="relative z-10">
                <div className="bg-teal-600/30 p-2 w-fit rounded-lg mb-4">
                  <Sparkles size={24} className="text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Insight Dashboard</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Deixe o Gemini analisar todos os feedbacks para extrair padrões, críticas construtivas e elogios automáticos.</p>
                
                {aiSummary ? (
                  <div className="bg-white/10 p-4 rounded-xl text-xs text-slate-200 leading-relaxed mb-6 animate-in fade-in duration-500 whitespace-pre-line">
                    {aiSummary}
                  </div>
                ) : null}

                <button 
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSummarizing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {isSummarizing ? 'Analisando feedbacks...' : 'Gerar Relatório de Sentimento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
